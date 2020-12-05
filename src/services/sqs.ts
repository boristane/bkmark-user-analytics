import { SQS } from "aws-sdk";
import logger from "logger";
import { initialiseSQS } from "../utils/sqs-helpers";

async function sendMessage(message: object) {

  let producer = initialiseSQS();
  const queueUrl = process.env.SQS_QUEUE_URL!;

  try {
    const result = await producer.sendMessage({
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    }).promise();

  } catch (error) {
    logger.error("Unable to send message to queue", {
      queueUrl,
      message,
      error,
    });
  }
}

export default {
  sendMessage,
}