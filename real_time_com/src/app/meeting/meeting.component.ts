import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit, OnDestroy {
  active: boolean = false;
  pc: any;
  localStream: any;

  stompClient: any;

  @ViewChild('local') local: any;
  @ViewChild('remote') remote: any;

  constructor() {}

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  init() {
    const socket: any = new SockJS('http://localhost:8080/webrtc');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/user/queue/signal', (data: any) => {
        console.log('subscribesubscribereceiveMessage', data);
        this.receiveMessage(data);
        // this.onMessageReceived(data);
      });
    });

    // this.pc = new RTCPeerConnection({
    //   iceServers: [
    //     { urls: 'stun:stun.services.mozilla.com' },
    //     { urls: 'stun:stun.l.google.com:19302' },
    //   ],
    // });
    const configuration = {
      configuration: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };

    this.pc = new RTCPeerConnection(configuration);

    this.pc.onicecandidate = (event: any) => {
      console.log('onicecandidate', event.candidate);
      if (event.candidate) {
        this.sendMessage({ ice: event.candidate });
      }
    };

    this.pc.onremovestream = (event: any) => {
      console.log('onremovestream', event);
    };

    this.pc.ontrack = (event: any) => {
      console.log('ontrack', event);
      this.remote.nativeElement.srcObject = event.streams[0];
      // this.showLocal();
    };
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/signal', {}, JSON.stringify(message));
  }

  receiveMessage(data: any) {
    if (!data) return;
    const message = JSON.parse(data.body);
    console.log('receiveMessage', message);

    if (message.ice && this.pc) {
      this.pc.addIceCandidate(new RTCIceCandidate(message.ice));
    } else if (message.sdp.type == 'offer') {
      this.active = true;
      this.pc
        .setRemoteDescription(new RTCSessionDescription(message.sdp))
        .then(() => this.pc.createAnswer())
        .then((answer: any) => this.pc.setLocalDescription(answer))
        .then(() => this.sendMessage({ sdp: this.pc.localDescription }));
    } else if (message.sdp.type == 'answer') {
      this.active = true;
      this.pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    }
  }

  showLocal() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.local.nativeElement.srcObject = stream;
        this.pc.addStream(stream);
        this.localStream = stream;
      });
  }

  // showRemote() {
  connect() {
    this.showLocal();
    this.pc
      .createOffer()
      .then((offer: any) => this.pc.setLocalDescription(offer))
      .then(() => {
        this.sendMessage({ sdp: this.pc.localDescription });
        this.active = true;
      });
  }

  disconnect() {
    this.pc.close();
    this.localStream.getTracks().forEach((t: any) => t.stop());
    this.active = false;
  }
}
