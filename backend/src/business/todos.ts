import { v4 } from 'uuid';

import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoData } from '../data/todoData';
import { DynamoTodos } from '../data/impl/dynamoTodos';
import { timeInMillis, createTodoDuration, loadTodosDuration, updateTodoDuration, deleteTodoDuration } from '../utils/metrics';

const todoData: TodoData = new DynamoTodos();

export async function createTodo(todo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId: string = v4();
    const createdAt: string = new Date().toISOString()

    const done: boolean = !!todo.done

    const newTodo: TodoItem = { ...todo, todoId, createdAt, done, userId };

    const startTime = timeInMillis()
    const createTodoItem: TodoItem = await todoData.createTodo(newTodo)
    createTodoDuration(timeInMillis() - startTime)

    return createTodoItem
}

export async function getTodos(userId: string): Promise<TodoItem[]> {

    const startTime = timeInMillis()
    const todoItems: TodoItem[] = await todoData.getTodos(userId)
    loadTodosDuration(timeInMillis() - startTime)

    return todoItems;
}

export async function updateTodo(todoId: string, todo: UpdateTodoRequest, userId: string): Promise<void> {
    const startTime = timeInMillis()
    await todoData.updateTodo(todoId, todo, userId)
    updateTodoDuration(timeInMillis() - startTime)

}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
    const startTime = timeInMillis()
    await todoData.deleteTodo(todoId, userId)
    deleteTodoDuration(timeInMillis() - startTime)
}