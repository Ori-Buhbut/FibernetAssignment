import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/services/data.service';
import { Task, TaskColumns } from '../models/task';
import { MatDialog } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { SocketService } from 'src/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy{
  displayedColumns: string [] = TaskColumns.map((col) => col.key);;
  columnsSchema: any = TaskColumns;
  dataSource = new MatTableDataSource<Task>();
  lockSubscription: any = null;
  taskSubscription: any = null;
  constructor(public dialog: MatDialog,  private dataService: DataService, private socketService: SocketService) {
    this.subscribers();
  }

  subscribers(){
    this.lockSubscription = this.socketService.lockSubscriber.subscribe(res=>{ // task lock/release events
      if(res){
        let taskIndex = this.dataSource.data.findIndex(t=> t._id == res._id);
        if(taskIndex > -1){
            this.dataSource.data[taskIndex].locked = res.lock;
        }
      }
    });
    this.taskSubscription = this.socketService.taskSubscriber.subscribe(res=>{ // tasks events
      if(res){
        let foundIndex = this.dataSource.data.findIndex(t=> t._id == res.task._id);
        switch(res.operation){
          case "add":
            this.dataSource.data = [res.task, ...this.dataSource.data];
            break;
          case "update":
            this.dataSource.data.splice(foundIndex, 1, res.task);
            this.dataSource.data = [...this.dataSource.data];
            break;
          case "delete":
            this.dataSource.data.splice(foundIndex, 1);
            this.dataSource.data = [...this.dataSource.data];
            break;
          default:
            break;
        }
      }
    });
  }

  ngOnInit() { // get tasks & check for locked task and release it
    let lastEditedTask = localStorage.getItem("lastEditedTask");
    if(lastEditedTask){ // release task lock if user refresh the page
      this.socketService.emitRelease(lastEditedTask);
    }
    this.dataService.getTasks().subscribe((tasks) => {
      this.dataSource.data = tasks;
    });
  }

  ngOnDestroy(): void { // unsubscribe
    this.lockSubscription.unsbscribe();
    this.taskSubscription.unsbscribe();
  }

  updateRow(row: Task) { // update task
    if (row._id === "") {
      row.isEdit = false;
      row._id = uuidv4();
      this.dataService.addTask(row).subscribe((task: Task) => {
        if(task){
          this.socketService.emitAdd(task);
        }
      });
    } else {
      this.dataService.updateTask(row).subscribe((task: Task) => {
        if(task){
          row.isEdit = false;
          this.socketService.emitRelease(task._id);
          this.socketService.emitUpdate(task);
        }
      });
    }
  }


  deleteRow(row : Task) { // delete task
    this.dataService.deleteTask(row).subscribe((task: Task) => {
      if(task){
        this.socketService.emitDelete(task);
        this.dataSource.data = this.dataSource.data.filter(
          (u: Task) => u._id !== row._id
        );
      }
    });
  }

  addRow() { // add empty row
    const newRow: Task = {
      _id: '',
      task: '',
      owner: '',
      priority: '',
      dueDate: new Date(),
      isEdit: true,
      locked: false
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  onEditClick(row : Task){ // saves the last edited task and emit lock
    localStorage.setItem('lastEditedTask', row._id);
    row.isEdit = !row.isEdit
    this.socketService.emitLock(row._id);
  }
}
