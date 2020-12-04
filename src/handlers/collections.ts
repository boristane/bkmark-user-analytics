import { Collection } from "../entities/Collection";
import { User } from "../entities/User";
import { ICreateCollectionRequest } from "../schemas/collections";
import { getDbConnection } from "../utils/db-helpers";
import logger from "logger";

export async function createCollection(data: ICreateCollectionRequest ): Promise<boolean> {
  try {
    const c = data.collection; 
    const connection = await getDbConnection();
    const collection: Collection = {
      uuid: c.uuid,
      user: await connection.getRepository(User).findOneOrFail(c.userId),
    };
    await connection.getRepository(Collection).save(collection);
    return true;
  } catch (error) {
    logger.error("There was an error creating a collection", { error, data });
    return false;
  }
}
