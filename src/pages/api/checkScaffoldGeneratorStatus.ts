import type { NextApiRequest, NextApiResponse } from 'next';
import { getTaskStatus } from '~/lib/scaffoldStatusStore';

type ResponseData = {
  status?: string;
  data?: any;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const taskId = parseInt(req.query.taskId as string);

    const task = getTaskStatus(taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
  
    res.status(200).json(task);
}