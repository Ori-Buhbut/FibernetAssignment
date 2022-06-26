import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {
  }

  public getTasks() : Observable<Task[]>{
    return this.http.get<Task[]>("/api/tasks/");
  }

  public deleteTask(task : Task) : Observable<Task>{
    return this.http.post<Task>("/api/tasks/delete", task);
  }

  public deleteTasks(tasks : Task[]) : Observable<Task[]>{
    return this.http.post<Task[]>("/api/tasks/delete", tasks);
  }

  public addTask(task : Task) : Observable<Task>{
    return this.http.post<Task>("/api/tasks/add", task);
  }

  public updateTask(task : Task) : Observable<Task>{
    return this.http.post<Task>("/api/tasks/update", task);
  }
}
