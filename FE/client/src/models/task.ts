export class Task {
    _id:string = "";
    task: string = "";
    owner: string = "";
    priority:string = "";
    dueDate: Date = new Date();
    isEdit: boolean = false;
    locked: boolean = false;
}


export const TaskColumns = [
    {
      key: 'task',
      type: 'text',
      label: 'Task',
      required: true,
    },
    {
      key: 'owner',
      type: 'text',
      label: 'Owner',
      required: true,
    },
    {
      key: 'priority',
      type: 'text',
      label: 'Priority',
      required: true,
    },
    {
      key: 'dueDate',
      type: 'date',
      label: 'Due Date',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    },
  ];