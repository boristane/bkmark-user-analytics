import AWSXRay from 'aws-xray-sdk';
import dataClient from "data-api-client";

let client = dataClient({
  secretArn: process.env.DB_SECRET_STORE_ARN,
  resourceArn: process.env.DB_CLUSTER_ARN!,
  database: process.env.DB_NAME,
});

export function initialiseDb(): any {
  if (client) return client;
  AWSXRay.captureAWSClient((client as any).service);
  return client;
}
