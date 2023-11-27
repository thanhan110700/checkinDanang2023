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
  image_url_base: null,
  image_url: null,
};

const CreateUserModal = ({ modalIsOpen, setIsOpen }) => {
  const [form, setForm] = useState(initState);

  const handleChange = (e) => {
    if (e.target.name === "image_url_base") {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function () {
        setForm({
          ...form,
          image_url_base: reader.result,
        });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
      return;
    }
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

  const convertImage = (e) => {
    if (!form.image_url_base) {
      return;
    }
    setForm({
      ...form,
      image_url: form.image_url_base,
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

          <p className="mb-0 mt-2">Số may mắn </p>
          <input
            className="form-control"
            type="text"
            name="somayman"
            value={form?.somayman}
            onChange={handleChange}
          />

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
          <p className="mb-0 mt-2">Ảnh đại diện </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
            name="image_url_base"
            onClick={(event) => {
              event.target.value = null;
            }}
          />
          <input
            style={{
              display: form.image_url_base ? "inline-block" : "none",
            }}
            type="button"
            onClick={convertImage}
            value="Chuyển đổi hình ảnh"
            className="button-convert"
          />
          <div>
            {form.image_url_base && (
              <div
                style={{
                  width: "50%",
                  display: "inline-block",
                }}
              >
                <p className="mb-0 mt-2">Ảnh gốc </p>
                <img
                  src={form.image_url_base}
                  style={{
                    width: "90%",
                    height: "auto",
                    objectFit: "contain",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                  alt=""
                />
              </div>
            )}
            {form.image_url && (
              <div
                style={{
                  width: "50%",
                  display: "inline-block",
                }}
              >
                <p className="mb-0 mt-2">Ảnh hoạt hình </p>
                <img
                  src={form.image_url}
                  style={{
                    width: "90%",
                    height: "auto",
                    objectFit: "contain",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                  alt=""
                />
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
