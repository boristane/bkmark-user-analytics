import logger from "logger";
import { Context, APIGatewayEvent } from "aws-lambda";
import { handleError, IHTTPResponse, success } from "../utils/http-responses";
import { wrapper } from "../utils/controllers-helpers";
import { getDbConnection } from "../utils/db-helpers";
import { User } from "../entities/User";


async function getUser(event: APIGatewayEvent): Promise<IHTTPResponse> {
  try {
    const connection = await getDbConnection();
    logger.info("Querying the db");
    const users = await connection.getRepository(User).find();
    logger.info("Queried the db");
    const data = {
      message: "Got the users",
      data: {
        users
      }
    };
    return success(data);
  } catch (err) {
    const message = "Unexpected error when getting the users";
    return handleError(err, event.body, message);
  }
}

export async function handler(event: APIGatewayEvent, context: Context) {
  const correlationId = event.headers['x-correlation-id'];
  return await logger.bindFunction(wrapper, correlationId)(getUser, event);
}
