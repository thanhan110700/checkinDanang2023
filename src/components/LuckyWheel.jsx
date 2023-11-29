import React, { useRef, useState, useEffect, startTransition, useCallback } from "react";
import LuckyWheelRender from "./LuckyWheelRender";


const LuckyWheel = ({ users, setDataRandom, winner, giai, setIsLoadingRandom }) => {
  const [luckyUser, setLuckyUser] = useState(null);
  const [stopRotation, setStopRotation] = useState(false);
  const [winnerHandled, setWinnerHandled] = useState(false);

  let luckyWheelRender;
  /** @type {React.MutableRefObject<HTMLCanvasElement|null>} */
  const appCanvas = useRef(null);
  //const [cubes, setCubes] = useState([]);
  /** @type {React.MutableRefObject<PlayCanvasState>} */
  const pcStateRef = useRef(new LuckyWheelRender());

  const onAppReady = () => {
    let data = users.map((user, index) => ({
      name: user.nguoidaidien,
      avatarUrl: user.image_url,
      index
    }));
    luckyWheelRender.createWheel(data);

    // TODO: handle when random done
    setTimeout(() => {
      luckyWheelRender.random(data[0], () => {
        console.log("LuckyWheel#onAppReady> random done");
      })
    }, 3000);
  }

  const onClose = () => {
    pcStateRef.current.close();
    setIsLoadingRandom(false)
  }

  useEffect(() => {
    console.log("LuckyWheel#useEffect> init");
    const canvas = appCanvas.current;
    if (!canvas) {
      console.warn("PlayCanvas#useEffect> missing canvas");
      return;
    }
    luckyWheelRender = pcStateRef.current;
    luckyWheelRender.init(canvas, onAppReady);

    return () => {
      console.log("LuckyWheel#useEffect> destroy");
      luckyWheelRender.destroy();
    }
  }, [users]);

  return (
    <div>
      <div>
        <div style={{
          position: "absolute",
          top: "1vh",
          right: "1vh",
          cursor: "pointer",
          fontSize: "2vw",
        }}
          onClick={onClose}>
          X
        </div>
      </div>
      <canvas ref={appCanvas} id="playcanvas-application"></canvas>
    </div>
  );
};

export default LuckyWheel;
