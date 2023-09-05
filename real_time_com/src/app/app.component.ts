import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebrtcService } from './webrtc.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  @ViewChild('localVideo') localVideo!: ElementRef;

  constructor(
    protected webSocketService: WebsocketService,
    protected webRtcService: WebrtcService
  ) {}

  ngOnInit() {
    this.webSocketService.connect();
    this.webSocketService.messages$.subscribe((messages) => {
      console.log('subscribemessages');
      this.handleMessage(messages.pop());
    });
  }

  handleMessage(message: any) {
    console.log('comp handle messgae', message.type, message);

    switch (message.type) {
      case 'offer':
        console.log('offer comp handle messgae', message);
        return this.webRtcService.handleOffer(message.offer, this.remoteVideo);
      case 'answer':
        return this.webRtcService.handleAnswer(message.answer);
      case 'candidate':
        return this.webRtcService.handleCandidate(message.candidate);
    }
  }

  call() {
    this.webRtcService.call(this.remoteVideo);
    this.webRtcService.showLocalVideo(this.localVideo);
  }

  sendText(text: string) {
    this.webSocketService.sendMessage(text);
  }
}
