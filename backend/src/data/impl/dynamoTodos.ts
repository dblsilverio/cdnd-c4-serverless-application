import { TodoData } from '../todoData';
import { TodoItem } from '../../models/TodoItem';
import { TodoUpdate } from '../../models/TodoUpdate';
import { QueryOutput, GetItemOutput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger';
import { Logger } from 'winston';

const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

export class DynamoTodos implements TodoData {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly table: string = process.env.TODOS_TABLE,
        private readonly tableUserIndex: string = process.env.TODOS_INDEX_NAME,
        private readonly logger: Logger = createLogger('DynamoTodos')
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
        this.logger.info(`User ${userId} attempting to update Todo id ${todoId}`)

        await this.checkTodoOwner(userId, todoId)

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

    async updateTodoAttachment(todoId: string, attachmentUrl: string, userId: string): Promise<void> {
        this.logger.info(`User ${userId} attempting to update attachment for Todo id ${todoId}: ${attachmentUrl}`)

        await this.checkTodoOwner(userId, todoId)

        await this.docClient.update({
            TableName: this.table,
            Key: { userId, todoId },
            UpdateExpression: "set attachmentUrl = :url",
            ExpressionAttributeValues: {
                ':url': attachmentUrl
            }
        }).promise()

    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        this.logger.info(`User ${userId} attempting to delete Todo id ${todoId}`)

        await this.checkTodoOwner(userId, todoId)

        await this.docClient.delete({
            TableName: this.table,
            Key: { todoId, userId }
        }).promise()
    }

    async checkTodoOwner(userId: string, todoId: string): Promise<void> {
        const result: GetItemOutput = await this.docClient.get({
            TableName: this.table,
            Key: { todoId, userId }
        }).promise()

        const isOwner: boolean = !!result.Item;

        if (!isOwner) {
            this.logger.warn(`User ${userId} is not owner of todo ${todoId}`)
            throw Error(`Unauthorized operation`)
        }

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