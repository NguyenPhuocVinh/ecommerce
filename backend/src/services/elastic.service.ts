import { SpuModel } from "../models/product/spu.model";
import { esClient } from "../dbs/init.elasticsearch";
import { IProduct } from "../models/product/product.v2.model";
export async function syncData() {
    try {
        const products = await SpuModel.find();
        // Index each product in Elasticsearch
        for (const product of products) {
            await esClient.index({
                index: 'products',
                id: product._id.toString(),
                body: {
                    productName: product.productName,
                    price: product.price,
                    isPubished: product.isPublished,
                }
            });
        }

        console.log('Data synced to Elasticsearch');
    } catch (error: any) {
        console.error('Data sync error:', error.message);
    }
};

export class ElasticService {
    //create
    static async createData(payload: IProduct[]) {
        try {
            for (const product of payload) {
                await esClient.index({
                    index: 'products',
                    id: product._id.toString(),
                    body: {
                        payload
                    }
                });
            }
            console.log('Data synced to Elasticsearch');
        } catch (error: any) {
            console.error('Data sync error:', error.message);
        }
    }

    //update
    static async updateProduct({ productId, ...updates }: { productId: string, [key: string]: any }) {
        try {
            const doc = Object.assign({}, updates);

            await esClient.update({
                index: 'products',
                id: productId,
                body: {
                    doc
                }
            })
        } catch (error: any) {
            console.error('Data sync error:', error.message);
        }
    }

    static async searchProduct({ keySearch }: { keySearch: string }) {
        // Fetch suggestions from Elasticsearch
        const suggestionsResponse: any = await esClient.search({
            index: 'products',
            body: {
                suggest: {
                    'product-suggest': {
                        prefix: keySearch,
                        completion: {
                            field: 'productName'
                        }
                    }
                }
            }
        });

        // Retrieve suggestions from the response
        const allSuggestions = suggestionsResponse?.suggest?.['product-suggest']?.[0]?.options || [];


        // Filter based on isPubished and isDraft fields
        const filteredSuggestions = allSuggestions.filter((option: any) =>
            option._source.isPubished === true
        );

        return filteredSuggestions;
    }

}

