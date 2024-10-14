import Layout from "../layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function EditProfile() {
  const { push } = useRouter();
  const [idUser, setIdUser] = useState(null);
  const [user, setUser] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    password: "",
    picture: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      setIdUser(decoded.id);
    } else {
      push("/");
    }
  }, [push]);

  useEffect(() => {
    if (idUser) {
      const fetchData = async () => {
        try {
          const url = `http://localhost:3008/tampil/${idUser}`;
          const response = await axios.get(url);
          setUser({
            ...response.data,
            password: "",
            picture: null,
          });
        } catch (error) {
          console.error("Ada kesalahan dalam mengambil data:", error);
        }
      };
      fetchData();
    }
  }, [idUser]);

  const handleBatal = () => {
    push("/profile");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleFileChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, picture: e.target.files[0] }));
  };

  const handleSimpan = async () => {
    try {
      const formData = new FormData();
      formData.append("nama", user.nama);
      formData.append("email", user.email);
      formData.append("no_telp", user.no_telp);
      if (user.password) {
        formData.append("password", user.password);
      }
      if (user.picture) {
        formData.append("picture", user.picture);
      }

      const url = `http://localhost:3008/updateuser/${idUser}`;
      await axios.put(url, formData);
      alert("Profile berhasil diperbarui!");
      push("/profile");
    } catch (error) {
      console.error("Gagal memperbarui profile:", error);
    }
  };

  return (
    <Layout>
      <section className="h-screen">
        <div className="max-w-md mx-auto my-7 p-8 bg-white rounded-lg shadow-card">
          <div className="flex justify-between">
            <h1 className="normal-lg">Edit Profile</h1>
          </div>

          <div className="max-w-[150px] grid gap-2 rounded-lg shadow-card my-4 mx-auto p-4 text-center">
            <img className="mx-auto" alt="belum ada photo" />
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
          </div>

          <div>
            <div className="relative flex gap-3 justify-between border border-primary-50 outline-none rounded p-2">
              <label
                htmlFor="nama"
                className="absolute -top-[6px] left-2 normal-xxxs px-1 bg-white"
              >
                Nama
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={user.nama}
                onChange={handleChange}
                required
                className="outline-none w-full"
              />
            </div>

            <div className="relative flex justify-between border border-primary-50 outline-none rounded p-2 my-6">
              <label
                htmlFor="email"
                className="absolute -top-[6px] left-2 normal-xxxs px-1 bg-white"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                className="outline-none w-full"
              />
            </div>

            <div className="relative flex justify-between border border-primary-50 outline-none rounded p-2 my-6">
              <label
                htmlFor="noTelepon"
                className="absolute -top-[6px] left-2 normal-xxxs px-1 bg-white"
              >
                No Telepon
              </label>
              <input
                type="text"
                id="noTelepon"
                name="noTelepon"
                value={user.no_telp}
                onChange={handleChange}
                required
                className="outline-none w-full"
              />
            </div>

            <div className="relative flex justify-between border border-primary-50 outline-none rounded p-2 my-6">
              <label
                htmlFor="password"
                className="absolute -top-[6px] left-2 normal-xxxs px-1 bg-white"
              >
                Password (optional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                className="outline-none w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-[33px]">
              <button
                onClick={handleBatal}
                className="border justify-center normal-sm flex gap-1 border-primary-50 text-primary-50 p-2 rounded"
              >
                <img src="/gambar/close.png" className="self-center" /> Batal
              </button>
              <button
                onClick={handleSimpan}
                className="border flex gap-1 justify-center normal-sm bg-primary-50 text-white p-2 rounded"
              >
                <img src="/gambar/simpan.png" className="self-center" /> Simpan
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
