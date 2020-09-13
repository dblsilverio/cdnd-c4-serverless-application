import { ImageData } from "../data/imageData";
import { S3Images } from "../data/impl/s3Images";

const imagesData: ImageData = new S3Images();

export function signedUrl(todoId: string, userId: string): String {
    return imagesData.signedUrl(todoId, userId);
}