import { createConnection, Connection, ConnectionOptions } from "typeorm";
import logger from "logger";
import { User } from "../entities/User";
import { Bookmark } from "../entities/Bookmark";
import { Collection } from "../entities/Collection";
import { Tag } from "../entities/Tag";

let connection: Connection;

export async function getDbConnection(): Promise<Connection> {
  const connectionOptions: ConnectionOptions = {
    type: "aurora-data-api",
    database: process.env.DB_NAME!,
    secretArn: process.env.DB_SECRET_STORE_ARN!,
    resourceArn: process.env.DB_CLUSTER_ARN!,
    region: process.env.REGION!,
    entities: [Bookmark, Collection, Tag, User,],
    serviceConfigOptions: {
      continueAfterTimeout: true,
    }
  };
  logger.debug("Trying to get the connection");
  try {
    if (connection) {
      logger.info("Existing Connection");

      return connection;
    }
    connection = await createConnection(connectionOptions);
    logger.debug("Just created a new connection");
    return connection;
  } catch (err) {
    logger.fatal("Unable to connect to database", { connectionOptions, error: err, });
    throw new Error("Unable to connect to the database");
  }
}

