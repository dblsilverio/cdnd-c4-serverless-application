import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../business/todos'
import { getUserId } from '../utils'

export const handler: middy.Middy<APIGatewayProxyEvent, APIGatewayProxyResult> = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await updateTodo(todoId, updatedTodo, userId);

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return { statusCode: 204, body: "" }
})

handler.use(cors({ credentials: true }))