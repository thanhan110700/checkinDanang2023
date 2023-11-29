import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import manhinhcheckin from "../assets/manhinhcheckin.png";
import { API_CONVERT_IMAGE, MODE_SETTING_CHECK_IN } from "../config/constant";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { base64toFile } from "../function";
import { toast } from "react-toastify";
import cameraButton from "../assets/cameraButton.png";

const CameraCustom = ({
  settingCheckIn,
  setUseCamera,
  useCamera,
  userCurrent,
  setChecking,
}) => {
  const { mode, ready_time: readyTime } = settingCheckIn;
  console.log(userCurrent);
  const { qrcode } = userCurrent;
  const isAuto = useMemo(() => +mode === MODE_SETTING_CHECK_IN.AUTO, [mode]);
  const videoRef = useRef(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const startCamera = async () => {
    try {
      const constraints = selectedDeviceId
        ? { video: { deviceId: selectedDeviceId } }
        : { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      if (isAuto && useCamera) {
        setTimeout(() => {
          capture();
        }, readyTime * 1000 + 2000);
      }
    } catch (error) {
      setChecking(false);
      console.error("Lỗi khi truy cập camera");
    }
  };

  const capture = () => {
    // Đoạn mã xử lý khi chụp ảnh
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg");
    const imageFile = base64toFile(
      imageDataUrl,
      `${userCurrent.checkIn}.jpeg`,
      "image/jpeg"
    );

    const formData = new FormData();
    formData.append("file", imageFile);

    fetch(API_CONVERT_IMAGE, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const { error } = data;
        console.log(error);
        if (error) {
          toast.error("Chụp ảnh Thất bại, không nhận diện được khuôn mặt!", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              width: "60vw", // Set the width
              fontSize: "1.15vw",
            },
          });
          return;
        }
        handleUpdateData(data.url);
      })
      .catch((err) => {});
  };

  const handleUpdateData = async (url) => {
    try {
      const usersRef = doc(db, "checkIns_test_5", qrcode);
      setDoc(
        usersRef,
        { ...userCurrent, image_url: url },
        {
          merge: true,
        }
      );
      toast.success("Chụp ảnh thành công!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          width: "60vw", // Set the width
          fontSize: "1.15vw",
        },
      });
      setChecking(false);
      setUseCamera(false);
    } catch (error) {
      setChecking(false);
      console.error("Error updating data:", error);
    }
  };

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setSelectedDeviceId(videoDevices[0].deviceId);
    } catch (error) {
      alert("Lỗi khi Lấy danh sách camera");
    }
  };

  useEffect(() => {
    if (useCamera) {
      getDevices();
      startCamera();
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <img
          style={{
            width: "100%",
            position: "absolute",
          }}
          src={manhinhcheckin}
          alt=""
        />
        <div>
          <video className="scanner" ref={videoRef} autoPlay playsInline />
        </div>
      </div>
      <img
        src={cameraButton}
        style={{
          zIndex: 100,
          display: isAuto ? "none" : "block",
          color: "#fff",
          width: "20%",
          marginTop: "-10vh",
          cursor: "pointer",
        }}
        onClick={capture}
        alt=""
      />
    </>
  );
};

export default memo(CameraCustom);
