import axios from "axios";
import React, {useEffect, useState} from "react";
import DQCard from "../components/DQCard";
import { Link } from "react-router-dom";
import { SiMicrosoftazure } from "react-icons/si";


// Document Queue
const DQ = (props) => {

    const [data, setData] = useState(null);


    const getDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/doc/getDocuments');
            console.log('Documents:', response);
            setData(response.data)
            // Handle success, e.g., show a success message or redirect
        } 
        catch (error) {
            console.error('Error getting document:', error);
            // Handle error, e.g., show an error message
        }
    };

    useEffect(() => {
        async function fetchData() {
            getDocuments();
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log("Data: ", data)
    }, [data])

    


    return(
        <div className="flex flex-col relative">

            {/* <div className="absolute top-0 right-0 mr-4 mt-4">
                <span className="flex items-center ">
                    <SiMicrosoftazure className="text-xl" />
                    <p className="text-lg ml-2 ">Current model: </p>
                </span>
                
            </div> */}

            <div className="flex flex-col ml-2 mt-2">
                <div className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                    Document Queue
                </div>
                <div className="mb-4 max-w-xl text-base leading-7 text-slate-700 mt-2">
                    This is the current queue for all uploaded documents that either must be reviewed or are deemed completed. In the future we can separate categories and further organize the items.
                </div>
            </div>
            <div className="flex flex-wrap">
                {data && data.length > 0 ? data.map((data, index) => (
                    <DQCard
                        id={data.id}
                        key={index}
                        type={data.type}
                        status={data.status}
                        name={data.agencyName_Content}
                        date={data.status ? data.signedDate_Content : Date.now().toLocaleString()}
                    />
                )) : null}
            </div>





        </div>
    );
}

export default DQ;