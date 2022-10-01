import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getStatus(): Observable<Object> {
    let url = 'http://localhost:5200/status';
    return this.http.get(url);
  }

  getDirectoryListing(directory: string): Observable<Object> {
    let url = 'http://localhost:5200/stream';
    return this.http.post(url, { path: directory });
  }
}
