import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../business/todos'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event);

  const item: TodoItem = await createTodo(newTodo, userId);
  item.userId = userId;

  return {
    statusCode: 201,
    body: JSON.stringify({ item })
  }
})

handler.use(cors({ credentials: true }))