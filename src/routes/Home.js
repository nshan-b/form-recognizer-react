import axios from "axios";
import React, { useEffect, useState } from "react";
import { ImSpinner8 } from 'react-icons/im';
import { FaPlay, FaPause, FaSpinner, FaDotCircle } from 'react-icons/fa';
//import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import FileUpload from "../components/FileUpload";
import CircleLoader from "../components/CircleLoader";
import CustomSidebar from "../components/CustomSidebar";

const Home = (props) => {
    return (
        <>
        <FileUpload />
        </>
    );
}

export default Home;