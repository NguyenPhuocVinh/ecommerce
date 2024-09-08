import { Client } from "@elastic/elasticsearch"
import { AppConfig } from "../configs/app.config";
import { AppError } from "../erorrs/AppError.error";

export const esClient = new Client({ node: AppConfig.elasticsearch.url });
export class InitElasticsearch {
    static async connect() {
        try {
            const isElasticsearchRunning = await esClient.ping();
            console.log("Elasticsearch running:", isElasticsearchRunning);
        } catch (error: any) {
            console.log("Error connecting to Elasticsearch: ", error.message);
        }
    }
}