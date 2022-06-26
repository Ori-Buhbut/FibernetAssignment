import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public lock : BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public lockSubscriber = this.lock.asObservable();
  public task : BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public taskSubscriber = this.task.asObservable();

  constructor(private socket: Socket) { 
    this.socketEvents();
  }
  
  socketEvents(){
    this.socket.on('task-add', (task : Task)=>{
      this.task.next({operation: 'add', task});
    });
    this.socket.on('task-update', (task : Task)=>{
      this.task.next({operation: 'update', task});
    });
    this.socket.on('task-delete', (task : Task)=>{
      this.task.next({operation: 'delete', task});
    });
    this.socket.on('task-lock', (id : string)=>{ // if other user editing the task - performe lock 
      this.lock.next({_id: id, lock: true});
    });

    this.socket.on('task-release', (id : string)=>{ // release lock 
      this.lock.next({_id: id, lock: false});
    });
  }

  emitLock(id: string) {
    this.socket.emit('task-lock', id);
  }

  emitRelease(id: string) {
    this.socket.emit('task-release', id);
  }

  emitAdd(task: Task){
    this.socket.emit('task-add', task);
  }

  emitUpdate(task: Task){
    this.socket.emit('task-update', task);
  }

  emitDelete(task: Task){
    this.socket.emit('task-delete', task);
  }
}
