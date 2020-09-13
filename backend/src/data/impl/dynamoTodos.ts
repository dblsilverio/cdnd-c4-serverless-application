import * as AWS from 'aws-sdk';

import { TodoData } from '../todoData';
import { TodoItem } from '../../models/TodoItem';
import { TodoUpdate } from '../../models/TodoUpdate';
import { QueryOutput, GetItemOutput, DocumentClient } from 'aws-sdk/clients/dynamodb';

export class DynamoTodos implements TodoData {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly table: string = process.env.TODOS_TABLE,
        private readonly tableUserIndex: string = process.env.TODOS_INDEX_NAME
    ) { }

    async createTodo(todo: TodoItem): Promise<TodoItem> {

        await this.docClient.put({
            TableName: this.table,
            Item: todo
        }).promise()

        return todo;
    }

    async getTodos(userId: string): Promise<TodoItem[]> {

        const result: QueryOutput = await this.docClient.query({
            TableName: this.table,
            IndexName: this.tableUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        if (result.Count !== 0) {
            return <TodoItem[]>(<unknown>result.Items);
        }

        return [];

    }

    async updateTodo(todoId: string, todo: TodoUpdate, userId: string): Promise<void> {

        if (!this.checkTodoOwner(userId, todoId)) {
            throw Error(`Unauthorized operation`)
        }

        await this.docClient.update({
            TableName: this.table,
            Key: { userId, todoId },
            UpdateExpression: "set #n = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done
            },
            ExpressionAttributeNames: {
                '#n': 'name'
            }
        }).promise()

    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {

        if (!this.checkTodoOwner(userId, todoId)) {
            throw Error(`Unauthorized operation`)
        }

        await this.docClient.delete({
            TableName: this.table,
            Key: { todoId, userId }
        }).promise()
    }

    async checkTodoOwner(userId: string, todoId: string): Promise<boolean> {
        const result: GetItemOutput = await this.docClient.get({
            TableName: this.table,
            Key: { todoId, userId }
        }).promise()

        return !!result.Item;
    }

}

function createDynamoDBClient() {

    let params = undefined;

    if (process.env.IS_OFFLINE) {
        params = {
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        }
    }

    return new AWS.DynamoDB.DocumentClient(params)
}