import { WebService } from "./services/web.service";
import { InitMongoDB } from "./dbs/init.mongodb";
import { RedisService } from "./services/redis.service";
import { InitElasticsearch } from "./dbs/init.elasticsearch";
import { syncData } from "./services/elastic.service";


const start = async () => {
    try {
        await new WebService().start();
        await InitMongoDB.connect();
        await RedisService.initRedis();
        await InitElasticsearch.connect();

        // syncData();
    } catch (error: any) {
        console.error(error.message);
    }
};

start();