import React from 'react';
import Link from 'next/link';
import { Home, Calendar, ShoppingCart, Menu, X, LogOut } from 'lucide-react';

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    onFetchOrders?: () => void;
    openPDF?: () => void;
    setShowOrders?: React.Dispatch<React.SetStateAction<boolean>>;
    showOrders: boolean;
    logout?: () => void;
    additionalFunctions?: (() => void)[];
};
  

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onFetchOrders, 
  openPDF, 
  setShowOrders,
  showOrders,
  logout,
  additionalFunctions = [] 
}) => {
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/' }
  ];

  const handleFetchOrders = () => {
    if (onFetchOrders) onFetchOrders();
    additionalFunctions.forEach(func => func());
  };

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md flex justify-between items-center p-4 z-50">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold">BLean</h1>
        </div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white" onClick={logout}>
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </header>

      {/* Sidebar */}
    <aside 
      className={`fixed top-14 left-0 h-full w-52 bg-gray-900 z-50 text-white shadow-lg transform transition-transform duration-300 ease-in-out 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
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
    </>
  );
};

export default Sidebar;