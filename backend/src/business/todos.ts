import { v4 } from 'uuid';

import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoData } from '../data/todoData';
import { DynamoTodos } from '../data/impl/dynamoTodos';

const todoData: TodoData = new DynamoTodos();

export async function createTodo(todo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId: string = v4();
    const createdAt: string = new Date().toISOString();

    const done: boolean = !!todo.done

    const newTodo: TodoItem = { ...todo, todoId, createdAt, done, userId };

    return await todoData.createTodo(newTodo);
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoData.getTodos(userId);
}

export async function updateTodo(todoId: string, todo: UpdateTodoRequest, userId: string): Promise<void> {
    return await todoData.updateTodo(todoId, todo, userId);
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
    return await todoData.deleteTodo(todoId, userId);
}