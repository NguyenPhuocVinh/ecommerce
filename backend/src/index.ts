import { WebService } from "./services/web.service";
import { InitMongoDB } from "./dbs/init.mongodb";
import { RedisService } from "./services/redis.service";

const start = async () => {
    try {
        await new WebService().start();
        await InitMongoDB.connect();
        await RedisService.initRedis();
    } catch (error: any) {
        console.error(error.message);
    }
};

start();