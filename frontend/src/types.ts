export interface Issue {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  createdAt?: string;
  updatedAt?: string;
}