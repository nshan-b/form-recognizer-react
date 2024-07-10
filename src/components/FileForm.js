import React, { useState } from 'react';

const FileForm = ({ documentData }) => {
  const [fieldStates, setFieldStates] = useState({});

  const handleCheckboxChange = (fieldName, checked) => {
    setFieldStates(prevState => ({
      ...prevState,
      [fieldName]: checked ? 'selected' : 'unselected'
    }));
  };

  const handleFieldChange = (fieldName, newValue) => {
    setFieldStates(prevState => ({
      ...prevState,
      [fieldName]: newValue
    }));
  };

  return (
    <div className="bg-white p-6 flex shadow-lg rounded-md flex-col w-full  mx-auto">
      <h2 className="text-center font-bold text-2xl mb-6">Extracted Form Values</h2>
      {documentData.Documents.map((document, index) => (
        <div key={index} className="mb-6">
          <ul>
            {Object.entries(document.Fields).map(([fieldName, field]) => (
              <li key={fieldName} className="mb-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold mr-4">{fieldName}:</label>
                  {field.Confidence <= 0.9 ? (
                    <span className="text-xs bg-red-300 p-1 rounded">(Confidence: {field.Confidence})</span>
                  ) : (
                    <span className="text-xs text-gray-600">(Confidence: {field.Confidence})</span>
                  )}
                </div>
                {fieldName === 'Initial' || fieldName === 'Updated' ? (
                  <input
                    type="checkbox"
                    checked={field.Content === 'selected'}
                    onChange={(e) => handleCheckboxChange(fieldName, e.target.checked)}
                    className="ml-4 mt-2"
                  />
                ) : field.Type === 'textarea' ? (
                  <textarea
                    value={fieldStates[fieldName] || field.Content}
                    onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mt-2 w-full"
                    rows="4"
                  />
                ) : (
                  <input
                    type="text"
                    value={fieldStates[fieldName] || field.Content}
                    onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mt-2 w-full"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FileForm;
