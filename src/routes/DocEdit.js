import axios from "axios";
import React, {useEffect, useState} from "react";
import { Form, useParams } from "react-router-dom";
import { pdfjs, Document, Page } from 'react-pdf';
import PDFViewer from "../components/PDFViewer";
import FormViewer from "../components/FormViewer";


// PDF.js options && worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};


const DocEdit = () => {
    //
    const { id, type } = useParams();

    const [show, setShow] = useState(true);

    const [data, setData] = useState(null);
    const [pdf, setPDF] = useState(null);
    const [fileType, setFileType] = useState(null);

    const getDocument = async (id) => {
        try {
            const response = await axios.get('http://localhost:5002/api/doc/getDocument/' + id);
            console.log('Documents:', response);
            setData(response.data)
            // Handle success, e.g., show a success message or redirect
        } 
        catch (error) {
            console.error('Error getting document:', error);
            // Handle error, e.g., show an error message
        }
    };


    const getDocumentPDF = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5002/api/doc/getDocumentFile/${id}`, {
                responseType: 'blob', // Important to specify the response type as 'blob'
            });

            const contentType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: contentType });
            const url = URL.createObjectURL(blob);

            // TODO change names
            setFileType(contentType);
            setPDF(url);

        } catch (error) {
            console.error('Error getting document:', error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            getDocument(id);
            getDocumentPDF(id)
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div>
            <div className="flex ml-4 text-left font-bold text-xl mt-4 mb-2">Form Editor</div>
            <div className="flex ml-4 text-left font-normal text-lg my-2">Review and edit any information in the form extracted from the PDF or image.</div>
            <button 
                onClick={(e) => {
                    if (show == false) {
                        setShow(true);
                    }
                    else {
                        setShow(false);
                    }
                }}
                class="flex ml-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow text-sm">{show ? "Hide Document" : "Show Document"}</button>
            
            {/* Form section */}
            <div className="flex justify-start ">
                {data ? <FormViewer data={data}/> : null}
                {pdf && show ? <PDFViewer url={pdf} type={fileType} /> : null}
            </div>
        </div>
    );

}

export default DocEdit;