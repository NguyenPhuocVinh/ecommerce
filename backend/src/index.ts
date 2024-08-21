import { WebService } from "./services/web.service";
import { InitMongoDB } from "./dbs/init.mongodb";

const start = async () => {
    try {
        await InitMongoDB.connect();
        await new WebService().start();
    } catch (error: any) {
        console.error(error.message);
    }
};

start();