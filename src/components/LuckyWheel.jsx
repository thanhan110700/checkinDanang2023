import React, { useRef, useState, useEffect } from "react";
import LuckyWheelRender from "./LuckyWheelRender";
import { doc, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { uuidv4 } from "@firebase/util";

const LuckyWheel = ({
  users,
  luckyMember,
  setIsLoadingRandom,
  setWinner,
  setDataRandom,
  giai,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  console.log(luckyMember);
  let luckyWheelRender;
  /** @type {React.MutableRefObject<HTMLCanvasElement|null>} */
  const appCanvas = useRef(null);

  /** @type {React.MutableRefObject<PlayCanvasState>} */
  const pcStateRef = useRef(new LuckyWheelRender());
  console.log(users);
  const onAppReady = () => {
    let data = users.map((user, index) => ({
      name: user.nguoidaidien,
      avatarUrl: user.image_url,
      index,
    }));
    luckyWheelRender.createWheel(data);

    // TODO: handle when random done
    setTimeout(() => {
      const winner = {
        name: luckyMember.nguoidaidien,
        avatarUrl: luckyMember.image_url,
      };
      luckyWheelRender.random(winner, () => {
        console.log("LuckyWheel#onAppReady> random done");
        setTimeout(() => {
          setWinner({
            ...luckyMember,
            tengiaithuong: giai?.name,
            quanlity: giai?.quanlity,
          });
          const prizeRef = doc(db, "dstrunggiai", uuidv4());
          setDoc(prizeRef, {
            ...luckyMember,
            tengiaithuong: giai?.name,
            idGiaiThuong: uuidv4(),
            quanlity: giai?.quanlity,
          });
          setIsSpinning(false);
          onClose();
          setDataRandom(
            users.filter((d) => {
              return d.qrcode !== luckyMember.qrcode;
            })
          );
        }, 3000);
      });
    }, 3000);
  };

  const onClose = () => {
    if (isSpinning) return;
    pcStateRef.current.close();
    setIsLoadingRandom(false);
  };

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
    };
  }, [users]);

  return (
    <div>
      <div>
        <div
          style={{
            position: "absolute",
            top: "1vh",
            right: "1vh",
            cursor: "pointer",
            fontSize: "2vw",
          }}
          onClick={onClose}
        >
          X
        </div>
      </div>
      <canvas ref={appCanvas} id="playcanvas-application"></canvas>
    </div>
  );
};

export default LuckyWheel;
