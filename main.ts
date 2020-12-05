import logger from "logger";

import { Context, SQSEvent, Callback, SQSRecord, DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";
import { handleMessage } from "./src/handlers/handlers";
import { Converter } from "aws-sdk/clients/dynamodb";
import sqs from "./src/services/sqs";


export async function command(event: SQSEvent, context: Context, callback: Callback) {
  const { Records } = event;

  const promises = Records.map((record) => commandFunction(record));
  const results = await Promise.all(promises);
  const failures = results.filter(r => !r.result);

  if (failures.length > 0) {
    logger.error("Error when processing messages from queue.", { failures });
    callback(`Error when processing messages from queue.`);
  }
}

async function commandFunction(record: SQSRecord): Promise<{ result: boolean, record: SQSRecord }> {
  let message = JSON.parse(record.body || "");
  if (message.Message) { message = JSON.parse(message.Message); }
  let correlationId: string = message.correlationId;
  const res = await logger.bindFunction(handleMessage, correlationId)(message);
  return { result: res, record };
}

export async function fanin(event: DynamoDBStreamEvent, context: Context, callback: Callback) {
  const { Records } = event;
  try {
    const entries = Records
      .filter(record => record?.dynamodb?.OldImage)
      .map(d => {
        const image = d.dynamodb?.OldImage;
        if (!image) return;
        return Converter.unmarshall(image);
      }) as Record<string, any>[];

    if (entries.length === 0) {
      return;
    }

    const { userIdentity } = Records[0];
    if (!userIdentity) return;

    const isTTLEvent = userIdentity.type === "Service" && userIdentity.principalId === "dynamodb.amazonaws.com"
    if (!isTTLEvent) return;

    for (let i = 0; i < entries.length; i += 1) {
      const message = entries[i].data
      logger.debug("Here is the message being sent to the queue", message);
      await sqs.sendMessage(message);
    }
  } catch (error) {
    logger.error("Error when processing messages from the ttl.", { error });
    callback(`Error when processing messages from the ttl.`);
  }
}
