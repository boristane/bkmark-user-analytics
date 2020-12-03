
import { initialiseDb } from "../utils/db-helpers";
import logger from "logger";

async function listTables(): Promise<void> {
  const dbClient = initialiseDb();
  try {
    let result = await dbClient.query(`SELECT * FROM information_schema.tables`);
    return result;
  } catch (e) {
    const message = "Failed to list the tables";
    logger.error(message, { error: e });
    throw e;
  }
}

export default {
  listTables,
}
