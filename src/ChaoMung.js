import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import ChaoMungComponent from "./components/ChaoMungComponent";
import { db } from "./firebase";

function ChaoMung() {
  const [userCurrent, setUserCurrent] = useState(null);
  const [listAttend, setListAttend] = useState([]);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(1);

  // console.log(userCurrent);
  // console.log(listAttend);

  useEffect(() => {
    if (count > 5) {
      if (index === listAttend.length - 1) {
        setIndex(0);
        setUserCurrent(listAttend[index]);
        setCount(1);
      } else {
        setIndex((i) => i + 1);
        setUserCurrent(listAttend[index]);
        setCount(1);
      }
    } else {
      setTimeout(() => {
        setCount((c) => c + 1);
      }, 1000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    const q = query(collection(db, "checkIns_test_5"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      setListAttend(querySnapshot.docs.map((d) => d.data()));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={` chaomung-wrapper position-relative`}>
      <div className="h-100 d-flex align-items-center">
        <div
          className="w-100  d-flex justify-content-center align-items-center"
          style={{
            marginBottom: "4vh",
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{
              width: "100%",
              objectFit: "fill",
              justifyContent: "center",
              borderRadius: "1rem",
              overflow: "hidden",
              paddingTop: "37.5vh",
            }}
          >
            <ChaoMungComponent userCurrent={userCurrent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChaoMung;
