export enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderTiming {
  NOW = "NOW",
  WHEN = "WHEN",
}

export enum OrderTrigger {
  MORE_THAN_OR_EQUAL = "MORE_THAN_OR_EQUAL",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  DONE = "DONE",
}

export interface Order {
  id: string;
  name: string;
  type: OrderType;
  trigger?: OrderTrigger;
  price: number;
  actualPrice?: number;
  quantity: number;
  createdTime: Date;
  status: OrderStatus;
  modifiedTime?: Date;
}
