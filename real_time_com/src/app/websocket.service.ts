import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  endpoint: string = 'http://localhost:8080/webrtc';
  stompClient: any;
  messages$ = new Subject<any>();
  messages: any[] = [];
  texts: string[] = [];

  constructor() {}

  connect() {
    console.log('init websocket');
    const socket: any = new SockJS(this.endpoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      // this.sessionId = /\/([^\/]+)\/websocket/.exec(socket.url)?[1] ?? '';
      console.log('session id url', socket._transport.url);

      this.stompClient.subscribe('/user/queue/message', (data: any) => {
        console.log('userqueuesignalingg', data.body);
        this.onTextReceived(data);
        this.onMessageReceived(data);
      });

      // this.stompClient.subscribe('/user/queue/hello', (data: any) => {
      //   console.log('userqueue', data.body);
      // });

      // this.stompClient.subscribe(
      //   '/user/' + this.userId + '/signaling',
      //   (data: any) => {
      //     this.onMessageReceived(data);
      //   }
      // );
      // this.stompClient.subscribe('/topic/signaling', (data: any) => {
      //   console.log('subscribed to topic/signaling', data);

      //   this.onMessageReceived(data);
      // });
    });
    // setTimeout(() => {
    //   this.stompClient.send(
    //     '/app/signaling',
    //     {},
    //     JSON.stringify('hello from the client!')
    //   );
    // }, 3000);
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('disconnected');
  }

  onError(error: any) {
    console.log('onError', error);
    setTimeout(() => {
      this.connect();
    }, 3000);
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/message', {}, JSON.stringify(message));
  }

  onTextReceived(message: any) {
    this.texts.push(message.body);
  }

  onMessageReceived(message: any) {
    this.messages.push(JSON.parse(message.body));
    this.messages$.next(this.messages);
    // this.messages.pipe(tap((list) => list.push(JSON.stringify(message.body))));
    console.log('message received from server', message.body);
    // this.messages.subscribe((messages) =>
    //   console.log('sockesubmessgaes', messages)
    // );
  }

  getMessages() {
    return this.messages;
  }
}
