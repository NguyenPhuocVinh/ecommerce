import { SpuModel } from "../models/product/spu.model";
import { esClient } from "../dbs/init.elasticsearch";
import { IProduct, ProductModel } from "../models/product/product.v2.model";
import { StatusCodes } from "http-status-codes";
export async function syncData() {
    try {
        const products = await ProductModel.find();
        // Index each product in Elasticsearch
        for (const product of products) {
            await esClient.index({
                index: 'products',
                id: product._id.toString(),
                body: {
                    productName: product.productName,
                    price: product.price,
                    isPubish: product.isPublish,
                    description: product.description,
                    image: product.image
                }
            });
        }

        console.log('Data synced to Elasticsearch');
    } catch (error: any) {
        console.error('Data sync error:', error.message);
    }
};


export class ElasticService {
    //mapping
    private static async mappingIndex() {
        await esClient.indices.create({
            index: 'products',
            body: {
                settings: {
                    index: {
                        max_ngram_diff: 9
                    },
                    analysis: {
                        tokenizer: {
                            ngram_tokenizer: {
                                type: "ngram",
                                min_gram: 1,
                                max_gram: 2,
                                token_chars: [
                                    "letter",
                                    "digit"
                                ]
                            }
                        },
                        analyzer: {
                            ngram_analyzer: {
                                type: "custom",
                                tokenizer: "ngram_tokenizer"
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        productName: {
                            type: "text",
                            analyzer: "ngram_analyzer"
                        },
                        completionName: {
                            type: "completion"
                        },
                        price: {
                            type: 'double'
                        },
                        isPublish: {
                            type: 'boolean'
                        },
                        description: {
                            type: 'text'
                        },
                        image: {
                            type: 'text'
                        },
                        categoryId: {
                            type: 'keyword'
                        },
                        slug: {
                            type: 'text'
                        }
                    }
                }
            }
        });
    }

    //create
    static async createData(payload: IProduct) {
        const { _id, productName, price, description, isPublish, categoryId, image } = payload;
        try {
            await esClient.indices.get({ index: 'products' });

            await esClient.index({
                index: 'products',
                id: _id,
                body: {
                    productName,
                    completionName: {
                        input: [productName]
                    },
                    price,
                    description,
                    isPublish,
                    categoryId,
                    image
                },
            });

            console.log('Data synced to Elasticsearch');
        } catch (error: any) {
            if (error?.meta?.statusCode === StatusCodes.NOT_FOUND) {
                await this.mappingIndex();
                await esClient.index({
                    index: 'products',
                    id: _id,
                    body: {
                        productName,
                        completionName: {
                            input: [productName],
                            weight: 1
                        },
                        price,
                        description,
                        isPublish,
                        categoryId,
                        image
                    },
                });

                console.log('Data synced to Elasticsearch after creating index');
            } else {
                console.error('Data sync error:', error.message);
            }
        }
    }


    //update
    static async updateProduct({ productId, ...updates }: { productId: string, [key: string]: any }) {
        try {
            const scriptSource = `
                for (field in params.fields.keySet()) {
                    if (field == 'productName') {
                        ctx._source.productName = params.fields[field];
                        ctx._source.completionName.input = [params.fields[field]];
                    } else {
                        ctx._source[field] = params.fields[field];
                    }
                }
            `;
            const params = {
                fields: updates
            };

            console.log(params)

            await esClient.update({
                index: 'products',
                id: productId,
                body: {
                    script: {
                        source: scriptSource,
                        params: params
                    }
                }
            });
        } catch (error: any) {
            console.error('Data sync error:', error.message);
        }
    }

    //search
    static async searchProduct(keySearch: string) {
        const suggestionsResponse: any = await esClient.search({
            index: 'products',
            body: {
                query: {
                    match: {
                        productName: {
                            query: keySearch,
                            operator: "or"
                        }
                    }
                },
                suggest: {
                    'product-suggest': {
                        prefix: keySearch,
                        completion: {
                            field: 'completionName'
                        }
                    }
                }
            }
        });


        const allProducts = suggestionsResponse.hits.hits.map((hit: any) => ({
            _id: hit._id,
            ...hit._source
        }));

        const filteredProducts = allProducts.filter((product: any) => product.isPublish === true);


        return filteredProducts;
    }

}

