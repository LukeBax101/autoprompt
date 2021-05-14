const video = document.querySelector('video');
let recording = document.getElementById("recording");
let stream = null;
let data = [];
let recorder = null;

const options = {
    mimeType : 'video/webm;codecs=H264'
};

const constraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      },
      facingMode: 'user',
      
    },
    audio: true,
  };

const startStream = async () => {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
}

const startRecording = () => {
    recorder = new MediaRecorder(video.captureStream(), options);
    data = [];
  
    recorder.ondataavailable = (event) => {
        data.push(event.data);
    }
    recorder.start(1000);
  }

const stopRecording = () => {
    let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = event => reject(event.name);
    });
    
    recorder.stop()
    stopped
        .then(() => data)
        .then (recordedChunks => {
            let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });

            var element = document.createElement('a');
            element.setAttribute('href', URL.createObjectURL(recordedBlob));
            element.setAttribute('download', "RecordedVideo.webm");
          
            element.style.display = 'none';
            document.body.appendChild(element);
          
            element.click();
            document.body.removeChild(element);
            console.log("Successfully recorded " + recordedBlob.size + " bytes of " +
                recordedBlob.type + " media.");
        });
  }


export { startStream, startRecording, stopRecording }
