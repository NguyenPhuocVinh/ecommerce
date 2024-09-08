import { SpuMModel } from "../models/product/spu.m";
import { esClient } from "../dbs/init.elasticsearch";
export async function syncData() {
    try {
        const products = await SpuMModel.find();
        // Index each product in Elasticsearch
        for (const product of products) {
            await esClient.index({
                index: 'products',
                id: product._id.toString(),
                body: {
                    productName: product.productName,
                    price: product.price,
                    isPubished: product.isPublished,
                    isDraft: product.isDraft,
                }
            });
        }

        console.log('Data synced to Elasticsearch');
    } catch (error: any) {
        console.error('Data sync error:', error.message);
    }
};

export class ElasticService {
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
            option._source.isPubished === true && option._source.isDraft === false
        );

        return filteredSuggestions;

    }

}

