import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useRef, useEffect, memo } from "react";
import { db } from "../firebase";

const SPEED = 8;
const TIME_LIMIT = 5000;

const LuckyDrawWheel = ({
  data: userList,
  setDataRandom,
  setIsLoadingRandom,
  setWinner,
  giai,
}) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [userListImages, setUserListImages] = useState([]);

  const initializeUserListImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newImages = [];

    userList.forEach((user) => {
      const img = new Image();
      img.src = user.image_url;
      newImages.push({
        id: user.somayman,
        image: img,
        x: Math.random() * (canvas.width - 60),
        y: Math.random() * (canvas.height - 60),
        speedX: Math.random() * 2 - SPEED,
        speedY: Math.random() * 2 - SPEED,
      });
    });
    setUserListImages(newImages);
    return newImages;
  };

  useEffect(() => {
    if (isSpinning) {
      animate();
    }
  }, [isSpinning]);

  const startLuckyDraw = () => {
    if (!isSpinning) {
      setIsSpinning(true);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Initialize user images
      const userListImgTemp = initializeUserListImages();

      // Set a timeout to stop the animation and select a lucky winner after 2 seconds
      setTimeout(() => {
        stopAnimation(userListImgTemp);
      }, TIME_LIMIT);
    }
  };

  const stopAnimation = (userListImgTemp) => {
    setIsSpinning(false);

    // Select a lucky winner based on id
    const winUser = randomFunc();
    // Clear the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find the corresponding image object
    const winnerImage = userListImgTemp.find(
      (user) => user.id == winUser.somayman
    );
    // Draw the winning image in the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.drawImage(winnerImage.image, centerX - 60, centerY - 60, 60, 60);
    // Zoom in on the winning image
    const initialWidth = 60;
    const initialHeight = 60;
    let zoomFactor = 1.1; // Adjust the initial zoom factor as needed

    const zoomAnimation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const zoomedWidth = initialWidth * zoomFactor;
      const zoomedHeight = initialHeight * zoomFactor;
      const x = centerX - zoomedWidth / 2;
      const y = centerY - zoomedHeight / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);

      // Draw the zoomed image as a circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, zoomedWidth / 2, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(winnerImage.image, x, y, zoomedWidth, zoomedHeight);
      ctx.restore();

      userListImages.forEach((user) => {
        user.x += user.speedX;
        user.y += user.speedY;

        // Bounce off the edges
        if (user.x < 0 || user.x > canvas.width - 60) {
          user.speedX = -user.speedX;
        }

        if (user.y < 0 || user.y > canvas.height - 60) {
          user.speedY = -user.speedY;
        }
        // Draw the circular image with border
        ctx.beginPath();
        ctx.arc(user.x + 30, user.y + 30, 35, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Draw the image as a circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(user.x + 30, user.y + 30, 30, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(user.image, user.x, user.y, 60, 60);
        ctx.restore();
      });

      // Increase the zoom factor
      zoomFactor += 0.01;
      if (zoomFactor <= 7) {
        requestAnimationFrame(zoomAnimation);
      } else {
        // Display a congratulatory message after zooming in

        setDataRandom(
          userList.filter((d) => {
            return d.qrcode !== winUser.qrcode;
          })
        );
        setWinner((w) => ({
          ...winUser,
          tengiaithuong: giai?.name,
          quanlity: giai?.quanlity,
        }));
        // const prizeRef = doc(db, "dstrunggiai", uuidv4());
        // setDoc(prizeRef, {
        //   ...winUser,
        //   tengiaithuong: giai?.name,
        //   idGiaiThuong: uuidv4(),
        //   quanlity: giai?.quanlity,
        // });
        setIsLoadingRandom(false);
      }
    };

    // Start the zoom animation
    zoomAnimation();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    userListImages.forEach((user) => {
      user.x += user.speedX;
      user.y += user.speedY;

      // Bounce off the edges
      if (user.x < 0 || user.x > canvas.width - 60) {
        user.speedX = -user.speedX;
      }

      if (user.y < 0 || user.y > canvas.height - 60) {
        user.speedY = -user.speedY;
      }
      // Draw the circular image with border
      ctx.beginPath();
      ctx.arc(user.x + 30, user.y + 30, 35, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      // Draw the image as a circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(user.x + 30, user.y + 30, 30, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(user.image, user.x, user.y, 60, 60);
      ctx.restore();
    });

    // Repeat the animation
    if (isSpinning) {
      requestAnimationFrame(animate);
    }
  };

  const randomFunc = () => {
    console.log(Math.floor(Math.random() * userList.length));
    return userList[Math.floor(Math.random() * userList.length)];
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        height={window.innerHeight * 0.7}
        width={window.innerWidth * 0.8}
        style={{
          border: "none",
          borderRadius: "50%",
          background: "url('./logo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <button
        style={{
          backgroundColor: "#fff000",
          borderRadius: "12px",
          color: "#000",
          cursor: "pointer",
          fontWeight: "bold",
          padding: "10px 15px",
          transition: "200ms",
          boxSizing: "border-box",
          border: 0,
          fontSize: "16px",
          userSelect: "none",
          touchAction: "manipulation",
        }}
        onClick={startLuckyDraw}
      >
        Bắt đầu quay số
      </button>
    </div>
  );
};

export default memo(LuckyDrawWheel);
