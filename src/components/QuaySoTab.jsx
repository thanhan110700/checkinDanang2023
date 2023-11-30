import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import closeImage from "../assets/close.png";
import congra from "../assets/congra.gif";
import giaithuongL from "../assets/giaithuong.png";
import giaithuongR from "../assets/giaithuong1.png";
import { db } from "../firebase";
import CongratulationOverlay from "./CongratulationOverlay";
import OverlayV2 from "./Overlayv2";
import OverlayWrapper from "./OverlayWrapper";

import "./styles/quayso.css";
import LuckyWheel from "./LuckyWheel";

const QuaySoTab = ({ dsTrungGiai }) => {
  const [listPrize, setListPrize] = useState({});
  const [giaiConLai, setGiaiConLai] = useState({});
  const [dataRadom, setDataRandom] = useState([]);
  const [winner, setWinner] = useState(null);
  const [luckyMember, setLuckyMember] = useState(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [giai, setGiai] = useState("");

  const listPrizeArray = Object.entries(listPrize).sort(
    ([_k1, v1], [_k2, v2]) => Number(v2.quanlity) - Number(v1.quanlity)
  );

  const listPrizeExeptDB = listPrizeArray.filter(([key, value]) => {
    return value.name.toUpperCase() !== "GIẢI ĐẶC BIỆT".toUpperCase();
  });

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "dsgiaithuong", "cocaugiaithuong"),
      (doc) => {
        setListPrize(doc.data());
      }
    );
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "checkIns_test_5"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const arr = querySnapshot.docs.map((d) => d.data());
      // for (let d of querySnapshot.docs) {
      //   await deleteDoc(doc(db, "checkIns_test_5", d.id));
      // }
      let setUnitArr = Array.from(new Set(arr.map((e) => e.qrcode))).map(
        (code) => arr.find((u) => u.qrcode === code)
      );
      let dsTrungGiaiSnap = await getDocs(collection(db, "dstrunggiai"));

      setUnitArr = setUnitArr.filter((u) => {
        return (
          !dsTrungGiaiSnap.docs.find((d) => {
            return (
              d.data().qrcode === u.qrcode
              // ||
              // d.data().tencongty.toUpperCase().trim() ===
              //   u.tencongty.toUpperCase().trim()
            );
          }) &&
          u.somayman &&
          u.somayman !== ""
        );
      });
      setDataRandom(setUnitArr);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleQuayGiai = (key, value) => {
    if (dataRadom.length < 1) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The number of prizes or lucky numbers has been exhausted to conduct the bonus.",
      });
    }
    randomFunc();
    setGiai(value);
    setIsLoadingRandom(true);
  };

  useEffect(() => {
    if (dsTrungGiai?.length > 0) {
      const demDsGiai = dsTrungGiai.reduce((current, value) => {
        if (current[value.tengiaithuong]) {
          current[value.tengiaithuong] = current[value.tengiaithuong] + 1;
        } else {
          current[value.tengiaithuong] = 1;
        }
        return current;
      }, {});
      setGiaiConLai(demDsGiai);
    }
  }, [dsTrungGiai]);

  const randomFunc = () => {
    const random = Math.floor(Math.random() * dataRadom.length);
    setLuckyMember(dataRadom[random]);
  };
  console.log("winner", winner);
  return (
    <div
      className="w-100 "
      style={{
        maxHeight: "90vh",
        overflowY: "auto",
        marginTop: "1vh",
      }}
    >
      <OverlayV2 visiable={isLoadingRandom}>
        <div
          className="w-100 h-100"
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              background: "#fff",
              padding: "1.3vw",
              borderRadius: ".5vw",
              display: "flex",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "5vh",
              height: "90vh",
              width: "90vw",
            }}
          >
            <h2
              className="font-large text-center border-text-white text-orange mx-auto"
              style={{
                textTransform: "uppercase",
                fontSize: "2.25vw",
                lineHeight: 1.35,
                fontWeight: 900,
              }}
            >
              <span className="text-red cyen">ĐANG QUAY {giai.name}</span>
              {dataRadom && isLoadingRandom ? (
                <LuckyWheel
                  users={dataRadom}
                  setDataRandom={setDataRandom}
                  setIsLoadingRandom={setIsLoadingRandom}
                  luckyMember={luckyMember}
                  setWinner={setWinner}
                  giai={giai}
                />
              ) : null}
            </h2>
          </div>
        </div>
      </OverlayV2>

      {winner && (
        <OverlayWrapper>
          <div
            className="w-100 h-100 d-flex"
            style={{
              position: "relative",
            }}
          >
            <CongratulationOverlay>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  className="modal-chuc-mung-giai"
                  style={{
                    minWidth: "30vw",
                    background: "rgba(255,255,255,.9)",
                    borderRadius: 10,
                    padding: "1.5vw 2.5vw",
                    position: "relative",
                    maxWidth: "65vw",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "1vh",
                      top: "1vh",
                      width: "1.5vw",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setWinner(null);
                    }}
                  >
                    <img className="w-100" src={closeImage} alt="" />
                  </div>
                  <h2
                    className="font-large text-center border-text-white text-orange"
                    style={{
                      textTransform: "uppercase",
                      marginBottom: "1.15vh",
                      fontSize: "2.25vw",
                      lineHeight: 1.35,
                      fontWeight: 900,
                    }}
                  >
                    XIN CHÚC MỪNG
                  </h2>
                  <div
                    className="text-center"
                    style={{
                      marginBottom: "2vh",
                    }}
                  >
                    <img
                      style={{
                        maxWidth: "25rem",
                        maxHeight: "25rem",
                        borderRadius: "50%",
                        boxShadow: "rgb(38, 57, 77) 0px 20px 20px -15px",
                      }}
                      src={winner.image_url}
                      alt=""
                    />
                  </div>

                  <h2
                    className="font-large text-center border-text-white text-orange"
                    style={{
                      textTransform: "uppercase",
                      marginBottom: "1.15vh",
                      fontSize: "2.5vw",
                      lineHeight: 1.35,
                      fontWeight: 900,
                    }}
                  >
                    <span className="text-red cyen">
                      {winner?.nguoidaidien || "----------------"}
                    </span>
                  </h2>
                  <h2
                    className="font-large text-center border-text-white text-orange"
                    style={{
                      textTransform: "uppercase",
                      marginBottom: "1.15vh",
                      fontSize: "1.5vw",
                      lineHeight: 1.35,
                      fontWeight: 900,
                      // display : "flex",
                      // justifyContent : "center"
                    }}
                  >
                    <span
                      className="text-red cyen"
                      style={
                        {
                          // maxWidth : "70%"
                        }
                      }
                    >
                      {winner?.tencongty || "----------------"}
                    </span>
                  </h2>
                  <h2
                    className="font-large text-center border-text-white text-orange"
                    style={{
                      textTransform: "uppercase",
                      marginBottom: "1.15vh",
                      fontSize: "2.25vw",
                      lineHeight: 1.35,
                      fontWeight: 900,
                    }}
                  >
                    ĐÃ ĐẠT{" "}
                    <span className="text-red cyen">
                      {winner?.tengiaithuong || "----------------"}
                    </span>
                  </h2>
                </div>
              </div>
            </CongratulationOverlay>
          </div>
        </OverlayWrapper>
      )}
      <div className="h-100 d-flex justify-content-center ">
        {listPrizeArray.length % 2 === 0 && (
          <div
            className="random"
            style={{
              padding: "0 13vw",
            }}
          >
            {listPrizeArray.map(([key, value], index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: "48%",
                    marginBottom: "2vh",
                    position: "relative",
                  }}
                  className="item-quay-so"
                >
                  <img
                    className="w-100"
                    src={index % 2 === 0 ? giaithuongL : giaithuongR}
                    alt=""
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: index % 2 === 0 ? 0 : "none",
                      right: index % 2 !== 0 ? 0 : "none",
                      textAlign: "center",
                      width: "80%",
                    }}
                  >
                    <div className="big">{value.name}</div>
                    <div className="small">
                      Số lượng giải còn lại :{" "}
                      {Number(value.quanlity) - (giaiConLai[value.name] || 0)}
                    </div>
                  </div>
                  <div
                    onClick={() => handleQuayGiai(key, value)}
                    style={{
                      position: "absolute",
                      left: index % 2 !== 0 ? 0 : "none",
                      right: index % 2 === 0 ? 0 : "none",
                      top: 0,
                      width: "20%",
                      height: "100%",
                      cursor: "pointer",
                      pointerEvents:
                        Number(value.quanlity) - (giaiConLai[value.name] || 0) >
                        0
                          ? "auto"
                          : "none",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
        {listPrizeArray.length % 2 !== 0 && (
          <div
            className="random"
            style={{
              padding: 0,
              marginTop: "3vh",
            }}
          >
            <div
              style={{
                width: "31%",
                marginBottom: "2vh",
                position: "relative",
              }}
            >
              {listPrizeExeptDB.slice(0, 3).map(([key, value], index) => {
                return (
                  <div
                    key={index}
                    style={{
                      // width: "31%",
                      marginBottom: "2vh",
                      position: "relative",
                    }}
                    className="item-quay-so"
                  >
                    <img className="w-100" src={giaithuongL} alt="" />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",

                        textAlign: "center",
                        width: "80%",
                      }}
                    >
                      <div
                        className="big"
                        style={{
                          fontSize: "1.6vw",
                        }}
                      >
                        {value.name}
                      </div>
                      <div className="small">
                        Số lượng giải còn lại :{" "}
                        {Number(value.quanlity) - (giaiConLai[value.name] || 0)}
                      </div>
                    </div>
                    <div
                      onClick={() => handleQuayGiai(key, value)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: "20%",
                        height: "100%",
                        cursor: "pointer",
                        pointerEvents:
                          Number(value.quanlity) -
                            (giaiConLai[value.name] || 0) >
                          0
                            ? "auto"
                            : "none",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                width: "31%",
                marginBottom: "2vh",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
              className="item-quay-so"
            >
              {listPrizeArray
                .filter(
                  ([key, value]) =>
                    value.name.toUpperCase() === "GIẢI ĐẶC BIỆT".toUpperCase()
                )
                .map(([key, value], index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        // width: "31%",
                        marginBottom: "2vh",
                        position: "relative",
                      }}
                      className="item-quay-so"
                    >
                      <img className="w-100" src={giaithuongL} alt="" />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",

                          textAlign: "center",
                          width: "80%",
                        }}
                      >
                        <div
                          className="big"
                          style={{
                            fontSize: "1.6vw",
                          }}
                        >
                          {value.name}
                        </div>
                        <div className="small">
                          Số lượng giải còn lại :{" "}
                          {Number(value.quanlity) -
                            (giaiConLai[value.name] || 0)}
                        </div>
                      </div>
                      <div
                        onClick={() => handleQuayGiai(key, value)}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          width: "20%",
                          height: "100%",
                          cursor: "pointer",
                          pointerEvents:
                            Number(value.quanlity) -
                              (giaiConLai[value.name] || 0) >
                            0
                              ? "auto"
                              : "none",
                        }}
                      ></div>
                    </div>
                  );
                })}
            </div>
            <div
              style={{
                width: "31%",
                marginBottom: "2vh",
                position: "relative",
              }}
              className="item-quay-so"
            >
              {listPrizeExeptDB.slice(-3).map(([key, value], index) => {
                return (
                  <div
                    key={index}
                    style={{
                      // width: "31%",
                      marginBottom: "2vh",
                      position: "relative",
                    }}
                    className="item-quay-so"
                  >
                    <img className="w-100" src={giaithuongR} alt="" />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: 0,
                        textAlign: "center",
                        width: "80%",
                      }}
                    >
                      <div
                        className="big"
                        style={{
                          fontSize: "1.6vw",
                        }}
                      >
                        {value.name}
                      </div>
                      <div className="small">
                        Số lượng giải còn lại :{" "}
                        {Number(value.quanlity) - (giaiConLai[value.name] || 0)}
                      </div>
                    </div>
                    <div
                      onClick={() => handleQuayGiai(key, value)}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "20%",
                        height: "100%",
                        cursor: "pointer",
                        pointerEvents:
                          Number(value.quanlity) -
                            (giaiConLai[value.name] || 0) >
                          0
                            ? "auto"
                            : "none",
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuaySoTab;
