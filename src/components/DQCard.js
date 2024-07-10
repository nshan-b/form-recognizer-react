import React from "react";
import { motion } from "framer-motion";
import { FcDocument, FcClock } from "react-icons/fc";
import { Link } from "react-router-dom";
// Document Queue Card:
// type, status, id, agency name, date


export default function DQCard({type, status, name, date, id}) {
  const isoToDateInput = (isoDate) => {
    if (!isoDate) return ''; // Handle null or undefined case
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  };
    return (
      <Link to={"/edit/" + id}>
        <div className="relative m-2 p-8 border border-zinc-100 rounded-lg  w-72
            hover:bg-slate-50 hover:cursor-pointer shadow-lg">
          <motion.div
            className={`absolute top-0 right-0 mt-2 mr-2 h-3 w-3 rounded-full ${status && status.status != "review" ? "bg-emerald-400" :  "bg-red-400"}`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div>
            {status && (status.status == "type_here" || status.status == "review") ? 
              <div className="mr-4 mb-4 absolute bottom-0 right-0 text-xs font-medium text-red-400">
                  Pending Review
              </div> :

              <div className="mr-4 mb-4 absolute bottom-0 right-0 text-xs font-medium text-emerald-400">
                  Completed
              </div>
            
            }
            
          </motion.div>
          <div className="flex flex-col my-2">
            <div className="flex justify-start">
                <div className="text-lg font-semibold text-sky-700">{name && name.length > 23 ? name.substring(0, 23) + "..." : name}</div>
            </div>
            <div className="flex justify-start ">
                <FcDocument className="mr-1 mt-1"/>
                <div className="text-md font-normal mb-1 ">SF-405</div>
            </div>
            <div className="flex justify-start">
              <FcClock className="mr-1 mt-1"/>
              <div className="text-md font-normal ">{isoToDateInput(date)}</div>
            </div>
          </div>
        </div>
        </Link>
      );
}