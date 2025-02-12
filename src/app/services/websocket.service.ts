import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private apiUrl = 'http://localhost:3001'; // Match your backend port

  constructor(private http: HttpClient) {}

  connect(email: string) {
    this.socket = new WebSocket(`ws://localhost:3001?email=${email}`);

    this.socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received passkey:", data);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  sendPasskey(email: string, passkey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-passkey`, { email, passkey });
  }
} 