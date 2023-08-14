import axios from "axios";
import React, { useEffect, useState } from "react";
import { ImSpinner8 } from 'react-icons/im';
import { FaPlay, FaPause, FaSpinner, FaDotCircle } from 'react-icons/fa';
//import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import FileUpload from "../components/FileUpload";
import CircleLoader from "../components/CircleLoader";

const Home = (props) => {
    return (
        <div className="flex justify-center w-full flex-col items-center">
        <div className="max-w-7xl px-48 py-28 bg-white m-12 flex flex-col items-center justify-center 
            rounded overflow-hidden shadow-lg">
                 <div className="px-6 py-4">
                    <div className="font-bold text-3xl mb-2 text-center">Document Analysis</div>
                    <p className="text-gray-700 text-base max-w-lg m-4">
                        This is an example of utilizing Azure for document analysis. A custom trained model for form SF-405 (RPA) was created in Azure's Form Recognizer. The model is invoked by providing an SF-405 document to analyze.
                    </p>
                    <p className="text-gray-700 text-base max-w-lg m-4">
                        The data for our custom model was trained from example SF-405 documents, written and digital.
                    </p>
                </div>
                <div>
                    <FileUpload />
                </div>
        </div>
        </div>
    );
}

export default Home;