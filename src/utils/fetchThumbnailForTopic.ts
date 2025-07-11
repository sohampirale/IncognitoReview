// lib/pexels.ts
import axios from "axios";

export async function fetchThumbnailForTopic(topic: string) {
    try {
        // Add some debugging
        console.log('Fetching thumbnail for topic:', topic);
        console.log('API Key exists:', !!process.env.PEXELS_API_KEY);
        
        const {data} = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(topic)}&per_page=1`, {
            headers: {
                // Make sure the header format is correct - should be "YOUR_API_KEY"
                Authorization: process.env.PEXELS_API_KEY!,
            },
        });
        
        console.log('API Response:', data);
        console.log('Photos array:', data.photos);
        
        const photo = data.photos?.[0];
        console.log('First photo:', photo);
        
        const thumbnailUrl = photo?.src?.medium || null;
        console.log('Thumbnail URL:', thumbnailUrl);
        
        return thumbnailUrl;
    } catch (error) {
        // Log the actual error for debugging
        console.error('Failed to fetch thumbnail:', error);
        
        // Log more specific error details
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Response Data:', error.response?.data);
        }
        
        return null;
    }
}