import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'socket_real_time_data';
  websocket: WebSocketSubject<any> | undefined;
  realtimeData: any[] = [];

  ngOnInit(): void {
    this.websocket = webSocket('ws://localhost:3000'); // Replace with your server URL

    this.websocket.subscribe(
      (data) => {
        this.realtimeData = data;
        // Update your UI with real-time data
      },
      (error) => {
        console.error('WebSocket error:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.websocket) {
      this.websocket.complete(); // Close the WebSocket connection when the component is destroyed
    }
  }
}
