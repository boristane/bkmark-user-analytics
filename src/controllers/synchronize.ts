import logger from "logger";
import { Context, APIGatewayEvent } from "aws-lambda";
import { handleError, IHTTPResponse, success } from "../utils/http-responses";
import { wrapper } from "../utils/controllers-helpers";
import { getDbConnection } from "../utils/db-helpers";


async function synchronize(event: APIGatewayEvent): Promise<IHTTPResponse> {
  try {
    const connection = await getDbConnection();
    await connection.synchronize(true);
    const tables = await connection.createEntityManager().query(`SELECT * FROM information_schema.tables`);
    const data = {
      message: "Got tables",
      data: {
        tables: tables.filter((t: any) => t.TABLE_SCHEMA === process.env.DB_NAME!).map((t: any) => t.TABLE_NAME),
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
  return await logger.bindFunction(wrapper, correlationId)(synchronize, event);
}
