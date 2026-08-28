export type TaskPriority =
  | "Low"
  | "Medium"
  | "High";

export type Task = {
  id: string;
  clubId?: string;
  clubName?: string;

  title: string;
  description?: string;

  dueAt?: string;

  priority: TaskPriority;
  completed: boolean;
};

export type NewTask = Omit<
  Task,
  "id" | "clubName" | "completed"
>;