import Task from "../model/taskModel.js";
import mongoose from "mongoose";

// @desc    Get task
// @route   GET /api/tasks
// @access  Private
export const getTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const tasks = await Task.find({ user: req.user.id });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Post task
// @route   POST /api/tasks
// @access  Private
export const postTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newTask = new Task({ title, description, user: req.user.id });

    try {
      await newTask.save();
      res.status(201).json(newTask);
    } catch (saveError) {
      console.error(saveError);
      return res.status(500).json({ message: "Error saving task" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update task
// @route   UPDATE /api/tasks
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No task with id: ${id}`);

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: `Task not found with id: ${id}` });
    }

    // Check if the user is the owner of the task
    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You are not the owner of this task" });
    }

    const updatedTask = { title, description, _id: id };

    const updated = await Task.findByIdAndUpdate(id, updatedTask, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get task
// @route   Delete /api/tasks
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No task with id: ${id}`);

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: `Task not found with id: ${id}` });
    }

    // Check if the user is the owner of the task
    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You are not the owner of this task" });
    }

    await Task.findByIdAndRemove(id);

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
