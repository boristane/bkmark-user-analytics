import logger from "logger";
import { Context, APIGatewayEvent } from "aws-lambda";
import { handleError, IHTTPResponse, success } from "../utils/http-responses";
import { wrapper } from "../utils/controllers-helpers";
import { getDbConnection } from "../utils/db-helpers";
import { User } from "../entities/User";
import { v4 as uuid } from "uuid";


async function createUser(event: APIGatewayEvent): Promise<IHTTPResponse> {
  try {
    const connection = await getDbConnection();
    const user: User = {
      uuid: uuid(),
    }
    logger.info("Querying the db");
    const dbUser = await connection.getRepository(User).save(user);
    logger.info("Queried the db");
    const data = {
      message: "Saved the user",
      data: {
        dbUser
      }
    };
    return success(data);
  } catch (err) {
    const message = "Unexpected error when saving the user";
    return handleError(err, event.body, message);
  }
}

export async function handler(event: APIGatewayEvent, context: Context) {
  const correlationId = event.headers['x-correlation-id'];
  return await logger.bindFunction(wrapper, correlationId)(createUser, event);
}
