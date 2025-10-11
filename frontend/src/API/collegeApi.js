import {useState,useEffect} from "react";

const CollegeApi = ()=>{
    const [records ,setRecords] = useState([]);
    useEffect(()=>{
        fetch("https://colleges-api.onrender.com/colleges")
        .then(res=>res.json())
        .then(data=>setRecords(data))
        .catch(err=>console.log(err.message))
    },[]);

    return(
        <div>
            <ul>
                {records.map((record, index)=>(
                    <li key={index}>{record}</li>
                ))}
            </ul>
        </div>
    )
}

export default CollegeApi;
