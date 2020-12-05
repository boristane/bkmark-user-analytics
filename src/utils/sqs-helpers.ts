import { SQS } from "aws-sdk";

let producer: SQS;

export function initialiseSQS(): SQS {
  if (producer) {
    return producer;
  }
  producer = new SQS({ region: process.env.REGION });
  return producer;
}