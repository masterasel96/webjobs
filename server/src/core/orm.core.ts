import { Connection, ConnectionOptions, createConnection } from "typeorm";

class ORM {
    public connection: Connection | undefined;
    constructor(
    ) { }

    public getConfig(): ConnectionOptions {
        return {
            type: "postgres",
            database: 'webjobs',
            entities: [
                __dirname + "/../model/**/*.model{.ts,.js}",
            ],
            subscribers: [
                __dirname + "/../dao/subscriber/**/*.subscriber{.ts,.js}",
            ],
            host: 'localhost',
            password: 'cp',
            port: 5432,
            schema: 'public',
            synchronize: true,
            username: 'cp'
        };
    }

    public async connect(): Promise<Connection> {
        this.connection = await createConnection(this.getConfig());
        return this.connection;
    }
}

const orm = new ORM();
export default orm;