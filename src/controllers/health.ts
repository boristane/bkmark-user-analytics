import logger from "logger";
import { Context, APIGatewayEvent } from "aws-lambda";
import { handleError, IHTTPResponse, success } from "../utils/http-responses";
import { wrapper } from "../utils/controllers-helpers";
import database from "../services/database";


async function health(event: APIGatewayEvent): Promise<IHTTPResponse> {
  try {
    const tables = await database.listTables();
    const data = {
      message: "Got tables",
      data: {
        tables,
      }
    };
    return success(data);
  } catch (err) {
    const message = "Unexpected error when getting the tables";
    return handleError(err, event.body, message);
  }
}

export async function handler(event: APIGatewayEvent, context: Context) {
  const correlationId = event.headers['x-correlation-id'];
  return await logger.bindFunction(wrapper, correlationId)(health, event);
}
