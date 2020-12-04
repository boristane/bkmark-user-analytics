import { IBookmarkCreatedRequest } from "../schemas/bookmarks";
import logger from "logger";
import { getDbConnection } from "../utils/db-helpers";
import { Bookmark } from "../entities/Bookmark";
import { Collection } from "../entities/Collection";
import { Tag } from "../entities/Tag";
import moment from "dayjs";

export async function createBookmark(data: { bookmark: IBookmarkCreatedRequest }): Promise<boolean> {
  try {
    const b = data.bookmark;
    const connection = await getDbConnection();
    const bookmark: Bookmark = {
      uuid: b.uuid,
      url: b.url,
      collection: await connection.getRepository(Collection).findOneOrFail(b.collectionId),
      tags: b.tags.map(t => {
        const tag: Tag = {
          name: t.name,
          type: t.type,
        }
        return tag;
      }),
      expiration: moment(b.expiration).toDate(),
      archived: b.archived,
      favourite: b.archived,
      countOpen: b.countOpen,
      type: b.metadata.type,
      origin: b.origin,
    };
    await connection.getRepository(Bookmark).save(bookmark);
  } catch (error) {
    logger.error("There was an error creating a bookmark for analytics", { data, error });
    return false;
  }
  return true;
}

// export async function archiveBookmark(data: { bookmark: IBookmarkRequest }): Promise<boolean> {
//   try {
//     const objectId = await database.getBookmarkObjectId(data.bookmark);
//     await algolia.deleteBookmark(data.bookmark, objectId);
//     await database.deleteBookmark(data.bookmark);
//   } catch (error) {
//     logger.error("There was an error deleting a bookmark from search", { data, error });
//     return false;
//   }
//   return true;
// }

// export async function editBookmark(data: { bookmark: IBookmarkRequest }): Promise<boolean> {
//   try {
//     const objectId = await database.getBookmarkObjectId(data.bookmark);
//     await algolia.updateBookmark(data.bookmark, objectId);
//   } catch (error) {
//     logger.error("There was an error updating a bookmark from search", { data, error });
//     return false;
//   }
//   return true;
// }