import connectDB from "../../../../lib/mongoose.js";
import { NextResponse } from "next/server";
export async function GET(req){
    try{
        await connectDB();
        
    }catch(err){
        console.log(err)
        NextResponse.json({message: "error"}, {status: 500})
    }
}
   
