import * as AWS from 'aws-sdk';
import { ImageData } from "../imageData";

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName: string = process.env.BUCKET_NAME
const urlExpiration: string = process.env.SINGNED_URL_EXPIRATION

export class S3Images implements ImageData {

    signedUrl(todoId: string): string {
        return s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: urlExpiration
        })
    }

}