import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from 'react-dropzone';
import CircleLoader from './CircleLoader';
import DocumentViewer from './DocumentViewer';




const FileUpload = () => {
    // States
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [results, setResults] = useState(null);

    useEffect(() => {
        console.log("selected file ~~~")
        console.log(selectedFile);
        if (selectedFile == null || selectedFile === undefined || selectedFile == false) {
            // setShowUpload(false)
        }
    }, [selectedFile])

    useEffect(() => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]); // Set the first accepted file as the selected file
            // setShowUpload(true);
        }
    }, [acceptedFiles]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleClear = (e) => {
        setLoadingMsg("");
        setResults(null);
        setURL(null);
    }

    // Upload
    const handleUpload = async () => {
        setLoadingMsg("Uploading.")
        setLoading(true);
        setResults(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {

            const response = await fetch('http://localhost:5002/api/formrecognizer/uploadDocument', {
                method: 'POST',
                body: formData,
            });

            setLoading(false);
                
            if (response.ok) {
                const result = await response.json();
                setURL(result.url);
                console.log('Uploaded file URL:', result.url);
            }
            else {
                console.error('Upload failed.');
            }
        }
        catch (error) {
            setLoading(false);
            console.error("Error uploading file: ", error);
        }
    };

    // Analysis
    const handleAnalysis = async () => {
        setLoadingMsg("Analyzing.")
        setLoading(true);
        console.log("Analysis")
        try {
            console.log('Document URL for analysis:', url); // Log the document URL
            const response = await fetch('http://localhost:5002/api/formrecognizer/analyzeDocument', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(url),
            });
            const json = await response.json();
            console.log(json)
            setResults(json);
            if (response.ok) {
                console.log('Document analysis completed successfully.');
                setLoading(false);
            } 
            else {
                console.error('Document analysis failed. Status:', response.status);
                setLoading(false);
            }
        } 
        catch (error) {
            setLoading(false);
            console.error("Error analyzing document: ", error);
        }
    };

    return (
        <div className='flex flex-col items-center'>
        {/* Dropzone */}
         <motion.div className="flex flex-col mx-5 mt-5 hover:cursor-pointer bg-emerald-200 p-10 rounded-md shadow-md 
            border-spacing-2 border-neutral-500 border-dashed border-2"
            whileHover={{
                scale: 0.95,
                transition: { duration: 0.2 },
            }}
            whileTap={{
                scale: 0.95,
                transition: { duration: 1 },
            }}
         >
            <div className='' {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                {/* <p className='font-bold text-md'>Drag & drop a file, or click to select a file to analyze.</p> */}
                <AnimatePresence>
                    <motion.div
                        layout
                        // key="modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, delay: 0 }}
                        className='flex flex-col'
                    >
                        {acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0 ? 
                    (<p className='font-bold text-md text-center'>{selectedFile ? selectedFile.name + "" : null}</p>) : 
                    <p className='font-bold text-md'>Drag & drop a file, or click to select a file to analyze.</p>
                }
                    </motion.div>
                </AnimatePresence>
                
            </div>
        </motion.div>

        


        <div className='flex flex-col px-10 mx-10'>
            {/* <input
                type="file" accept=".pdf" onChange={handleFileChange} /> */}
            {/* <button onClick={handleUpload}>Upload</button>
            <button onClick={handleAnalysis}>Analyze</button> */}

            


            <AnimatePresence>
            <motion.div
                layout
                // key="modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, delay: 0 }}
                className='flex flex-col items-center'
                
            >
                <div className='flex mx-5 mt-5 mb-10'>
                    <motion.button
                        whileTap={{
                            scale: 0.9,
                            transition: { duration: 1 },
                        }}
                        onClick={handleUpload}
                        className="mx-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                            Upload
                    </motion.button>
                    <motion.button
                        whileTap={{
                            scale: 0.9,
                            transition: { duration: 1 },
                        }}
                        onClick={handleAnalysis}
                        className="mx-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                            Analyze
                    </motion.button>
                </div>

                {loading ? <div className='flex flex-col items-center mt-10 mb-10'> <CircleLoader msg={loadingMsg} /></div> : null}

                <div>
                    {results && results.Documents ? 
                        <div className='flex flex-col items-center'>
                        <DocumentViewer documentData={results} />
                        <motion.button
                            whileTap={{
                                scale: 0.9,
                                transition: { duration: 1 },
                            }}
                            onClick={handleClear}
                            className="mt-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                Clear Results
                        </motion.button>
                        </div>
                    : null}
                </div>

            
            
               
 
            </motion.div>
            </AnimatePresence>
            
        </div>
        </div>
    );
};

export default FileUpload;
