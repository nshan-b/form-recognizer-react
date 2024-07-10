import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useDropzone } from 'react-dropzone';
import CircleLoader from './CircleLoader';
import DocumentViewer from './DocumentViewer';
import FileForm from './FileForm';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import '../styles/misc.css';
import { useNavigate } from "react-router-dom";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
  };



const FileUpload = () => {

    // States
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedType, setSelectedType] = useState(null)
    const [url, setURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [results, setResults] = useState(null);
    const [showMainButtons, setShowMainButtons] = useState(true);

    const [showDocument, setShowDocument] = useState(false);
    const [documentData, setDocumentData] = useState(null);
    const [pdfPages, setPdfPages] = useState(null);
    // ***************************************************

    // Effects
    useEffect(() => {
        console.log("selected file ~~~")
        console.log(selectedFile);
       

        if (selectedFile == null || selectedFile === undefined || selectedFile == false) {
          //
        }
    }, [selectedFile])

    useEffect(() => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]); // Set the first accepted file as the selected file
            setSelectedType(acceptedFiles[0].type)
            if (acceptedFiles[0].type == "image/jpeg") {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    setImagePreview(reader.result);
                  });
                  reader.readAsDataURL(acceptedFiles[0]);
            }
            // setShowUpload(true);
        }
    }, [acceptedFiles]);

    useEffect(() => {
        console.log(imagePreview, "IMAGE PREVIEWER")
    }, [imagePreview])
    // ***************************************************

    // Handlers 
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleClear = (e) => {
        setLoadingMsg("");
        setResults(null);
        setURL(null);
        setPdfPages(null);
        setShowDocument(false);
        setShowMainButtons(true);
        setDocumentData(null);
    }

    // Save Document
    const saveDocument = async (data) => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('document', JSON.stringify(data))

            const response = await axios.post('http://localhost:5002/api/doc/saveDocument', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // const response = await axios.post('http://localhost:5002/api/doc/saveDocument', documentData);
            console.log('Document saved:', response.data);
            // Handle success, e.g., show a success message or redirect
        } 
        catch (error) {
            console.error('Error saving document:', error);
            // Handle error, e.g., show an error message
        }
    };

    // Upload
    const handleUpload = async () => {
        setLoadingMsg("Uploading.")
        setLoading(true);
        setResults(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {

            const response = await fetch('http://localhost:5002/api/doc/uploadDocument', {
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
        setLoadingMsg("Uploading.")
        setShowMainButtons(false);
        setLoading(true);
        setShowDocument(true); 

        const formData = new FormData();
        formData.append('file', selectedFile)

        console.log("Analysis")
        try {
            console.log('Document URL for analysis:', url); // Log the document URL
            const response = await fetch('http://localhost:5002/api/doc/analyzeDocument', {
                method: 'POST',
                body: formData,
                // headers: {
                //     'Content-Type': 'application/json',
                // },
                // body: JSON.stringify(url),
            });
            const json = await response.json();
            console.log('Anaylsis result:')
            console.log(json)

            setResults(json);

            // Set our document data
            if(json && json.Documents && json.Documents.length > 0) {
                saveDocument(json.Documents[0].Fields);
                setDocumentData(json.Documents[0].Fields)
            }



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

    const onDocumentLoadSuccess = async(nextNumPages) => {
        setPdfPages(nextNumPages)
    }
    // ***


    return (
        <>
        <div className="flex justify-center w-full flex-col items-center">
            <div className="max-w-7xl px-48 py-6 bg-white m-12 flex flex-col items-center justify-center 
                rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="font-bold text-3xl mb-2 text-center">Document Analysis</div>
                    <p className="text-gray-700 text-base max-w-lg m-4">
                        This is an example of utilizing Azure for document analysis. A custom trained model for form SF-405 (RPA) was created using Document Intelligence.
                    </p>
                    <p className="text-gray-700 text-base max-w-lg m-4">
                        The data was trained from example SF-405 documents.
                    </p>
                </div>
                <div className='flex flex-col items-center '>
                {/* Dropzone */}
                {showMainButtons ? 
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
                                <p className='font-bold text-md'>Drag & drop a file, or click to select a file to upload.</p>
                            }
                                </motion.div>
                            </AnimatePresence>
                            
                        </div>
                    </motion.div>
                
                : null}
                {showMainButtons ? 
                        <div className='flex mx-5 mt-5 mb-10'>
                            <motion.button
                                whileTap={{
                                    scale: 0.9,
                                    transition: { duration: 1 },
                                }}
                                onClick={handleAnalysis}
                                className="mx-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                    Upload
                            </motion.button>
                        </div>
                    : null}

                {loading ? <div className='flex flex-col items-center mt-10 mb-10'> <CircleLoader msg={loadingMsg} /></div> : null}

                {results && results.Documents ? 
                    <div className='flex flex-col'>
                        <motion.button
                            transition={{ease: "easeInOut", duration: 1}}
                            whileTap={{
                                scale: 0.9,
                                transition: { duration: 1 },
                            }}
                            onClick={handleClear}
                            className="mt-5 bg-transparent hover:bg-blue-500 text-blue-700 
                                font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                Clear Results
                        </motion.button>
                        <motion.button
                            transition={{ease: "easeInOut", duration: 1}}
                            whileTap={{
                                scale: 0.9,
                                transition: { duration: 1 },
                            }}
                            onClick={(e) => {navigate("/document-queue")}}
                            className="mt-5 bg-transparent hover:bg-blue-500 text-green-700 
                                font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
                                See Queue
                        </motion.button>
                    </div>
                : null}
                
            </div>
            </div>
            
            
        </div>

       

        

        {/* Results Container*/}
        <div className='results-container justify-items-between justify-between flex ml-2'>
            <div className={`w-1/2 mx-4`}>
                {results && results.Documents ? 
                    <div className='flex flex-col items-center'>
                        {/* Displays the main data... REPLACE */}
                    {/* <DocumentViewer documentData={results} /> */}
                    <FileForm documentData={results} />
                    </div>
                : null}
            </div>
            <div className={`w-1/2 mx-4`}>
                <div className='flex flex-col' style={{minWidth: "500px"}}>
                        
                        {showDocument && !loading && selectedType != "image/jpeg" ? 
                            <>
                            <h2 className='text-center font-bold text-2xl mb-6 p-6'>PDF Preview</h2>
                            <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                                {Array.from(new Array(1), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    // width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                                />
                                ))}
                            </Document>
                            
                            </>
                        : null}
                        {showDocument && !loading && selectedType != "application/pdf" ?
                            <>
                                <h2 className='text-center font-bold text-2xl mb-6 p-6' >Image Preview</h2>
                                <img className='object-cover w-500 h-500' alt="Preview"
                                src={imagePreview} />
                             </>
                        : null}
                    </div>
            </div>
            
        </div>
        

        

        
        <div className='flex flex-col items-center px-2 mx-2'>
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
            
            
                

            {/* WRAPPER */}
                <div className='wrapper'>
                    {/* <div className='flex-1 mx-4' style={{minWidth: "500px"}}>
                        {showDocument && !loading && selectedType != "image/jpeg" ? 
                            <>
                            <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                                {Array.from(new Array(1), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    // width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                                />
                                ))}
                            </Document>
                            
                            </>
                        : null}
                        {showDocument && selectedType != "application/pdf" ?
                            <img className='object-cover w-500 h-500' alt="Preview"
                             src={imagePreview} />
                        : null}
                    </div> */}
                    
                </div>

            
            
               
 
            </motion.div>
            </AnimatePresence>
            
        </div>

        </>
    );
};

export default FileUpload;
