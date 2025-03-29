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
    <aside className="w-auto p-4 bg-gray-700 text-white">
      <h2 className="text-lg font-bold mb-4">Last Transaction</h2>
      <ul>
        {orders.map((order) => (
          <li
            key={order.orderId}
            className="p-2 mb-2 rounded shadow-sm"
          >
            <p className="font-semibold">PLan: {order.amount}</p>
            <p className="text-sm text-gray-300">Status: {order.status}</p>
            <p className="text-sm text-gray-300">Date: {order.createdAt}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MyOrdersSidebar;
