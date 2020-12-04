import { ICreateUserRequest, IChangeUserMembershipRequest } from "../schemas/users";
import logger from "logger";
import { User } from "../entities/User";
import { getDbConnection } from "../utils/db-helpers";
import { Collection } from "../entities/Collection";

export async function createUser(data: ICreateUserRequest ): Promise<boolean> {
  try {
    const user: User = {
      uuid: data.user.uuid,
      collections: []
    };
    const connection = await getDbConnection();
    await connection.getRepository(User).save(user);
    return true;
  } catch (error) {
    logger.error("There was an error creating a user", { error, data });
    return false;
  }
}
