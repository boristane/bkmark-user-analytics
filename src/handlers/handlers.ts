import logger from "logger";
import { IEventMessage } from "../models/events";
import { createBookmark } from "./bookmarks";
import { createCollection } from "./collections";
import { insertToEventStore } from "./event-store";
import { createUser } from "./users";
import moment from "dayjs";

export async function handleMessage(message: IEventMessage): Promise<boolean> {
  const data = message.data;
  logger.info("Handling the message", { message });
  let res: boolean = false;
  switch (message.type) {
    case internalEventType.userCreated:
      res = await createUser(data);
      break;
    case internalEventType.bookmarkCreated:
    case internalEventType.bookmarkRestored:
      res = await createBookmark(data);
      break;
    case internalEventType.collectionCreated:
      res = await createCollection(data);
      break;
    // case eventType.bookmarkArchived:
    // case eventType.bookmarkDeleted:
    //   res = await deleteBookmarkObject(data);
    //   break;
    // case eventType.bookmarkUpdated:
    // case eventType.bookmarkIncremented:
    // case eventType.bookmarkFavourited:
    //   res = await editBookmarkObject(data);
    //   break;

    case eventType.userCreated:
    case eventType.bookmarkCreated:
    case eventType.bookmarkArchived:
    case eventType.bookmarkUpdated:
    case eventType.bookmarkDeleted:
    case eventType.bookmarkFavourited:
    case eventType.bookmarkRestored:
    case eventType.bookmarkIncremented:
      const ttl = moment().add(1, "minute").unix();
      res = await insertToEventStore(data, message.type, ttl);
      break
    case eventType.collectionCreated:
      // Longer ttl because collections need to be created when the user is already created
      const t = moment().add(10, "minute").unix();
      res = await insertToEventStore(data, message.type, t);
      break;
    default:
      logger.error("Unexpected event type found in message. Sending to dead letter queue.", { message });
      res = false;
  }
  return res;
}

export enum eventType {
  userCreated = "USER_CREATED",

  bookmarkCreated = "BOOKMARK_CREATED",
  bookmarkArchived = "BOOKMARK_ARCHIVED",
  bookmarkUpdated = "BOOKMARK_UPDATED",
  bookmarkDeleted = "BOOKMARK_DELETED",
  bookmarkFavourited = "BOOKMARK_FAVOURITED",
  bookmarkRestored = "BOOKMARK_RESTORED",
  bookmarkIncremented = "BOOKMARK_INCREMENTED",

  collectionCreated = "COLLECTION_CREATED",
}

export enum internalEventType {
  userCreated = "INTERNAL_USER_CREATED",
  userMembeshipChanged = "INTERNAL_USER_MEMBERSHIP_CHANGED",

  bookmarkCreated = "INTERNAL_BOOKMARK_CREATED",
  bookmarkArchived = "INTERNAL_BOOKMARK_ARCHIVED",
  bookmarkUpdated = "INTERNAL_BOOKMARK_UPDATED",
  bookmarkDeleted = "INTERNAL_BOOKMARK_DELETED",
  bookmarkFavourited = "INTERNAL_BOOKMARK_FAVOURITED",
  bookmarkRestored = "INTERNAL_BOOKMARK_RESTORED",
  bookmarkIncremented = "INTERNAL_BOOKMARK_INCREMENTED",

  collectionCreated = "INTERNAL_COLLECTION_CREATED",
}

