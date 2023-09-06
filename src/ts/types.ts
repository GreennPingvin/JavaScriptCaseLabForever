export interface Todo {
  id: number;
  content: string;
  finished: boolean;
}

export type TodoParity = "odd" | "even" | null;
