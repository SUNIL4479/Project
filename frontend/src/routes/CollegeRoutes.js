import express from "express"
import axios from "axios"
const router = express.Router();
router.get("/",async (req,res)=>{
    const {state,districts} = req.query;
    let url = "https://colleges-api.onrender.com/api/colleges";
    try{
        const {data} = await axios.get(url);
        res.json(data);
    }catch(err){
        console.log(err.message);
        res.status(500).json({message : "Failed to fetch College"})
    }
})

export default router;