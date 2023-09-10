import Task from "../model/taskModel.js";
import mongoose from "mongoose";

// @desc    Get task
// @route   GET /api/tasks
// @access  Private

export const getTask = async (req, res) => {
  try {
    const task = await Task.find({ user: req.user.id });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
};

// @desc    Post task
// @route   POST /api/tasks
// @access  Private
export const postTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description, user: req.user.id });
    try {
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: `Error creating task` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
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
      return res.status(404).send(`No post with id: ${id}`);

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    const updatedTask = { title, description, _id: id };

    await Task.findByIdAndUpdate(id, updatedTask, { new: true });

    res.json(updatedTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
};

// @desc    Get task
// @route   Delete /api/tasks
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    await Task.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
};
