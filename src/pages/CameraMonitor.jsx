import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { toast } from 'react-toastify';

const CameraMonitor = ({ onCheatingDetected, isInterviewActive }) => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [faceAlert, setFaceAlert] = useState(null);
  const detectionInterval = useRef(null);
  const streamRef = useRef(null);

  // Warning counters
  const noFaceCount = useRef(0);
  const multiFaceCount = useRef(0);
  const recentWarnings = useRef([]);

  // Load AI model
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const faceModel = await facemesh.load({
          maxFaces: 2,
          detectionConfidence: 0.8
        });
        if (isMounted) setModel(faceModel);
      } catch (err) {
        console.error("Model loading failed:", err);
        toast.error("Face detection failed to initialize");
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
  }, []);

  // Handle camera start/stop
  useEffect(() => {
    if (isInterviewActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isInterviewActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      videoRef.current.onloadedmetadata = () => {
        startFaceDetection();
      };

    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Camera access required for interview");
      onCheatingDetected("CAMERA_BLOCKED");
    }
  };

  const stopCamera = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setFaceAlert(null);
    noFaceCount.current = 0;
    multiFaceCount.current = 0;
  };

  const startFaceDetection = () => {
    detectionInterval.current = setInterval(async () => {
      if (!model || !videoRef.current) return;

      try {
        const predictions = await model.estimateFaces(videoRef.current);
        
        if (predictions.length === 0) {
          handleNoFace();
          return;
        }
        
        if (predictions.length > 1) {
          handleMultipleFaces();
          return;
        }

        const face = predictions[0];
        if (!isFaceClear(face)) {
          handleUnclearFace();
          return;
        }

        setFaceAlert(null);
        noFaceCount.current = 0;
        multiFaceCount.current = 0;

      } catch (err) {
        console.error("Detection error:", err);
      }
    }, 1000);
  };

  const isFaceClear = (face) => {
    const box = face.boundingBox;
    const width = box.bottomRight[0] - box.topLeft[0];
    const height = box.bottomRight[1] - box.topLeft[1];
    return width > 100 && height > 100;
  };

  const handleNoFace = () => {
    noFaceCount.current++;
    if (noFaceCount.current > 3) {
      triggerWarning("NO_FACE", "Please position your face in camera view");
    }
  };

  const handleMultipleFaces = () => {
    multiFaceCount.current++;
    if (multiFaceCount.current > 2) {
      triggerWarning("MULTIPLE_FACES", "Only one person should be visible");
    }
  };

  const handleUnclearFace = () => {
    noFaceCount.current++;
    if (noFaceCount.current > 3) {
      triggerWarning("FACE_UNCLR", "Please position your face clearly");
    }
  };

  const triggerWarning = (type, message) => {
    if (faceAlert === type) return;
    
    setFaceAlert(type);
    toast.warning(message, { autoClose: 3000 });
    onCheatingDetected(type);
    
    const now = Date.now();
    recentWarnings.current = recentWarnings.current
      .filter(t => now - t < 10000)
      .concat(now);
    
    if (recentWarnings.current.length > 3) {
      onCheatingDetected("EXCESSIVE_WARNINGS");
    }
  };

  return (
    <div className="camera-monitor">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="160"
        height="120"
        style={{ display: isInterviewActive ? "block" : "none" }}
      />
      
      {faceAlert && (
        <div className={`face-alert ${faceAlert.toLowerCase()}`}>
          {{
            'NO_FACE': "⚠️ Please position your face in view",
            'MULTIPLE_FACES': "⚠️ Only one person allowed",
            'FACE_UNCLR': "⚠️ Adjust position for clear view"
          }[faceAlert]}
        </div>
      )}
      
      {!isInterviewActive && (
        <div className="camera-off-placeholder">
          Camera monitoring is off
        </div>
      )}
    </div>
  );
};

export default CameraMonitor;