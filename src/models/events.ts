export interface IEventMessage {
  uuid: string | number;
  data: any;
  source: string;
  type: string;
}

export interface IEvent {
  uuid: string | number;
  data: Record<string, any>;
  type: string;
  timestamp: number;
  correlationId: string;
  ttl: number;
}
