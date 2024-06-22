import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getTasks = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id } = req.user;

  try {
    const tasks = await prisma.task.findMany({
      where: { authorId: id },
    });

    res.status(200).json(tasks);
    // }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { task } = req.body;

  if (!req.user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = req.user;

  try {
    const newTask = await prisma.task.create({
      data: {
        task,
        author: { connect: { id: userId } },
      },
    });

    res.status(200).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id: taskId } = req.params;

  if (!req.user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = req.user;

  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(taskId), authorId: userId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        completed: !task?.completed,
      },
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id: taskId } = req.params;

  if (!req.user) {
    return res
      .status(400)
      .json({ error: "Not authoriized, please login or register" });
  }

  const { id: userId } = req.user;

  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(taskId), authorId: userId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const deletedTask = await prisma.task.delete({
      where: { id: Number(taskId), authorId: userId },
    });

    res.status(200).json({ message: "Task deleted", task: deletedTask });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
