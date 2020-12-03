import { IEventMessage } from "../models/events";

export async function handleMessage(message: IEventMessage): Promise<boolean> {
  return true;
}
