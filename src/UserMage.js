import { Spin } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminWrappter from "./components/AdminWrappter";
import CoCauGiaiThuongModal from "./components/CoCauGiaiThuongModal";
import CreateUserModal from "./components/CreateUserModalx";
import UpdateUserModal from "./components/UpdateUserModal";
import { db } from "./firebase";
import useDebounce from "./hooks/useDebounce";

const UserMage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchCongTy, setSearchCongTy] = useState("");
  const [selectUser, setSelectedUser] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showCoCauModal, setCoCauModal] = useState(false);
  const [tabs, setTabs] = useState([]);
  const debouncedValue = useDebounce(search, 600);
  const debouncedTenCongTy = useDebounce(searchCongTy, 600);
  const [unit, setUnit] = useState("All");
  const [loading, setLoading] = useState(true);

  const handleModalUpdate = (val) => {
    if (!val) {
      setSelectedUser(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đại biểu này ?")) {
      const usersRef = doc(db, "users", id);
      deleteDoc(usersRef);
    }
  };

  useEffect(() => {
    if (!unit) return;
    const q = query(collection(db, "users"), orderBy("qrcode"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });

      const banUnit = Array.from(new Set(arr.map((e) => e.soban)));
      banUnit.sort((a, b) => Number(a) - Number(b));
      setTabs(banUnit);

      setLoading(false);

      setUsers(
        arr.filter(
          (u) =>
            (unit === "All" ? true : u.soban === unit) &&
            u.nguoidaidien
              .toUpperCase()
              .includes(debouncedValue.toUpperCase()) &&
            u.tencongty.toUpperCase().includes(debouncedTenCongTy.toUpperCase())
        )
      );
    });
    return () => {
      unsubscribe();
    };
  }, [debouncedValue, debouncedTenCongTy, unit]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.3)",
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <ToastContainer />
      <AdminWrappter>
        <div
          className="text-center"
          style={{
            marginTop: "22vh",
          }}
        >
          {/* <img
            style={{
              maxWidth: "35%",
            }}
            src={titleImg}
            alt=""
          /> */}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          <button
            className="btn text-danger btn-warning text-bold me-4"
            onClick={() => setCoCauModal(true)}
          >
            Cơ cấu giải thưởng
          </button>

          <button
            className="btn text-danger btn-warning text-bold"
            onClick={() => setShowModalCreate(true)}
          >
            Thêm mới khách hàng
          </button>
        </div>

        <div
          style={{
            marginTop: "1rem",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              marginBottom: "1vh",
            }}
          >
            {/* <div
              style={{
                maxWidth: "75%",
              }}
            > */}
            <input
              className="form-control form-control-sm"
              placeholder="Tìm kiếm khách hàng ( có dấu )"
              type="text"
              style={{
                maxWidth: "75%",
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              marginBottom: "1vh",
            }}
          >
            <input
              className="form-control form-control-sm"
              placeholder="Tìm kiếm theo tên công ty ( có dấu )"
              type="text"
              style={{
                maxWidth: "75%",
              }}
              value={searchCongTy}
              onChange={(e) => setSearchCongTy(e.target.value)}
            />
            {/* </div> */}
          </div>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              marginBottom: "3vh",
            }}
          >
            <select
              className="form-select form-select-sm"
              value={unit}
              style={{
                maxWidth: "75%",
              }}
              onChange={(e) => {
                setUnit(e.target.value);
              }}
            >
              <option value="All">Chọn số bàn</option>
              {tabs.map((t) => (
                <option value={t} key={t}>
                  Bàn số {t}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              maxHeight: "42.25vh",
              overflowY: "auto",
            }}
          >
            <table className="w-100">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Người đại diện</th>
                  <th scope="col">Số bàn</th>
                  <th scope="col">Số may mắn</th>
                  <th scope="col">Chức vụ</th>
                  <th scope="col">Tên công ty</th>
                  <th scope="col">Số khách đi kèm</th>
                  <th scope="col">Qr code </th>
                  <th scope="col">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {users.map((l, i) => (
                  <tr key={l.id}>
                    <td>{i + 1}</td>
                    <td>{l.nguoidaidien}</td>
                    <td>{l.soban}</td>
                    <td>{l.somayman || ""}</td>
                    <td>{l?.chucvu} </td>
                    <td>{l.tencongty} </td>
                    <td>
                      {Number(l.sokhachdikem) === 0 ? "" : l.sokhachdikem}{" "}
                    </td>
                    <td>{l.qrcode} </td>
                    <td>
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="btn btn-danger me-2 text-white"
                      >
                        Xóa
                      </button>
                      <button
                        className="btn  btn-secondary"
                        onClick={() => setSelectedUser(l)}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminWrappter>
      {/* modal  */}

      <CreateUserModal
        modalIsOpen={showModalCreate}
        setIsOpen={setShowModalCreate}
      />

      <UpdateUserModal
        modalIsOpen={Boolean(selectUser)}
        setIsOpen={handleModalUpdate}
        initForm={selectUser}
      />

      <CoCauGiaiThuongModal
        modalIsOpen={showCoCauModal}
        setIsOpen={setCoCauModal}
      />
    </>
  );
};

export default UserMage;
