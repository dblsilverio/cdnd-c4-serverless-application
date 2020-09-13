import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { signedUrl } from '../../business/images'

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  const uploadUrl: String = await signedUrl(todoId, userId);

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    body: JSON.stringify({ uploadUrl })
  }
})

handler.use(cors({ credentials: true }))