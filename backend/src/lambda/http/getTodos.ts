import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodos } from '../../business/todos';
import { TodoItem } from '../../models/TodoItem';
import { getUserId } from '../utils';

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);

  const items: TodoItem[] = await getTodos(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})

handler.use(cors({ credentials: true }))