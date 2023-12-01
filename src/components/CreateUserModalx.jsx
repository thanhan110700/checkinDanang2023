import { Modal } from "antd";
import { doc, setDoc } from "firebase/firestore";
import React, { memo, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import "./button/index.css";

const initState = {
  qrcode: "",
  nguoidaidien: "",
  soban: "",
  somayman: "",
  tencongty: "",
  chucvu: "",
  sokhachdikem: 0,
};

const CreateUserModal = ({ modalIsOpen, setIsOpen }) => {
  const [form, setForm] = useState(initState);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    const usersRef = doc(db, "users", uuidv4());
    if (!form.nguoidaidien || form.nguoidaidien === "") {
      form.nguoidaidien = "Người đại diện";
    }
    for (let [key, val] of Object.entries(form)) {
      if (!val || val === "") {
        delete form[key];
      }
    }
    setDoc(usersRef, form);
    setForm(initState);
    toast.success("Thêm mới thành công !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Modal
      title="Tạo khách hàng mới"
      centered
      open={modalIsOpen}
      onCancel={() => setIsOpen(false)}
      footer={[]}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <p className="mb-0 mt-2">Người đại diện </p>
          <input
            className="form-control"
            type="text"
            placeholder="Người đại diện"
            onChange={handleChange}
            name="nguoidaidien"
            value={form?.nguoidaidien}
          />
          <p className="mb-0 mt-2">Số bàn </p>
          <input
            className="form-control"
            type="text"
            required
            onChange={handleChange}
            name="soban"
            value={form?.soban}
          />
          {/* 
          <p className="mb-0 mt-2">Số may mắn </p>
          <input
            className="form-control"
            type="text"
            name="somayman"
            value={form?.somayman}
            onChange={handleChange}
          /> */}

          <p className="mb-0 mt-2">Tên công ty</p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            name="tencongty"
            required
            value={form?.tencongty}
          />

          <p className="mb-0 mt-2">Chức vụ</p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            name="chucvu"
            value={form?.chucvu}
          />

          <p className="mb-0 mt-2">Số khách đi kèm</p>
          <input
            className="form-control"
            type="number"
            onChange={handleChange}
            name="sokhachdikem"
            value={form?.sokhachdikem}
          />

          <p className="mb-0 mt-2">QR code </p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            required
            name="qrcode"
            value={form?.qrcode}
          />
          <div
            className="d-flex align-items-center"
            style={{
              marginTop: "1rem",

              justifyContent: "flex-end",
            }}
          >
            <button type="submit" className="btn btn-primary text-white">
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default memo(CreateUserModal);
