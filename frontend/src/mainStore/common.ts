import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../mainStore/Store'
// import { v2 as cloudinary } from 'cloudinary';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export function getTimeDifference(targetDay: Date): string {
    const targetTime = new Date(targetDay);
    const currentTime = new Date()
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(targetTime.getTime() - currentTime.getTime());

    // Convert milliseconds to days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Determine the highest time unit that is greater than zero
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return 'Just now'; // If time difference is less than a minute
    }
}

// cloudinary.config({ 
//     cloud_name: 'dvsncjncq', 
//     api_key: '751555584743295', 
//     api_secret: 'yVLbWY0eVYASA6LteFBXIAOr5BU' 
//   });

// const uploadImage = async (imageBlob: string): Promise<string> => {
//   try {
//     const result = await cloudinary.uploader.upload(imageBlob, { resource_type: "image" });
//     return result.secure_url; // Return the URL of the uploaded image
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     throw error;
//   }
// };

// // Function to upload video to Cloudinary
// const uploadVideo = async (videoBlob: string): Promise<string> => {
//   try {
//     const result = await cloudinary.uploader.upload(videoBlob, { resource_type: "video" });
//     return result.secure_url; // Return the URL of the uploaded video
//   } catch (error) {
//     console.error("Error uploading video to Cloudinary:", error);
//     throw error;
//   }
// };