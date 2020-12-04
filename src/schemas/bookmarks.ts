import { TagType } from "../entities/Tag";

export interface IBookmarkCreatedRequest {
  uuid: number;
  url: string;
  userId: string;
  collectionId: string;
  expiration: string;
  archived: boolean;
  favourite?: boolean;
  origin: string;
  countOpen: number;
  tags: ITag[];
  [key: string]: any;
}

export interface ITag {
  name: string;
  type: TagType;
  userId: string;
}