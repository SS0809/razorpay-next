import Link from 'next/link';
import { Home, Calendar, ShoppingCart, Menu, X, LogOut, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type SidebarProps = {
    onFetchOrders?: () => void;
    openPDF?: () => void;
    setShowOrders?: React.Dispatch<React.SetStateAction<boolean>>;
    showOrders: boolean;
    logout?: () => void;
    setAuthBar?:React.Dispatch<React.SetStateAction<boolean>>;
    token: string | null;
    additionalFunctions?: (() => void)[];
};

const Sidebar: React.FC<SidebarProps> = ({ 
  onFetchOrders, 
  openPDF, 
  setShowOrders,
  showOrders,
  logout,
  token,
  setAuthBar,
  additionalFunctions = [] 
}) => {
  
  const { user } = useAuth(); 
  const home = user ? "/dashboard": "/";
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: home }
  ];
  const [isOpen, setIsOpen] = useState(false);

  const handleFetchOrders = () => {
    if (onFetchOrders) onFetchOrders();
    additionalFunctions.forEach(func => func());
  };

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md flex justify-between items-center p-6 z-50 lg:pl-64">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(prev => !prev)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
            <img 
            src="/11.png" 
            alt="BLean Logo" 
            className="h-28 absolute left-20" 
            />
          <h1 className="hidden lg:block text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">{user}</h1>
        </div>
        {token ? (
          <>
          <button 
          className="flex items-center gap-2 text-gray-400 hover:text-white" 
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
          </>
        ):(
          <>
          <button 
          className="flex items-center gap-2 text-gray-400 hover:text-white" 
          onClick={() => setAuthBar && setAuthBar(true)}
          >
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </button>
          </>
        )}
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-40 text-white shadow-lg transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 pt-20`}
      >
        <nav className="p-4">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition">
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              </li>
            ))}

            {/* Open PDF Button */}
            <li>
              <button 
                onClick={openPDF} 
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
              >
                <Calendar className="w-5 h-5" />
                <span className="ml-3 font-medium">WorkOut PDFs</span>
              </button>
            </li>

            {/* Orders Button */}
            <li>
              <button 
                onClick={async () => {
                  if (onFetchOrders) {
                    await onFetchOrders();
                    if (setShowOrders) {
                      setShowOrders(prev => !prev);
                    } else {
                      console.error("setShowOrders is not defined");
                    }
                    console.log("Orders fetched!");
                  }
                }}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="ml-3 font-medium">Orders</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
