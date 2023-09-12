import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
// import {
//   Component,
//   ElementRef,
//   OnDestroy,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import { Stomp } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
// import { SessionId, Signal, SignalType } from '../models/signal.model';

// @Component({
//   selector: 'app-conference',
//   templateUrl: './conference.component.html',
//   styleUrls: ['./conference.component.css'],
// })
// export class ConferenceComponent implements OnInit, OnDestroy {
//   @ViewChild('localVideo') localVideo!: ElementRef;
//   // @ViewChild('remoteVideo') remoteVideo!: ElementRef;
//   public streaming: boolean = false;
//   private localStream!: MediaStream;
//   private remoteStream!: MediaStream;
//   public remoteStreams: { id: SessionId; stream: MediaStream }[] = [];
//   // private selectedStreamIndex: number = -1;
//   // private selectedStreamId: number = -1;
//   private peerConnections: { [key: string]: RTCPeerConnection } = {};
//   private selectedVideo: MediaStream | null = null;
//   private configuration: RTCConfiguration = {
//     iceServers: [
//       {
//         urls: 'stun:stun.l.google.com:19302',
//       },
//     ],
//   };
//   private mediaConstraints: MediaStreamConstraints = {
//     audio: true,
//     video: true,
//   };
//   private offerOptions: RTCOfferOptions = {
//     offerToReceiveAudio: true,
//     offerToReceiveVideo: true,
//   };
//   private endpoint: string = 'http://localhost:8080/webrtc';
//   private stompClient: any;
//   private sessionId: SessionId = null;

//   getLocalStream() {
//     navigator.mediaDevices
//       .getUserMedia(this.mediaConstraints)
//       .then((stream) => {
//         this.localStream = stream;
//         this.localVideo.nativeElement.srcObject = stream;
//         this.send(null, SignalType.OfferRequest, null);
//       })
//       .catch(console.log);
//   }

//   send(toId: SessionId, type: SignalType, data: any) {
//     const signal: Signal = { fromId: this.sessionId, toId, type, data };
//     this.stompClient.send('/app/signal', {}, JSON.stringify(signal));
//   }

//   createPeerConnection(sessionId: SessionId, callback: Function) {
//     console.log(
//       'createPeerConnection',
//       sessionId,
//       callback,
//       this.peerConnections
//     );

//     if (!sessionId) return;
//     try {
//       const pc = new RTCPeerConnection(this.configuration);
//       this.peerConnections = { ...this.peerConnections, [sessionId]: pc };
//       pc.onicecandidate = (e) => {
//         if (e.candidate) {
//           this.send(sessionId, SignalType.Candidate, e.candidate);
//         }
//       };
//       pc.ontrack = (e) => {
//         console.log('ontrackkkkkkkkkkkkkkkkkkk', e);

//         const remoteStream = new MediaStream();

//         e.streams[0]
//           .getTracks()
//           .forEach((track) => remoteStream.addTrack(track));
//         const remoteVideo = {
//           id: sessionId,
//           // stream: e.streams[0],
//           stream: remoteStream,
//         };

//         // this.selectedVideo = this.remoteStreams.find(s => s.id === this.selectedVideo.id) ? this.remoteStream
//         this.remoteStreams.push(remoteVideo);
//         console.log('remoteStreams', this.peerConnections, this.remoteStreams);
//       };
//       if (this.localStream) {
//         this.localStream
//           .getTracks()
//           .forEach((track) => pc.addTrack(track, this.localStream));
//       }
//       console.log('this.localStream.getTracks()', this.localStream.getTracks());

//       // if (this.localStream) {
//       //   pc.addTrack(this.localStream.getTracks()[0], this.localStream);
//       // }
//       // if (this.localStream) {
//       //   this.localStream
//       //     .getTracks()
//       //     .forEach((track) => pc.addTrack(track, this.localStream));
//       // }
//       callback(pc);
//     } catch (error) {
//       console.log('createpeerconnerror', error);
//       callback(null);
//     }
//   }

//   ngOnInit(): void {}

//   ngOnDestroy(): void {
//     this.send(null, SignalType.Disconnect, null);
//   }

//   init(): void {
//     const socket: any = new SockJS(this.endpoint);
//     this.stompClient = Stomp.over(socket);
//     this.stompClient.connect({}, (frame: any) => {
//       const sessionId = /\/([^\/]+)\/websocket/?.exec?.(
//         socket._transport.url
//       )?.[1];
//       this.sessionId = sessionId || null;
//       this.getLocalStream();

//       this.stompClient.subscribe('/user/queue/signal', (frame: any) => {
//         const signal = JSON.parse(frame.body) as Signal;
//         console.log('SignalType.subscribe', this.peerConnections, signal);
//         switch (signal.type) {
//           case SignalType.Disconnect: {
//             this.remoteStreams = this.remoteStreams.filter(
//               (stream) => stream.id !== signal.fromId
//             );
//             this.selectedVideo =
//               this.selectedVideo?.id === signal.fromId
//                 ? this.remoteStreams?.[0].stream
//                 : null;
//             break;
//           }
//           case SignalType.OfferRequest: {
//             this.createPeerConnection(
//               signal.fromId,
//               (pc: RTCPeerConnection) => {
//                 if (pc) {
//                   pc.createOffer(this.offerOptions).then((sdp) => {
//                     pc.setLocalDescription(sdp);
//                     this.send(signal.fromId, SignalType.Offer, sdp);
//                   });
//                 }
//               }
//             );
//             break;
//           }
//           case SignalType.Offer: {
//             this.createPeerConnection(
//               signal.fromId,
//               (pc: RTCPeerConnection) => {
//                 if (!pc) return;
//                 // this.localStream
//                 //   .getTracks()
//                 //   .forEach((track) => pc.addTrack(track, this.localStream));
//                 pc.setRemoteDescription(
//                   new RTCSessionDescription(signal.data)
//                 ).then(() => {
//                   pc.createAnswer(this.offerOptions).then((sdp) => {
//                     pc.setLocalDescription(sdp);
//                     this.send(signal.fromId, SignalType.Answer, sdp);
//                   });
//                 });
//               }
//             );
//             console.log('SignalType.Offer', this.peerConnections);

//             break;
//           }
//           case SignalType.Answer: {
//             if (!signal.fromId) return;
//             const pc = this.peerConnections[signal.fromId];
//             pc.setRemoteDescription(
//               new RTCSessionDescription(signal.data)
//             ).then(() => {});
//             break;
//           }
//           case SignalType.Candidate: {
//             if (!signal.fromId) return;
//             const pc = this.peerConnections[signal.fromId];
//             if (pc) {
//               pc.addIceCandidate(new RTCIceCandidate(signal.data));
//             }
//             break;
//           }
//           default:
//             break;
//         }
//       });
//     });
//   }

//   // switchVideo(index: number) {
//   //   // this.selectedStreamIndex = index;
//   //   this.remoteVideo.nativeElement.srcObject = this.remoteStreams[index].stream;
//   // }
// }
