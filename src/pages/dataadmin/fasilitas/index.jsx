import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";

export default function AddFasilitas() {
  const [newFasilitas, setNewFasilitas] = useState({
    nama_fasilitas: "",
    id_gor: "",
    gambar: null,
  });
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [showIdGor, setShowIdGor] = useState([]);
  const [idAdmin, setIdAdmin] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      push("/");
    }
  }, [push]);
  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      setIdAdmin(decoded.id);
      try {
        const resLogin = await axios.get(
          `http://localhost:3008/tampil/${decoded.id}`
        );
        const checkAdmin = resLogin.data.role;
        console.log("ini yang saya cek:", checkAdmin);
        if (checkAdmin == 1) {
          push("/dataadmin");
        } else {
          push("/booking");
        }
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseLokasi = await axios.get(
          `http://localhost:3008/tampillapangan`
        );
        setShowIdGor(responseLokasi.data);
        const responseAdmin = await axios.get(
          `http://localhost:3008/tampiladminuser/${idAdmin}`
        );
        setCheckAdmin(responseAdmin.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    if (idAdmin) {
      fetchData();
    }
  }, [idAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama_fasilitas", newFasilitas.nama_fasilitas);
    formData.append("id_gor", newFasilitas.id_gor);

    if (selectedFile) {
      formData.append("gambar", selectedFile);
    }

    let updateFasilitas = { ...newFasilitas };

    if (checkAdmin === 1) {
      updateFasilitas = {
        ...updateFasilitas,
        id_fasilitas: idAdmin,
      };
    }

    try {
      await axios.post("http://localhost:3008/addfasilitas", formData);
      push("/dataadmin/home");
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  };

  const handleCancel = () => {
    push("/dataadmin/home");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFasilitas((prevFasilitas) => ({ ...prevFasilitas, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Layout>
      <div className="p-8 w-full">
        <h2 className="text-xl font-nunito">Tambah Fasilitas</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          {checkAdmin === 1 && (
            <div className="flex gap-4 mb-2">
              <label htmlFor="id_fasilitas" className="w-24">
                ID Admin:
              </label>
              <input
                className="p-2 border rounded-lg border-slate-50 outline-none w-full h-8"
                id="id_fasilitas"
                placeholder="ID Admin"
                type="number"
                name="id_fasilitas"
                value={idAdmin}
                readOnly
              />
            </div>
          )}

          <div className="flex gap-4 mb-2">
            <label htmlFor="id_gor" className="w-24">
              Id Gor:
            </label>
            <select name="id_gor" id="id_gor" onChange={handleChange} required>
              <option value="">Pilih gor</option>
              {showIdGor.map((showGor, index) => (
                <option key={index} value={showGor.id_gor}>
                  {showGor.id_gor} - {showGor.nama_gor}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="nama_fasilitas" className="w-24">
              Nama Fasilitas:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="nama_fasilitas"
              placeholder="Nama Fasilitas"
              type="text"
              name="nama_fasilitas"
              value={newFasilitas.nama_fasilitas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="gambar" className="w-24">
              Gambar:
            </label>
            <input
              className="border rounded-lg border-secondary-10 w-full h-8"
              id="gambar"
              placeholder="Upload Gambar"
              type="file"
              name="gambar"
              onChange={handleFileChange}
              required
            />
          </div>

          {selectedFile && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={URL.createObjectURL(selectedFile)}
                className="mx-auto h-40"
                alt="Preview Gambar"
              />
            </div>
          )}

          <div className="flex gap-8 justify-end">
            <button
              type="submit"
              className="bg-secondary-10 p-2 w-[100px] rounded-md"
            >
              Simpan
            </button>
            <button
              type="button"
              className="bg-secondary-10 w-[100px] p-2 rounded-md"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
