// Fixed MyTopicsPage component
import { getServerSession } from "next-auth";
import { getMyTopics } from "@/lib/getMyTopics";
import { authOptions } from "@/app/api/auth";
import MyTopics from "@/Components/Topic/MyTopics";
import { redirect } from "next/navigation";

async function MyTopicsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
        redirect("/api/auth/signin");
    }

    const topics = await getMyTopics(session.user._id);

    return (
        <MyTopics topics={topics} />
    );
}

export default MyTopicsPage;


// import { authOptions } from "@/app/api/auth"
// import MyTopics from "@/Components/Topic/MyTopics"
// import { getMyTopics } from "@/lib/getMyTopics"
// import { getServerSession } from "next-auth"
// import { redirect } from "next/navigation"

// export default async function MyTopicsPage(){
//       const session = await getServerSession(authOptions)

//       if(!session || !session.user || !session.user._id){
//         redirect("/api/auth/login")
//       }

//       const topics=await getMyTopics(session.user._id!);

//     return (
//         <>
//           <MyTopics topics={topics}/>
//         </>
//     )
// }