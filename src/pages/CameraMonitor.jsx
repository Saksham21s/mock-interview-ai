import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { toast } from 'react-toastify';
import { FaVideo } from 'react-icons/fa';

const CameraMonitor = ({ onCheatingDetected, isInterviewActive }) => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const detectionInterval = useRef(null);
  const streamRef = useRef(null);
  const alertTimeout = useRef(null);

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
      stopCamera();
      if (alertTimeout.current) clearTimeout(alertTimeout.current);
    };
  }, []);

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
      if (streamRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 250, height: 180, facingMode: "user" },
        audio: false
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
      
      videoRef.current.onloadedmetadata = () => {
        startFaceDetection();
      };

    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Camera access required for interview");
      onCheatingDetected("CAMERA_BLOCKED");
      setIsCameraOn(false);
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
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOn(false);
    setCurrentAlert(null);
  };

  const startFaceDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    
    detectionInterval.current = setInterval(async () => {
      if (!model || !videoRef.current || !isCameraOn) return;

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

        setCurrentAlert(null);

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
    showAlert("NO_FACE", "Please position your face in camera view");
  };

  const handleMultipleFaces = () => {
    showAlert("MULTIPLE_FACES", "Only one person should be visible");
  };

  const handleUnclearFace = () => {
    showAlert("FACE_UNCLR", "Please position your face clearly");
  };

  const showAlert = (type, message) => {
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    
    setCurrentAlert({ type, message });
    toast.warning(message, { autoClose: 3000 });
    onCheatingDetected(type);
    
    alertTimeout.current = setTimeout(() => {
      setCurrentAlert(null);
    }, 5000);
  };

  return (
    <div className="camera-fixed-container">
    <div className="camera-header">
      <FaVideo className="camera-icon" />
      <span>Live Proctoring</span>
    </div>
    
    <div className="camera-view">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          display: isCameraOn ? "block" : "none",
          width: window.innerWidth < 600 ? "200px" : "275px",
          height: window.innerWidth < 600 ? "140px" : "180px",
          borderRadius: "10px"
        }}
      />
      
      {currentAlert && (
        <div className={`face-alert ${currentAlert.type.toLowerCase()}`}>
          {currentAlert.message}
        </div>
      )}
      
      {!isCameraOn && (
        <div className="camera-off-placeholder">
          {isInterviewActive ? "Starting camera..." : "Camera monitoring is off"}
        </div>
      )}
    </div>
  </div>
  );
};

export default CameraMonitor;