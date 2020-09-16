import { ImageData } from "../data/imageData";
import { S3Images } from "../data/impl/s3Images";
import { TodoData } from "../data/todoData";
import { DynamoTodos } from "../data/impl/dynamoTodos";

const bucketName: string = process.env.BUCKET_NAME

const imagesData: ImageData = new S3Images();
const todoData: TodoData = new DynamoTodos()

export function signedUrl(todoId: string, userId: string): String {
    const signedImageUrl: string = imagesData.signedUrl(todoId);

    if (signedImageUrl) {
        todoData.updateTodoAttachment(todoId, attachmentUrl(todoId), userId)
    }

    return signedImageUrl;
}

function attachmentUrl(todoId: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}