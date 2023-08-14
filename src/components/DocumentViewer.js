import React from 'react';

const DocumentViewer = ({ documentData }) => {
  return (
    <div className='bg-blue-100 p-10 flex flex-col'>
        <h2 className='text-center font-bold text-xl mb-4'>Results</h2>
      {documentData.Documents.map((document, index) => (
        <div key={index}>
          <h2><strong>Model:</strong> {document.DocumentType}</h2>
          <ul>
            {Object.entries(document.Fields).map(([fieldName, field]) => (
              <li key={fieldName}>
                <strong>{fieldName}:</strong> {field.Content} (Confidence: {field.Confidence})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DocumentViewer;