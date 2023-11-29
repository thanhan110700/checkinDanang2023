import { memo, useEffect, useState } from "react";
import QrReader from "react-qr-scanner";
import manhinhcheckin from "../../assets/manhinhcheckin.png";
function Scanner({ onScan }) {
  const [device, setDevice] = useState(null);
  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    await navigator.mediaDevices.enumerateDevices().then((dvs) => {
      const videoinput = dvs.filter((d) => d.kind === "videoinput");
      if (videoinput[0]?.deviceId) {
        setDevice(videoinput[0]);
      }
    });
  };

  const handleScan = (data) => {
    if (!data) return;
    onScan && onScan(data.text);
  };

  const handleError = (err) => {
    console.log(err);
  };

  return (
    <div className="d-flex flex-column w-100 h-100">
      {device && (
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
          <QrReader
            className="scanner"
            constraints={{
              video: { deviceId: device.deviceId },
            }}
            delay={500}
            onError={handleError}
            onScan={handleScan}
            onLoad={() => {
              console.log("loaded");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Scanner;
