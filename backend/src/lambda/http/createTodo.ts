import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../business/todos'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);

  const item: TodoItem = await createTodo(newTodo, userId);
  item.userId = userId;

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    body: JSON.stringify({ item })
  }
}
