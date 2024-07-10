import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ url, type }) => {

  // States
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(0.9); // Initial scale value
  
  // SHIFT + and SHIFT -
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === '+') {
        e.preventDefault();
        setScale((prevScale) => prevScale + 0.1);
      } 
      else if (e.shiftKey && e.key === '_') {
        e.preventDefault();
        setScale((prevScale) => prevScale - 0.1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Container
  const [scaledWidth, setScaledWidth] = useState(0); // State to hold scaled width
  const [scaledHeight, setScaledHeight] = useState(0); // State to hold scaled height

  useEffect(() => {
    // Function to update scaled dimensions
    const updateScaledDimensions = () => {
      const imgElement = document.getElementById('document-image');
      if (imgElement) {
        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;
        const width = naturalWidth * scale;
        const height = naturalHeight * scale;
        setScaledWidth(width);
        setScaledHeight(height);
      }
    };

    // Call the function on component mount and whenever scale changes
    updateScaledDimensions();
  }, [scale]);


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(1);
  };

  if (type === 'application/pdf') {
    return (
      <div>
        <div className="flex justify-evenly mb-2 max-h-fit">
          <button onClick={() => setScale(scale + 0.1)} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded">+</button>
          <button onClick={() => setScale(scale - 0.1)} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded">-</button>
        </div>
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          className={"hover:cursor-pointer mr-4"}
          onClick={(e) => {
            e.preventDefault();
            if (url) {
              window.open(url, '_blank')
            }
          }}
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={500} // Adjust the width as needed
                height={300}
                scale={scale}
              />
            )
          )}
        </Document>
      </div>
    );
  }
  else {
    return (
      <div className="flex flex-col m-4">
        <div className="flex justify-evenly mb-2 max-h-fit">
          <button onClick={() => setScale(scale + 0.1)} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded">+</button>
          <button onClick={() => setScale(scale - 0.1)} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded">-</button>
       </div>
        <div className="flex items-center justify-center">
          <img
            src={url}
            alt="Document"
            style={{
              zoom: scale
            }}
            className="hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (url) {
                window.open(url, '_blank')
              }
            }}
          />
        </div>
      </div>
    );
  }
  
};

export default PDFViewer;