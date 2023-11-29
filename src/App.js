import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";

import Scanner from "./components/scanner";
import { db } from "./firebase";

import chaomung from "./assets/checkin.png";

import soban from "./assets/soban.png";
import CameraCustom from "./components/CameraCustom";
import { MODE_SETTING_CHECK_IN, READY_TIME_DEFAULT } from "./config/constant";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [userCurrent, setUserCurrent] = useState(null);
  const [settingCheckIn, setSettingCheckIn] = useState({
    mode: MODE_SETTING_CHECK_IN.MANUAL,
    readyTime: READY_TIME_DEFAULT,
  });
  const [checking, setChecking] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const prev = useRef("");
  const scan = useCallback(
    async (value) => {
      if (checking) return;
      setChecking(true);
      if (value === prev.current && userCurrent) {
        toast.success(
          `Bạn vừa check in! ${
            +settingCheckIn.mode === MODE_SETTING_CHECK_IN.AUTO
              ? `Chúng tôi sẽ lấy lại hình ảnh của bạn sau ${settingCheckIn.ready_time} giây`
              : "Chúng tôi muốn lấy lại hình ảnh chân dung của bạn, Hãy nhấn vào nút bên dưới để chụp ảnh"
          }`,
          {
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
          }
        );
        setUseCamera(true);
        return;
      }
      prev.current = value;

      const q = query(
        collection(db, "users"),
        where("qrcode", "==", value || "")
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (_doc) => {
        const date = moment().valueOf();
        const dateString = moment(date).format("DD-MM-YYYY").toString();
        setUserCurrent({ ..._doc.data(), checkIn: date });
        const q2 = query(
          collection(db, "checkIns_test_5"),
          where("qrcode", "==", _doc.data().qrcode)
        );
        let checkExist = false;
        // let snapCheckTime;
        for (let snap of (await getDocs(q2)).docs) {
          if (
            dateString ===
            moment(snap.data().checkIn).format("DD-MM-YYYY").toString()
          ) {
            checkExist = true;
          }
        }
        if (!checkExist) {
          await setDoc(doc(db, "checkIns_test_5", _doc.data().qrcode), {
            ..._doc.data(),
            checkIn: date,
          });
          toast.success(
            `Chào mừng bạn! ${
              +settingCheckIn.mode === MODE_SETTING_CHECK_IN.AUTO
                ? `Chúng tôi sẽ lấy lại hình ảnh của bạn sau ${settingCheckIn.ready_time} giây`
                : "Chúng tôi muốn lấy hình ảnh chân dung của bạn, Hãy nhấn vào nút bên dưới để chụp ảnh"
            }`,
            {
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
            }
          );
        } else {
          toast.success(
            `Bạn đã check in trước đó! ${
              +settingCheckIn.mode === MODE_SETTING_CHECK_IN.AUTO
                ? `Chúng tôi sẽ lấy lại hình ảnh của bạn sau ${settingCheckIn.ready_time} giây`
                : "Chúng tôi muốn lấy hình ảnh chân dung của bạn, Hãy nhấn vào nút bên dưới để chụp ảnh"
            }`,
            {
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
            }
          );
        }
        setUseCamera(true);
      });
    },
    [settingCheckIn]
  );

  useEffect(() => {
    const q = query(collection(db, "setting_check_in"));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setSettingCheckIn(doc.data());
      });
    });
  }, []);

  useEffect(() => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          video: true,
        },
        function (localMediaStream) {
          console.log(localMediaStream);
        },
        function (err) {
          alert(
            "The following error occurred when trying to access the camera: " +
              err
          );
        }
      );
    } else {
      alert("Sorry, browser does not support camera access");
    }
  }, []);

  return (
    <div className={` main-wrapper position-relative`}>
      <ToastContainer />
      <div className="h-100 d-flex flex-column">
        <div
          className="w-100  d-flex justify-content-center align-items-center"
          style={{
            marginBottom: "5.5vh",
            marginTop: "28vh",
          }}
        >
          <div
            className="d-flex flex-column"
            style={{
              width: "40%",
            }}
          >
            {useCamera ? (
              <CameraCustom
                settingCheckIn={settingCheckIn}
                useCamera={useCamera}
                setUseCamera={setUseCamera}
                userCurrent={userCurrent}
                setChecking={setChecking}
              />
            ) : (
              <Scanner onScan={scan} />
            )}
          </div>
          <div
            className="d-flex align-items-center"
            style={{
              width: "40%",
              maxHeight: "72vh",
              padding: "1vh 1vw",
              overflow: "auto",
              marginLeft: "5.5vw",
            }}
          >
            <div className="d-flex flex-column align-items-center">
              <h2
                className="font-large text-center text-blue"
                style={{
                  textTransform: "uppercase",
                  marginBottom: "1.15vh",
                  fontSize: "3.5vw",
                  lineHeight: 1.2,
                }}
              >
                {userCurrent?.nguoidaidien || "."}
              </h2>
              <h2
                className="font-large text-center  text-blue"
                style={{
                  textTransform: "uppercase",
                  marginBottom: "1.15vh",
                  fontSize: "2.15vw",
                  lineHeight: 1.2,
                }}
              >
                {userCurrent?.chucvu} {userCurrent?.tencongty || "."}
              </h2>
              <div
                style={{
                  maxWidth: "100%",
                  marginTop: "1vh",
                }}
              >
                <img
                  src={chaomung}
                  style={{
                    width: "100%",
                  }}
                  alt=""
                />
              </div>

              <div
                className=""
                style={{
                  marginTop: "2vh",
                }}
              >
                <div
                  className="m-auto  "
                  style={{
                    maxWidth: "75%",
                    position: "relative",
                  }}
                >
                  <img className="w-100" src={soban} alt="" />
                  <h1
                    style={{
                      position: "absolute",
                      right: "3vw",
                      bottom: 0,
                      top: "40%",
                      transform: "translateY(-50%)",
                      marginBottom: 0,
                      fontWeight: 900,
                      fontSize: "3vw",
                      lineHeight: 1,
                    }}
                  >
                    {userCurrent?.soban || "."}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
