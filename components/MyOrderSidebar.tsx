import React, { useEffect, useState } from "react";
import { Order, OrderManager } from "@/components/sidebar/OrderManager";

interface MyOrdersSidebarProps {
  orderManager: OrderManager;
}

const MyOrdersSidebar: React.FC<MyOrdersSidebarProps> = ({ orderManager }) => {
  const [orders, setOrders] = useState<Order[]>(orderManager.getOrders());

  useEffect(() => {
    const handleOrderChange = (updatedOrders: Order[]) => {
      setOrders([...updatedOrders]); // Ensure React detects changes
    };

    orderManager.onOrderChange(handleOrderChange);

    return () => {
      orderManager.offOrderChange(handleOrderChange);
    };
  }, [orderManager]);

  return (
    <aside className="w-auto bg-green-200 p-4 border-r border-gray-300">
      <h2 className="text-lg font-bold mb-4">Last Transaction</h2>
      <ul>
        {orders.map((order) => (
          <li
            key={order.orderId}
            className="p-2 mb-2 border rounded bg-white shadow-sm"
          >
            <p className="font-semibold">PLan: {order.amount}</p>
            <p className="text-sm text-gray-600">Status: {order.status}</p>
            <p className="text-sm text-gray-600">Date: {order.createdAt}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MyOrdersSidebar;
