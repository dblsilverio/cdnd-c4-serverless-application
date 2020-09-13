import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

export interface TodoData {
    createTodo(todo: TodoItem): Promise<TodoItem>
    getTodos(userId: string): Promise<TodoItem[]>
    updateTodo(todoId: string, todo: TodoUpdate, userId: string): Promise<void>
    deleteTodo(todoId: string, userId: string): Promise<void>
    checkTodoOwner(userId: string, todoId: string): Promise<void>
    updateTodoAttachment(todoId: string, attachmentUrl: string, userId: string): Promise<void>
}