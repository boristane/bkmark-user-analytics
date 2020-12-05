import { initialiseDb } from "../utils/dynamo-db-helper";
import { DynamoDB } from "aws-sdk";
import { IEvent } from "../models/events";
import moment from "moment";
import logger from "logger";
import Exception from "../utils/error";

function initialise(): { tableName: string, dynamoDb: DynamoDB.DocumentClient } {
  const tableName = process.env.EVENT_STORE_TABLE || "";
  return initialiseDb(tableName);
}

async function createEvent(data: Record<string, any>, ttl: number): Promise<void> {
  const { tableName, dynamoDb } = initialise();
  if (!data.uuid) {
    throw Exception("The uuid is missing from the event data", 400);
  }

  // I'm adding a ttl of 1 minute to this
  const record: IEvent = {
    uuid: (data.uuid).toString(),
    data: { ...data, correlationId: logger.getCorrelationId() },
    timestamp: moment().unix(),
    type: data.type,
    correlationId: logger.getCorrelationId(),
    ttl,
  }

  const params = {
    TableName: tableName,
    Item: record,
    ConditionExpression: "attribute_not_exists(#uuid)",
    ExpressionAttributeNames: {
      "#uuid": "uuid"
    },
  };

  try {
    await dynamoDb.put(params).promise();
    logger.debug("Added event to the event store", { params });
  } catch (e) {
    const message = "Failed to save event in dynamo db";
    logger.error(message, { params, error: e });
    throw e;
  }
}

export default {
  createEvent,
}