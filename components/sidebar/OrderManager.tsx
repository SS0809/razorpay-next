import { EventEmitter } from "events";

export interface Order {
  orderId: string;
  amount: number;
  status: "Finished" | "Running" | "Canceled";
  createdAt: string;
}

export class OrderManager {
  private orders: Order[] = [];
  private orderChangeEmitter: EventEmitter = new EventEmitter();

  constructor() {}

  public addOrder(order: Order): void {
    const exists = this.orders.some((o) => o.orderId === order.orderId);
    if (!exists) {
      this.orders.push(order);
      this.orderChangeEmitter.emit("orderChanged", this.orders);
    }
  }
  

  public removeOrder(orderId: string): void {
    this.orders = this.orders.filter((order) => order.orderId !== orderId);
    this.orderChangeEmitter.emit("orderChanged", this.orders);
  }

  public getOrders(): Order[] {
    return [...this.orders]; // Return a copy to prevent direct modification
  }

  public onOrderChange(listener: (orders: Order[]) => void): void {
    this.orderChangeEmitter.on("orderChanged", listener);
  }

  public offOrderChange(listener: (orders: Order[]) => void): void {
    this.orderChangeEmitter.off("orderChanged", listener);
  }
}
