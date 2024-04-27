import type { NextApiRequest, NextApiResponse } from "next";
import { getTaskStatus } from "~/utils/taskManager";

type ResponseData = {
  status?: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const taskId = req.query.taskId as string;
  const task = await getTaskStatus(taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(200).json( { status: task.status, data: task.data});
}
