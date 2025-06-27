import { NextRequest } from "next/server";
import { Course } from "@/types/course";

export const POST = async (request: NextRequest)=>{
    const body = await request.json()
    const { courseContent } = body ;
    if(!courseContent){
        return new Response('please provide the course content',{status: 500})
    }
    // const course: Course = {
    //     id: id,
    //     title: title,
    //     description: description, 
    //     instructor: instructor,
    // }
}