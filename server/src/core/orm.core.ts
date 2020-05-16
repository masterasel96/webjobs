import { Connection, ConnectionOptions, createConnection } from "typeorm";

class ORM {
    public connection: Connection | undefined;
    constructor(
    ) { }

    public getConfig(): ConnectionOptions {
        return {
            type: "postgres",
            database: process.env.POSTGRES_DB,
            entities: [
                __dirname + "/../model/**/*.model{.ts,.js}",
            ],
            subscribers: [
                __dirname + "/../dao/subscriber/**/*.subscriber{.ts,.js}",
            ],
            host: process.env.POSTGRES_HOST,
            password: process.env.POSTGRES_PASSWORD,
            port: Number(process.env.POSTGRES_PORT),
            schema: process.env.POSTGRES_SCHEMA,
            synchronize: true,
            username: process.env.POSTGRES_USER
        };
    }

    public async connect(): Promise<Connection> {
        this.connection = await createConnection(this.getConfig());
        return this.connection;
    }
}

const orm = new ORM();
export default orm;