import { Button } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import moment from "moment";
// import titleImg from "./assets/TenCTr.2.png";
import { useEffect, useState } from "react";
import { db } from "./firebase";

function ListCheckIn() {
  const [listAttend, setListAttend] = useState([]);
  const [total, setTotal] = useState({
    totalJoin: 0,
    total: 0,
  });
  const [listCountUnit, setListCountUnit] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [unit, setUnit] = useState("All");
  const [isJoin, setIsJoin] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "checkIns_test_5"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const arr = querySnapshot.docs.map((d) => d.data());
      // for (let d of querySnapshot.docs) {
      //   await deleteDoc(doc(db, "checkIns_test_5", d.id));
      // }
      const querySnapshot_2 = await getDocs(collection(db, "users"));

      const banUnit = Array.from(
        new Set(querySnapshot_2.docs.map((e) => e.data().soban))
      );
      banUnit.sort((a, b) => Number(a) - Number(b));
      setTabs(banUnit);

      if (!isJoin) {
        const data_user_notcheckin = [];
        querySnapshot_2.forEach((doc) => {
          if (!arr.find((r) => r.qrcode === doc.data().qrcode)) {
            data_user_notcheckin.push(doc.data());
          }
        });

        setListAttend(
          data_user_notcheckin.filter((n) =>
            unit === "All" ? true : n.soban === unit
          )
        );
      }

      if (isJoin) {
        setListAttend(
          arr.filter((n) => (unit === "All" ? true : n.soban === unit))
        );
      }

      const setUnitIds = new Set(arr.map((l) => l.qrcode));
      const setUnitArrayUser = Array.from(setUnitIds).map((id) =>
        arr.find((u) => u.qrcode === id)
      );

      setTotal({
        totalJoin: setUnitArrayUser.reduce((prev, current) => {
          console.log(current);
          if (current.sokhachdikem && !isNaN(current.sokhachdikem)) {
            return prev + 1 + Number(current.sokhachdikem);
          }
          return prev + 1;
        }, 0),
        total: querySnapshot_2.docs.reduce((prev, current) => {
          if (
            current.data().sokhachdikem &&
            !isNaN(current.data().sokhachdikem)
          ) {
            return prev + 1 + Number(current.data().sokhachdikem);
          }
          return prev + 1;
        }, 0),
      });

      const obj = setUnitArrayUser.reduce((prev, current) => {
        return prev[current.soban]
          ? {
              ...prev,
              [current.soban]: current.sokhachdikem
                ? prev[current.soban] + 1 + Number(current.sokhachdikem)
                : prev[current.soban] + 1,
            }
          : {
              ...prev,
              [current.soban]: current.sokhachdikem
                ? Number(current.sokhachdikem) + 1
                : 1,
            };
      }, {});

      const newListCountUnit = [];
      for (let [key, value] of Object.entries(obj)) {
        newListCountUnit.push({
          key,
          value: {
            data: value,
            totalItemsUnit: querySnapshot_2.docs
              .map((d) => d.data())
              .reduce((t, c) => {
                return c.soban === key
                  ? t + 1 + (Number(c.sokhachdikem) || 0)
                  : t;
              }, 0),
          },
        });
      }
      newListCountUnit.sort((a, b) => Number(a.key) - Number(b.key));

      setListCountUnit(newListCountUnit);
    });

    return () => {
      unsubscribe();
    };
  }, [isJoin, unit]);

  return (
    <div
      className={` main-wrapper-thong-ke`}
      style={{
        fontFamily: `"Montserrat", sans-serif`,
      }}
    >
      <div
        className="h-100"
        style={{
          paddingLeft: "10vw",
          paddingRight: "10vw",
          paddingTop: "31.5vh",
        }}
      >
        <div
          className="text-center"
          style={{
            marginBottom: "7.5vh",
          }}
        >
          {/* <img
            src={titleImg}
            alt=""
            style={{
              maxWidth: "45%",
            }}
          /> */}
        </div>
        <div className="d-flex">
          <div
            className="flex-1"
            style={{
              paddingRight: "20px",
            }}
          >
            <div
              className="title-wrapper "
              style={{
                marginBottom: 0,
              }}
            >
              {" "}
              <div
                style={{
                  alignItems: "center",
                }}
                className="d-flex"
              >
                <select
                  className="form-select form-select-sm w-100 "
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                  }}
                >
                  <option value="All">Tất cả các bàn</option>

                  {tabs.map((t) => (
                    <option value={t} key={t}>
                      Bàn số {t}
                    </option>
                  ))}
                </select>
                <div className="d-flex ms-2">
                  <Button
                    onClick={() => setIsJoin(true)}
                    type={isJoin ? "primary" : "dashed"}
                    className="me-2"
                  >
                    Đã tham gia
                  </Button>
                  <Button
                    onClick={() => setIsJoin(false)}
                    type={!isJoin ? "primary" : "dashed"}
                  >
                    Chưa tham gia
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="w-100 "
              style={{
                maxHeight: "50.25vh",
                overflowY: "auto",
                marginTop: "3vh",
              }}
            >
              <table
                className="w-100"
                style={{
                  marginBottom: 0,
                  marginTop: 0,
                }}
              >
                <thead>
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Người đại diện</th>
                    <th scope="col">Chức vụ</th>
                    <th scope="col">Công ty</th>
                    <th scope="col">Số khách đi kèm</th>
                    <th scope="col">Đã check in vào thời gian</th>
                  </tr>
                </thead>

                <tbody>
                  {listAttend.map((l, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{l.nguoidaidien}</td>
                      <td>{l.chucvu}</td>
                      <td>{l.tencongty}</td>
                      <td>
                        {Number(l.sokhachdikem) === 0 ? "" : l.sokhachdikem}{" "}
                      </td>
                      <td>
                        {l.checkIn
                          ? moment(l.checkIn).format("DD-MM-YYYY HH:mm")
                          : "Chưa check in"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="statistical">
            <div
              className="d-flex  h-100"
              style={{
                paddingLeft: 20,
                fontSize: 18,
              }}
            >
              <div>
                <div
                  className="title-wrapper"
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {" "}
                  {/* <h2 className="border-text-blue">THỐNG KÊ</h2>{" "} */}
                </div>
                <p
                  style={{
                    marginBottom: 5,
                    background: "red",
                    color: "white",
                    padding: "7px 12px",
                  }}
                >
                  Số lượng đại biểu đã tham gia :
                  <b className="ms-1">
                    {total.totalJoin} / {total.total}
                  </b>
                </p>

                <div className="listCountUnit">
                  {listCountUnit.map((l, i) => (
                    <p
                      key={i}
                      style={{
                        background: "#e8eeef",
                        marginBottom: 3,
                        padding: "10px 12px",
                        textAlign: "center",
                      }}
                    >
                      {"Bàn số "} {l.key} :{" "}
                      <b className="ms-1">
                        {l.value.data} / {l.value.totalItemsUnit}
                      </b>{" "}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListCheckIn;
