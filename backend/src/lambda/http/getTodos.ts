import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodos } from '../../business/todos';
import { TodoItem } from '../../models/TodoItem';
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);

  const items: TodoItem[] = await getTodos(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
}
