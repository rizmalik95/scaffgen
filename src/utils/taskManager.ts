import redis from '../lib/redisClient';
import { v4 as uuidv4 } from 'uuid';

interface TaskData {
    status: string;
    data?: any;
  }

export async function setTaskStatus(taskId: string, status: TaskData): Promise<void> {
    await redis.set(taskId, JSON.stringify(status));
}

export async function getTaskStatus(taskId: string): Promise<TaskData> {
    const statusJson = await redis.get(taskId);
    if (statusJson) {
        return JSON.parse(statusJson);
    } else {
        throw new Error(`Task ${taskId} not found in task status store`);
    }
}

export function createTaskId(): string {
    return uuidv4();
}