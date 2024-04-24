interface TaskData {
  status: string;
  data?: any;
}

const taskStatus: Record<number, TaskData> = {};

export function setTaskStatus(taskId: number, status: TaskData) {
  taskStatus[taskId] = status;
}

export function getTaskStatus(taskId: number): TaskData | undefined {
  return taskStatus[taskId];
}
