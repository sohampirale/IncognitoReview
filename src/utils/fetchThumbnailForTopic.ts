// lib/pexels.ts
import axios from "axios";

export async function fetchThumbnailForTopic(topic: string) {
    try {
        const {data} = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(topic)}&per_page=1`, {
          headers: {
            Authorization: process.env.PEXELS_API_KEY!,
          },
        });
        console.log('fetched');
        
        const photo = data.photos?.[0];

        return photo?.src?.medium || null;
    } catch (error) {
        console.log('failed');
        
        return null
    }

}
