import express from 'express';
import { auth } from '../middleware/auth.js';
import SubTask from '../models/SubTask.js';
import Task from '../models/Task.js';

const router = express.Router();

// 2. Create sub task
router.post('/', auth, async (req, res) => {
  try {
    const { task_id } = req.body;

    if (!task_id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const task = await Task.findOne({ _id: task_id, user: req.userId, deleted: false });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const subTask = new SubTask({ task: task_id });
    await subTask.save();

    res.status(201).json(subTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Get all user sub tasks
router.get('/', auth, async (req, res) => {
  try {
    const { task_id } = req.query;
    const filter = { deleted: false };

    if (task_id) {
      const task = await Task.findOne({ _id: task_id, user: req.userId, deleted: false });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      filter.task = task_id;
    } else {
      const userTasks = await Task.find({ user: req.userId, deleted: false }).select('_id');
      filter.task = { $in: userTasks.map(task => task._id) };
    }

    const subTasks = await SubTask.find(filter).populate('task', 'title');
    res.json(subTasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Update subtask
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (status === undefined || ![0, 1].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const subTask = await SubTask.findOne({ _id: req.params.id, deleted: false });

    if (!subTask) {
      return res.status(404).json({ error: 'SubTask not found' });
    }

    const task = await Task.findOne({ _id: subTask.task, user: req.userId, deleted: false });

    if (!task) {
      return res.status(404).json({ error: 'Associated task not found' });
    }

    subTask.status = status;
    await subTask.save();

    res.json(subTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 8. Delete sub task (soft deletion)
router.delete('/:id', auth, async (req, res) => {
  try {
    const subTask = await SubTask.findOne({ _id: req.params.id, deleted: false });

    if (!subTask) {
      return res.status(404).json({ error: 'SubTask not found' });
    }

    const task = await Task.findOne({ _id: subTask.task, user: req.userId, deleted: false });

    if (!task) {
      return res.status(404).json({ error: 'Associated task not found' });
    }

    subTask.deleted = true;
    await subTask.save();

    res.json({ message: 'SubTask deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

