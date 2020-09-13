import * as AWS from 'aws-sdk';
import { ImageData } from "../imageData";

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

export class S3Images implements ImageData {

    constructor(
        private readonly bucketName: string = process.env.BUCKET_NAME,
        private readonly urlExpiration: string = process.env.SIGNED_URL_EXPIRATION
    ){}

    signedUrl(todoId: string): string {
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        })
    }

}