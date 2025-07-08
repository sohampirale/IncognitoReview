import CreateTopic from "../../temp/CreateTopic/page"

import GiveFeedbackToTopic from "@/app/temp/GiveFeedbackToTopic/page"
import CreateReportForTopic from "@/app/temp/CreateReportForTopic/page"

import SeeReportOfTopic from "@/app/temp/SeeReportOfTopic/page"

export default function AllTemp(){
    return (<>
        <CreateTopic/>
        <GiveFeedbackToTopic/>
        <CreateReportForTopic/>
        <SeeReportOfTopic/>
    </>
    )
}