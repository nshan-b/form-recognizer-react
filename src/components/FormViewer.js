import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FcCheckmark } from 'react-icons/fc';
import { ImSpinner2, ImCheckMark2, ImCheckmark} from 'react-icons/im';
import { IoMdCheckmark } from "react-icons/io";


const FormViewer = ({ data }) => {
  
    // TODO: See notes.
  const [formData, setFormData] = useState({
    ...data,
    hasSignature: (data.status && data.status.status == "completed") ? true : false // change later based on future signature model
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);


  const handleChange = (e) => {
    const { id, value } = e.target; // Destructure id and value from event target
    console.log(formData); // Check if formData is updating
    setFormData(prevFormData => ({
      ...prevFormData,  // Spread previous state
      [id]: value,      // Update only the field with the given id
    }));
  };

  const handleChecked = (e) => {
    const { id, checked } = e.target; // Use `checked` for checkboxes, not `value`
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: checked, // Update `hasSignature` with `checked` value
    }));
  }

  const isoToDateInput = (isoDate) => {
    if (!isoDate) return ''; // Handle null or undefined case
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const confidenceColor = (confidence) => {
    if (confidence >= 0.85) {
      return 'text-green-600'; // Green for high confidence
    } else if (confidence >= 0.6) {
      return 'text-yellow-600'; // Yellow for moderate confidence (if needed)
    } else {
      return 'text-red-600'; // Red for low confidence
    }
  };

  const save = async() => {


    try {
        console.log('form data going in', formData)
        setIsSaving(true);

        let res = await axios.post(`http://localhost:5002/api/doc/updateDocument/${formData.id}`, formData, {
            headers: {
                'Content-Type': 'application/json'
              }
        });
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000); // Reset the state after 3 seconds
          }, 2000); // Simulate a 2-second save operation
        console.log('res save', res)
        return res;
    }
    catch (e) {
        console.error("Error: ", e)
    }

    // Reset the state after 3 seconds
    
  }

  useEffect(() => {
    console.log('form data: ', formData)
  }, [formData])

  return (
    <form className="max-w-max bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-wrap">
      <div className="w-full md:w-1/2 px-3 mb-6">
        <h2 className="text-lg font-bold mb-4">Agency Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agencyName_Content">
            Agency Name <span className={`text-sm ${confidenceColor(formData.agencyName_Confidence)}`}>
              {formData.agencyName_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="agencyName_Content"
            type="text"
            placeholder="Agency Name"
            value={formData.agencyName_Content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agencyAddress_Content">
            Agency Address <span className={`text-sm ${confidenceColor(formData.agencyAddress_Confidence)}`}>
              {formData.agencyAddress_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="agencyAddress_Content"
            type="text"
            placeholder="Agency Address"
            value={formData.agencyAddress_Content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='initial_Content'>
          Initial{' '}
          <span className={`text-sm ${confidenceColor(formData.initial_Confidence)}`}>
            ({formData.initial_Confidence})
          </span>:
          <input
            id="initial_Content"
            type="checkbox"
            className="ml-2 leading-tight"
            checked={formData.initial_Content}
            onChange={handleChecked}
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='updated_Content'>
          Updated{' '}
          <span className={`text-sm ${confidenceColor(formData.updated_Confidence)}`}>
            ({formData.updated_Confidence})
          </span>:
          <input
            id="updated_Content"
            type="checkbox"
            className="ml-2 leading-tight"
            checked={formData.updated_Content}
            onChange={handleChecked}
          />
        </label>
      </div>
        {/* Add more fields for Agency County and others as needed */}
      </div>
      <div className="w-full md:w-1/2 px-3 mb-6">
        <h2 className="text-lg font-bold mb-4">Board Members</h2>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={`boardMember${index}`} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`bM${index}_Name_Content`}>
              Board Member {index} Name <span className={`text-sm ${confidenceColor(formData[`bM${index}_Name_Confidence`])}`}>
                {formData[`bM${index}_Name_Confidence`]}
              </span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`bM${index}_Name_Content`}
              type="text"
              placeholder={`Board Member ${index} Name`}
              value={formData[`bM${index}_Name_Content`] || ''}
              onChange={handleChange}
            />
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2" htmlFor={`bM${index}_Address_Content`}>
              Board Member {index} Address <span className={`text-sm ${confidenceColor(formData[`bM${index}_Address_Confidence`])}`}>
                {formData[`bM${index}_Address_Confidence`]}
              </span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={`bM${index}_Address_Content`}
              type="text"
              placeholder={`Board Member ${index} Address`}
              value={formData[`bM${index}_Address_Content`] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <div className="w-full md:w-1/2 px-3 mb-6">
        <h2 className="text-lg font-bold mb-4">Other Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clerkName_Content">
            Clerk Name <span className={`text-sm ${confidenceColor(formData.clerkName_Confidence)}`}>
              {formData.clerkName_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="clerkName_Content"
            type="text"
            placeholder="Clerk Name"
            value={formData.clerkName_Content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clerkAddress_Content">
            Clerk Address <span className={`text-sm ${confidenceColor(formData.clerkAddress_Confidence)}`}>
              {formData.clerkAddress_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="clerkAddress_Content"
            type="text"
            placeholder="Clerk Address"
            value={formData.clerkAddress_Content}
            onChange={handleChange}
          />
        </div>
        {/* Add more fields for Clerk Title and others as needed */}
      </div>
      <div className="w-full md:w-1/2 px-3 mb-6">
        <h2 className="text-lg font-bold mb-4">President Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presidentName_Content">
            President Name <span className={`text-sm ${confidenceColor(formData.presidentName_Confidence)}`}>
              {formData.presidentName_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="presidentName_Content"
            type="text"
            placeholder="President Name"
            value={formData.presidentName_Content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="presidentAddress_Content">
            President Address <span className={`text-sm ${confidenceColor(formData.presidentAddress_Confidence)}`}>
              {formData.presidentAddress_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="presidentAddress_Content"
            type="text"
            placeholder="President Address"
            value={formData.presidentAddress_Content}
            onChange={handleChange}
          />
        </div>
        {/* Add more fields for President Title and others as needed */}
      </div>
      <div className="w-full md:w-1/2 px-3 mb-6">
        <h2 className="text-lg font-bold mb-4">Signed Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signedName_Content">
            Signed Name <span className={`text-sm ${confidenceColor(formData.signedName_Confidence)}`}>
              {formData.signedName_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="signedName_Content"
            type="text"
            placeholder="Signed Name"
            value={formData.signedName_Content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signedDate_Content">
            Signed Date <span className={`text-sm ${confidenceColor(formData.signedDate_Confidence)}`}>
              {formData.signedDate_Confidence}
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="signedDate_Content"
            type="date"
            value={formData.signedDate_Content ? new Date(formData.signedDate_Content).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </div>
        {/* Add more fields for Signed Information as needed */}
        <div className="mb-4">
          <label className="mr-2 text-center text-gray-700 text-sm font-bold mb-2" htmlFor="hasSignature">
            Has Signature?
          </label>
          <input
            className=" mr-2 leading-tight"
            id="hasSignature"
            type="checkbox"
            checked={formData.hasSignature}
            onChange={handleChecked}
          />
        </div>
      </div>
      <div className="w-full px-3 mb-6 text-center">
        
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4 inline-flex items-center"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            save();
          }}
          disabled={isSaving}
        >
          <span className="inline-flex items-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isSaving || isSaved ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              {isSaving ? (
                <ImSpinner2 className="animate-spin text-2xl text-white mr-2" />
              ) : isSaved ? (
                <IoMdCheckmark className="text-2xl mr-2 text-green-400" />
              ) : null}
            </motion.span>
            <span className={`${isSaving ? "mr-2" : ""}`}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default FormViewer;
