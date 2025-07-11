import { getSearchKeywordThumbnailPrompt } from "@/constants";
import axios from "axios";

export default async function getTitlesuggestionForThumbnailMatching(title:string){
    try {
        const prompt = getSearchKeywordThumbnailPrompt(title);

         const {data} = await axios.post("https://api.cohere.ai/v1/generate", {
                model: "command", 
                prompt,
                max_tokens: 500,
                temperature: 0.7,
            },{
                 headers: {
                    Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                    "Content-Type": "application/json",
                }
            });

            const textResponse=data?.generations?.[0]?.text;

            if(!textResponse)return null;
            const jsonResponse=JSON.parse(textResponse.trim());
            
            console.log('title suggestion from coher e= '+jsonResponse.searchKeyword);
                        
            return jsonResponse.searchKeyword;
    } catch (_error) {
        console.log('Error whiel generating searchKeyword from cohere');
        return null;
    }
}   