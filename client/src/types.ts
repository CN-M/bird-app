export type Todo = {
  id: number;
  task: string;
  completed?: boolean;
  // email: string;
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  timestamp: number;
}
