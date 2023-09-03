const inputElement = document.getElementById("input");
const videoElement = document.getElementById("video");
const messagesElement = document.getElementById("messages");
let peerConnection;
let dataChannel;
let configuration;

const conn = new WebSocket('ws://localhost:8080/socket');

conn.onopen = function() {
    console.log("Connected to signaling server");
    initialize();
}

conn.onmessage = function(message) {
    console.log("On message", message);
    const content = JSON.parse(message.data);
    const { data, event } = content;
    switch (event) {
        case "offer":
            handleOffer(data);
            break;
        case "answer":
            handleAnswer(data);
            break;
        case "candidate":
            handleCandidate(data);
            break;
        default:
            break;
    }
}

function send(message) {
    conn.send(JSON.stringify(message));
}

// const configuration = {
//     'iceServers': [
//         {
//             'urls': 'stun:stun.l.google.com:19302'
//         },
//     ]
// }

function initialize() {
    configuration = null;
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            send({
                event: "candidate",
                data: event.candidate
            });
        }
    };
    dataChannel = peerConnection.createDataChannel("dataChannel", { reliable: true });
    dataChannel.onmessage = function(event) {
        messagesElement.innerHTML += "<p>" + event.data + "</p>";
        console.log("Data channel Message:", event.data);
    }
    dataChannel.onerror = function(error) {
        console.log("Data channel Error:", error);
    }
    dataChannel.onclose = function() {
        console.log("Data channel closed");
    }
    peerConnection.ondatachannel = function (event) {
        dataChannel = event.channel;
    }
}

function createOffer() {
    peerConnection.createOffer(function(offer) {
        send({
            event: "offer",
            data: offer
        });
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        console.log("Error:", error);
    });
}

function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event: "answer",
            data: answer
        });
    }, function(err) {
        console.log("error: ", err);
    });
}

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("Answer received!");
}

function sendMessage() {
    dataChannel.send(inputElement.value);
    inputElement.value = '';
}



const constraints = {
    video: true,
    audio: true,
}
const mobileConstraints = {
    video: {
        frameRate: {
            ideal: 10,
            max: 15
        },
        width: 1280,
        height: 720,
        facingMode: "user"
    }
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        peerConnection.addStream(stream);
        peerConnection.onaddstream = function(event) {
            videoElement.srcObject = event.stream;
        }
    })
    .catch(function (err) {
        console.log("error", err);
    });

