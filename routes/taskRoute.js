import { Router } from "express";
import { deleteTask, getTask, postTask, updateTask } from "../controller/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", protect, getTask);
router.post("/", protect, postTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;