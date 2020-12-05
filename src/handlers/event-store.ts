import { IEventMessage } from "../models/events";
import eventStore from "../services/event-store";
import { buildEventMessage } from "../utils/utils";
import logger from "logger";
import { getDbConnection } from "../utils/db-helpers";

export async function insertToEventStore(data: Record<string, any>, eventType: string, ttl: number): Promise<boolean> {
  try {
    const eventMessage = data;
    const internalType = `INTERNAL_${eventType}`;
    const message: IEventMessage = buildEventMessage(eventMessage, internalType);

    // Just pinging the serverless aurora to wakie it up
    const connection = await getDbConnection();
    connection.createEntityManager().query("select 1 from user");
    
    await eventStore.createEvent(message, ttl);
    return true;
  } catch (error) {
    logger.error("There was a problem saving to the event store", { error, data, eventType });
    return false;
  }
}
