import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'mist-liveroom',
  templateUrl: './liveroom.component.html',
  styleUrls: ['./liveroom.component.scss']
})
export class LiveroomComponent implements OnInit, OnDestroy {
  @ViewChild('localvideo') localVideo: ElementRef;
  @ViewChild('remotevideo') remoteVideo: ElementRef;
  joined: boolean;
  roomNumber: string;
  socket: WebSocket;
  isCaller: boolean;
  mediaStreamConstrain: MediaStreamConstraints = {
    video: true,
    audio: true,
  };
  rtcConfig: RTCConfiguration = {
    iceServers: [{
      urls: 'turn:144.34.190.154:3478',
      username: 'saber',
      credential: 'saber',
    }]
  };
  localStream: MediaStream;
  remoteStream: MediaStream;
  rtcPeerConnection: RTCPeerConnection;

  constructor() {}

  sendMessage(msg: any) {
    this.socket.send(JSON.stringify(msg));
  }
  ngOnDestroy() {
    this.hangup();
  }
  join() {
    this.socket = new WebSocket(
      document.location.protocol === 'https:'
        ? 'wss://spectrumlife.online/api/chat/' + this.roomNumber
        : 'ws://127.0.0.1:8080/api/chat/' + this.roomNumber
    );
    this.socket.onopen = (ev) => {
      this.sendMessage({
        header: 'create or join',
        body: this.roomNumber,
      });
    };
    this.socket.onclose = (evt) => {
      this.socket = null;
    };
    this.socket.onmessage = (evt) => {
      console.log(evt.data);
      const msg = JSON.parse(evt.data);
      if (msg.header === 'created') {
        this.joined = true;
        console.log('create room ', msg.body);
        navigator.mediaDevices.getUserMedia(this.mediaStreamConstrain).then((stream) => {
          this.localStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.isCaller = true;
        }).catch(e => {
          console.log('err', e);
        });
      }
      if (msg.header === 'full') {
        alert('房间已满');
      }
      if (msg.header === 'joined') {
        this.joined = true;
        console.log('joined');
        navigator.mediaDevices.getUserMedia(this.mediaStreamConstrain).then((stream) => {
          this.localStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.sendMessage({
            header: 'ready',
            body: this.roomNumber,
          });
        }).catch(e => {
          console.log('err,', e);
        });
      }
      if (msg.header === 'ready') {
        if (this.isCaller) {
          this.setRTCPeer();
          this.rtcPeerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          }).then(this.createdOffer);
        }
      }
      if (msg.header === 'offer') {
        if (!this.isCaller) {
          this.setRTCPeer();
          this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          this.rtcPeerConnection.createAnswer().then(this.createdAnswer);
        }
      }
      if (msg.header === 'answer') {
        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      }
      if (msg.header === 'candidate') {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: msg.label,
          candidate: msg.candidate
        });
        this.rtcPeerConnection.addIceCandidate(candidate);
      }
    };
  }
  ngOnInit() {}
  setRTCPeer() {
    this.rtcPeerConnection = new RTCPeerConnection(this.rtcConfig);
    this.rtcPeerConnection.onicecandidate = this.handleIcecandidate;
    this.rtcPeerConnection.ontrack = this.addTrack;
    this.localStream.getTracks().forEach(track => {
      this.rtcPeerConnection.addTrack(track, this.localStream);
    });
  }
  handleIcecandidate = (evt: RTCPeerConnectionIceEvent) => {
    const iceCandidate = evt.candidate;
    if (iceCandidate) {
      this.sendMessage({
        header: 'candidate',
        type: 'candidate',
        label: iceCandidate.sdpMLineIndex,
        id: iceCandidate.sdpMid,
        candidate: iceCandidate.candidate,
        room: this.roomNumber,
      });
    }
  }
  addTrack = (evt: RTCTrackEvent) => {
    const mediaStream = evt.streams[0];
    this.remoteStream = mediaStream;
    this.remoteVideo.nativeElement.srcObject = mediaStream;
  }
  createdOffer = (description: RTCSessionDescriptionInit) => {
    this.rtcPeerConnection.setLocalDescription(description).then(() => {
      console.log('offer success');
    });
    this.sendMessage({
      header: 'offer',
      type: 'offer',
      sdp: description,
      room: this.roomNumber,
    });
  }
  createdAnswer = (description: RTCSessionDescriptionInit) => {
    this.rtcPeerConnection.setLocalDescription(description).then(() => {
      console.log('c an remote');
    });
    this.sendMessage({
      header: 'answer',
      type: 'answer',
      sdp: description,
      room: this.roomNumber,
    });
  }
  hangup() {
    if (this.joined) {
      this.localStream.getTracks().forEach(ele => {
        ele.stop();
      });
      this.socket.close(1000);
      this.rtcPeerConnection.close();
      this.rtcPeerConnection = null;
      this.joined = false;
    }
  }
}
