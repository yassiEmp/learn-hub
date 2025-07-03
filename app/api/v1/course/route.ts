import generateLessons from "@/features/course/utils/generateLessons";
import { catchErr } from "@/utils/utils"

export async function POST(req: Request) {

    const styles = ["markdown","aiGen","chunk"]

    //ensure the text and the style of course are there and correct  
    const [err,body] = await catchErr(req.json());

    if ( err || !body ) {
        return new Response(JSON.stringify({err: 'the request body must be a valid json' , message: null}), { status: 400 });
    }

    const { text , style } = body ;

    if (!text || !style ) {
        return new Response(JSON.stringify({err: 'text or style parameter is missing in the request request body' , message: null}), { status: 400 })
    }

    if(!styles.includes(style)){
        return new Response(JSON.stringify({err: 'the style must be markdown or aiGen or chunk ', message: null}))
    }

    //split the text and generate lessons for the course 
    // console.log("this is me using the text : ", text , " and this is me using the style ",style) ;

    const lessons = await generateLessons(text,style)

    console.log(lessons)

    return new Response(JSON.stringify({err: null , message: "the request have been sucessfull" , lessons: lessons}), {
        status: 200
    })

}