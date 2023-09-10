import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userTask",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Task model from the schema
const Task = mongoose.model("Task", taskSchema);

export default Task;
