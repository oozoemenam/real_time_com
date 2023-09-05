import { ElementRef, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  connection!: any;
  localStream: any;

  constructor(private webSocketService: WebsocketService) {}

  connect(remoteVideo: ElementRef) {
    this.connection = new RTCPeerConnection(this.configuration);
    this.getStreams(remoteVideo);
    this.listen();
  }

  listen() {
    this.connection.onicecandidate = (event: any) => {
      console.log('onicecandidate', event);

      if (event.candidate) {
        const payload = {
          type: 'candidate',
          candidate: event.candidate.toJSON(),
        };
        this.webSocketService.sendMessage(payload);
      }
    };
  }

  async handleOffer(offer: RTCSessionDescription, remoteVideo: ElementRef) {
    console.log('handleoffer', offer, remoteVideo);

    this.connect(remoteVideo);
    this.connection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.connection.createAnswer();
    this.connection.setLocalDescription(answer);
    this.webSocketService.sendMessage({ type: 'answer', answer });
  }

  handleAnswer(answer: RTCSessionDescription) {
    this.connection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  handleCandidate(candidate: RTCIceCandidate) {
    if (candidate) {
      this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private async getStreams(remoteVideo: ElementRef) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();
    remoteVideo.nativeElement.srcObject = remoteStream;
    this.connection.ontrack = (event: any) => {
      event.streams[0].getTracks().forEach((track: any) => {
        remoteStream.addTrack(track);
      });
    };
    stream.getTracks().forEach((track) => {
      this.connection.addTrack(track, stream);
    });
  }

  async call(remoteVideo: ElementRef) {
    this.connect(remoteVideo);
    // this.connection = new RTCPeerConnection(this.configuration);
    // this.getStreams(remoteVideo);
    // this.listen();
  }

  showLocalVideo(localVideo: ElementRef) {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        localVideo.nativeElement.srcObject = stream;
        this.connection.addStream(stream);
        this.localStream = stream;
      });
    this.createOffer();
  }

  async createOffer() {
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);
    this.webSocketService.sendMessage({ type: 'offer', offer });
  }
}
