import { useEffect, useState } from "react";
import manhinhcheckin from "../../assets/manhinhcheckin.png";
import { QrReader } from "react-qr-reader";
function Scanner({ onScan, setChecking }) {
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

  const handleScan = (data, error) => {
    if (!data) return;
    if (error) {
      alert(error);
      return;
    }
    setChecking(true);
    onScan && onScan(data.text);
  };

  const handleError = (err) => {
    console.log(err);
  };

  return (
    <div className="d-flex flex-column ">
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
              zIndex: 2,
            }}
            src={manhinhcheckin}
            alt=""
          />
          <div>
            <QrReader
              className="scanner"
              scanDelay={1000}
              onError={handleError}
              onResult={handleScan}
              onLoad={() => {
                console.log("loaded");
              }}
              videoContainerStyle={{
                paddingTop: "80%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Scanner;
