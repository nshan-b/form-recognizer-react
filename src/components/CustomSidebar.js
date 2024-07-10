import React, { useState, useEffect } from 'react';
import { FcClapperboard, FcLeft, FcRight, FcSalesPerformance, FcHome, FcDataSheet, FcAbout } from "react-icons/fc";
import { Link } from 'react-router-dom';

const CustomSidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : false;
  });

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState);
  };

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <div className="h-screen flex font-medium text-sm text-slate-700 border-r-2 mx-2">
      <div className={`flex flex-col h-full bg-white ${isOpen ? 'w-28' : 'w-44'} transition-width duration-300`}>
        <div className="flex-1 mt-8">

        <Link to={"/"}>
          <div className="flex items-center p-2 hover:bg-blue-100 hover:cursor-pointer 
            hover:text-blue-500 transition-colors">
            <FcAbout className="mr-2" />
            {!isOpen && <span>Home</span>}
          </div>
          </Link>

          <Link to={"/document-queue"}>
          <div className="flex items-center p-2 hover:bg-blue-100 hover:cursor-pointer 
             hover:text-blue-500 transition-colors">
            <FcDataSheet className="mr-2" />
            {!isOpen && <span>Document Queue</span>}
          </div>
          </Link>

          

          {/* Add more menu items here */}
          <Link to={"/preview"}>
          <div className="flex items-center p-2 hover:bg-blue-100 hover:cursor-pointer 
             hover:text-blue-500 transition-colors">
            <FcSalesPerformance className="mr-2" />
            {!isOpen && <span>Preview</span>}
          </div>
          </Link>




        </div>
        {/* <div className="p-2 ml-6 mt-10">
          <button className="p-2 bg-blue-300 text-white rounded-full" onClick={toggleSidebar}>
            {isOpen ? <FcRight /> : <FcLeft />}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default CustomSidebar;
