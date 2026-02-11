export type TodoSubject = 'Work' | 'Personal' | 'Military' | 'Urgent' | 'General' ;

export interface Todo {
  id: string;          
  name: string;        
  subject: TodoSubject; 
  priority: number;    
  date: Date;       
  isCompleted: boolean; 
  location: [number, number];
}

export interface AdminOutletContext {
  openEditDialog: (id: string) => void;
  handleOpenDialog: () => void;
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}