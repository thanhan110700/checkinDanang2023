import { Modal } from "antd";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { MODE_SETTING_CHECK_IN, READY_TIME_DEFAULT } from "../config/constant";

const SettingCheckInModal = ({ modalIsOpen, setIsOpen }) => {
  const [settingCheckIn, setSettingCheckIn] = useState({
    mode: MODE_SETTING_CHECK_IN.AUTO,
    ready_time: READY_TIME_DEFAULT,
  });

  const handleSubmit = async () => {
    try {
      const userRef = doc(db, "setting_check_in", "setting_check_in");
      setDoc(userRef, settingCheckIn, {
        merge: true,
      });
      setIsOpen(false);
      toast.success("Cập nhật thành công !");
    } catch (error) {
      toast.error("Có lỗi xảy ra !");
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "setting_check_in", "setting_check_in"),
      (doc) => {
        setSettingCheckIn(doc.data());
      }
    );
    return () => {
      unsub();
    };
  }, []);

  return (
    <Modal
      title="Thiết lập Check In"
      centered
      open={modalIsOpen}
      onCancel={() => setIsOpen(false)}
      footer={[]}
    >
      <div>
        <div
          className="d-flex align-items-center"
          style={{
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          <div className="d-flex align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="mode"
                id="mode1"
                value={MODE_SETTING_CHECK_IN.AUTO}
                checked={+settingCheckIn.mode === MODE_SETTING_CHECK_IN.AUTO}
                onChange={(e) =>
                  setSettingCheckIn({
                    ...settingCheckIn,
                    mode: e.target.value,
                  })
                }
              />
              <label className="form-check-label" htmlFor="mode1">
                Check In Tự động
              </label>
            </div>
            <div className="form-check" style={{ marginLeft: "2rem" }}>
              <input
                className="form-check-input"
                type="radio"
                name="mode"
                id="mode2"
                value={MODE_SETTING_CHECK_IN.MANUAL}
                checked={+settingCheckIn.mode === MODE_SETTING_CHECK_IN.MANUAL}
                onChange={(e) =>
                  setSettingCheckIn({
                    ...settingCheckIn,
                    mode: e.target.value,
                  })
                }
              />
              <label className="form-check-label" htmlFor="mode2">
                Check In Thủ công
              </label>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {+settingCheckIn.mode === MODE_SETTING_CHECK_IN.AUTO && (
            <div
              className="d-flex"
              style={{
                marginLeft: "2rem",
              }}
            >
              <p className="mb-0 mt-2">Thời gian sẵn sàng </p>
              <input
                className="form-control"
                type="number"
                style={{
                  width: "100px",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                }}
                onChange={(e) =>
                  setSettingCheckIn({
                    ...settingCheckIn,
                    ready_time: e.target.value,
                  })
                }
                required
                name="ready_time"
                value={settingCheckIn?.ready_time}
              />
              <p className="mb-0 mt-2">Giây</p>
            </div>
          )}
        </div>
        <div
          className="d-flex align-items-center"
          style={{
            marginTop: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={handleSubmit} className="btn btn-primary text-white">
            Lưu lại
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(SettingCheckInModal);
