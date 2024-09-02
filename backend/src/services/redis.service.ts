import { createClient } from 'redis';
import { AppConfig } from '../configs/app.config';
import { REDIS_STATUS } from '../libs/contants/redis';
import { InventoryRepo } from '../repo/inventory.repo';
import { AppError } from '../erorrs/AppError.error';
import { promisify } from 'util';


interface LockDto {
    productId: string;
    quantity: number;
    cartId: string;
}

const REDIS_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: 'Redis connection timeout'
};

export class RedisService {
    private static redisClient = createClient({
        url: AppConfig.redis.url
    });

    private static pexpire = promisify(this.redisClient.pExpire).bind(this.redisClient);
    private static setnxAsync = promisify(this.redisClient.setNX).bind(this.redisClient);
    private static delAsync = promisify(this.redisClient.del).bind(this.redisClient);

    private static connectionTimeout: NodeJS.Timeout | undefined = undefined;

    static async initRedis() {
        try {
            await this.redisClient.connect();
            await this.handleEventConnect();
        } catch (error) {
            console.error('Error initializing Redis:', error);
        }
    }

    static async handleEventConnect() {
        try {
            const response = await this.redisClient.ping();
            if (response === 'PONG') {
                console.log('Redis server is running');
            } else {
                console.log('Unexpected response from Redis:', response);
            }
        } catch (err) {
            console.error('Error pinging Redis:', err);
        }

        this.redisClient.on(REDIS_STATUS.CONNECT, () => {
            console.log('Redis connected');
            if (this.connectionTimeout) {
                clearTimeout(this.connectionTimeout);
                this.connectionTimeout = undefined;
            }
        });

        this.redisClient.on(REDIS_STATUS.ERROR, (error) => {
            console.error('Redis error', error);
        });

        this.redisClient.on(REDIS_STATUS.END, () => {
            console.log('Redis end');
            this.handleTimeoutError();
        });

        this.redisClient.on(REDIS_STATUS.RECONNECTING, () => {
            console.log('Redis reconnecting');
        });
    }

    static handleTimeoutError() {
        this.connectionTimeout = setTimeout(() => {
            throw new AppError(REDIS_CONNECT_MESSAGE.code, REDIS_CONNECT_MESSAGE.message);
        }, REDIS_TIMEOUT);
    }

    static async closeConnection() {
        try {
            await this.redisClient.quit();
        } catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }

    static async acquireLock({ productId, quantity, cartId }: LockDto) {
        const key = `lock:${productId}`;
        const retryTimes = 10;
        const expire = 3000;


        for (let i = 0; i < retryTimes; i++) {
            try {
                // const result = await this.setnxAsync(key, productId);
                const result = await this.redisClient.setNX(key, productId);
                if (result === true) {

                    const isReservation = await InventoryRepo.reserveInventory({ productId, quantity, cartId });

                    if (isReservation?.isModified) {
                        await this.redisClient.pExpire(key, expire);
                        return key;
                    }

                    return null;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Error acquiring lock:', error);
            }
        }

        return null;
    }

    static async releaseLock(key: string) {
        try {
            await this.redisClient.del(key);
        } catch (error) {
            console.error('Error releasing lock:', error);
        }
    }
}
