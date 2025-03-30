"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TestimonialsEditor from "@/components/TestimonialsEditor";
import PlansEditor from "@/components/PlansEditor";


enum SectionType {
  ORDERS = 'orders',
  TESTIMONIALS = 'testimonials',
  PLANS = 'plans'
}

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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionType>(SectionType.ORDERS);

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading orders...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }
  const toggleDropdown = (): void => {
    setIsDropdownOpen((prev) => !prev);
  };

  const navItems = [
    { id: SectionType.ORDERS, label: "Orders" },
    { id: SectionType.TESTIMONIALS, label: "Testimonials" },
    { id: SectionType.PLANS, label: "Plans" },
  ];

  const selectSection = (section: SectionType): void => {
    setActiveSection(section);
    setIsDropdownOpen(false);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number): string => {
    return `Rs.${amount}`;
  };

  return (
   
    <div className="min-h-screen mx-auto px-4 py-8 text-white bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        {/* Navigation Bar */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            aria-label="Go back to home page"
          >
            Go Back Home
          </button>
          
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 flex items-center transition-colors"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span>Manage Content</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isDropdownOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu Items */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10"
                role="menu"
                aria-orientation="vertical"
              >
                <ul className="py-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => selectSection(item.id)}
                        className={`block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left transition-colors ${
                          activeSection === item.id ? 'bg-gray-700 font-medium' : ''
                        }`}
                        role="menuitem"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Orders Section */}
      {activeSection === SectionType.ORDERS && (
       <div className="bg-gray-900 rounded-lg shadow p-6 mb-8 animate-fadeIn text-white">
       <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Orders</h2>
     
       {orders.length === 0 ? (
         <p className="text-gray-400">No orders found</p>
       ) : (
         <ul className="divide-y divide-gray-700">
           {orders.map((order) => (
             <li key={order.orderId} className="py-4">
               <div className="flex items-center space-x-4 rtl:space-x-reverse">
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-200 truncate">
                     Order ID: {order.orderId}
                   </p>
                   <p className="text-sm font-medium text-gray-200 truncate">
                     Email ID: {order.email}
                   </p>
                   <p className="text-sm text-gray-400 truncate">
                     Created At: {formatDate(order.createdAt)}
                   </p>
                 </div>
                 <div className="inline-flex items-center text-base font-semibold text-gray-300">
                   {formatCurrency(order.amount)}
                 </div>
               </div>
             </li>
           ))}
         </ul>
       )}
     </div>     
      )}
      
      {/* Testimonials Editor Section */}
      {activeSection === SectionType.TESTIMONIALS && (
        <div className="mb-8 animate-fadeIn">
          <TestimonialsEditor />
        </div>
      )}
      
      {/* Plans Editor Section */}
      {activeSection === SectionType.PLANS && (
        <div className="mb-8 animate-fadeIn">
          <PlansEditor />
        </div>
      )}
    </div>
  );
};

export default Dashboard;