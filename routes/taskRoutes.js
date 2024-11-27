import express from 'express';
import { auth } from '../middleware/auth.js';
import Task from '../models/Task.js';
import SubTask from '../models/SubTask.js';

const router = express.Router();

// 1. Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;

    if (!title || !description || !due_date) {
      return res.status(400).json({ error: 'Title, description, and due date are required' });
    }

    const task = new Task({
      title,
      description,
      due_date,
      priority,
      user: req.userId,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Get all user tasks
router.get('/', auth, async (req, res) => {
  try {
    const { priority, due_date, page = 1, limit = 10 } = req.query;
    const filter = { user: req.userId, deleted: false };

    if (priority) {
      filter.priority = priority;
    }

    if (due_date) {
      filter.due_date = { $lte: new Date(due_date) };
    }

    const tasks = await Task.find(filter)
      .sort({ due_date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Update task
router.patch('/:id', auth, async (req, res) => {
  try {
    const { due_date, status } = req.body;
    const updates = {};

    if (due_date) updates.due_date = due_date;
    if (status && ['TODO', 'DONE'].includes(status)) updates.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId, deleted: false },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (status === 'DONE') {
      await SubTask.updateMany(
        { task: task._id, deleted: false },
        { status: 1 }
      );
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Delete task (soft deletion)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await SubTask.updateMany(
      { task: task._id, deleted: false },
      { deleted: true }
    );

    res.json({ message: 'Task and associated subtasks deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

