import chunkTextByPartAndGenLesson from "./chunkTextByPartAndGenLesson"

export default async function generateLessons (text: string , style: "markdown"|"aiGen"|"chunk") {
    switch (style) {
        // case "aiGen":
        //     genarateCourseForTopics(text)
        //     break
        // case "markdown":
        //     generateLessonForTopics(text)
        //     break
        case "chunk":
            const lessons = await chunkTextByPartAndGenLesson(text)
            return lessons
    }
}