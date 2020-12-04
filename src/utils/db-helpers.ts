import { createConnection, Connection, ConnectionOptions } from "typeorm";
import logger from "logger";
import { User } from "../entities/User";

let connection: Connection;

export async function getDbConnection(): Promise<Connection> {
  const connectionOptions: ConnectionOptions = {
    type: "aurora-data-api",
    database: process.env.DB_NAME!,
    secretArn: process.env.DB_SECRET_STORE_ARN!,
    resourceArn: process.env.DB_CLUSTER_ARN!,
    region: process.env.REGION!,
    entities: [User,],
  };
  try {
    if (connection) {
      return connection;
    }
    connection = await createConnection(connectionOptions);
    return connection;
  } catch (err) {
    logger.fatal("Unable to connect to database", { connectionOptions, error: err, });
    throw new Error("Unable to connect to the database")
  }
}

