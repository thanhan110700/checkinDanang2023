import React, { memo } from "react";
import chaomung from "../assets/chaomung.png";
// import "../components/styles/quayso.css";
import soban from "../assets/soban.png";

const ChaoMungComponent = ({ userCurrent }) => {
  return (
    <div className="d-flex flex-column align-items-center">
      {/* <h2
        className="font-large text-center border-text-white text-orange"
        style={{
          textTransform: "uppercase",
          marginBottom: "1.15vh",
          fontSize: "3.5vw",
          lineHeight: 1.35,
        }}
      >
        NHIỆT LIỆT CHÀO MỪNG
      </h2> */}
      <h2
        className="font-large text-center  text-blue"
        style={{
          textTransform: "uppercase",
          marginBottom: "1.15vh",
          fontSize: "2.5vw",
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
          fontSize: "1.75vw",
          lineHeight: 1.2,
        }}
      >
        {userCurrent?.chucvu} {userCurrent?.tencongty || "."}
      </h2>
      <div
        style={{
          maxWidth: "37.5%",
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
            maxWidth: "40%",
            position: "relative",
          }}
        >
          <img className="w-100" src={soban} alt="" />
          <h1
            style={{
              position: "absolute",
              right: "3vw",
              bottom: 0,
              top: "33%",
              transform: "translateY(-50%)",
              marginBottom: 0,
              fontWeight: 900,
              fontSize: "5vw",
            }}
          >
            {userCurrent?.soban}
          </h1>
        </div>
      </div>
      {/* <div
        className="random"
        style={{
          padding: 0,
          justifyContent: "center",
          marginTop: "2vh",
        }}
      >
        <div
          className="ticket"
          style={{
            width: "auto",
          }}
        >
          <div
            className="check"
            style={{
              paddingLeft: "1.25vw",
            }}
          >
            <div className="flex-1">
              <div
                className="big"
                style={{
                  fontSize: "2vw",
                }}
              >
                SỐ BÀN CỦA ĐẠI BIỂU LÀ :{" "}
              </div>
            </div>
            <div
              className="small"
              style={{
                fontSize: "1.5vw",
                textTransform: "none",
              }}
            >
              Table Number Of Delegates :
            </div>
          </div>
          <div
            className="stub"
            style={{
              fontSize: "5vw",
              fontWeight: 900,
              color: "#1b4b90",
              position: "relative",
              left: "-.4vw",
              textAlign: "center",
              paddingRight: "1vw  ",
              minWidth : ""
            }}
          >
            10
          </div>
        </div>
      </div> */}
      {/* <h2
        className="font-large text-center border-text-white text-orange"
        style={{
          textTransform: "uppercase",
          marginBottom: "1.15vh",
          fontSize: "3.5vw",
          lineHeight: 1.35,
        }}
      >
        ĐÃ VỀ THAM DỰ HỘI NGHỊ
      </h2>
      <h2
        className="font-large text-center  text-blue"
        style={{
          textTransform: "uppercase",
          marginBottom: "1.15vh",
          fontSize: "3.5vw",
          lineHeight: 1.35,
        }}
      >
        SỐ BÀN : {userCurrent?.soban || "- - - - - - - -"}
      </h2> */}
    </div>
  );
};

export default memo(ChaoMungComponent);
