"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Order {
  createdAt: string;
  email: string;
  amount: number;
  orderId: string;
}

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user !== 'saurabh45215@gmail.com') {
      router.push("/user");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/adminorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Unexpected data format:", data);
          setError("Received unexpected data format from server");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router, token]);

  if (user !== 'saurabh45215@gmail.com') {
    return null;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading orders...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back Home
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.orderId} className="py-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Order ID: {order.orderId}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Email ID: {order.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Created At: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    Rs.{order.amount}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;