import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk'

import { ImageData } from "../imageData";

const XAWS = AWSXRay.captureAWS(AWS)

export class S3Images implements ImageData {

    constructor(
        private readonly bucketName: string = process.env.BUCKET_NAME,
        private readonly urlExpiration: string = process.env.SIGNED_URL_EXPIRATION,
        private readonly s3 = new XAWS.S3({
            signatureVersion: 'v4'
        })
    ) { }

    signedUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })
    }

}