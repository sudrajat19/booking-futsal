import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";

export default function AddGor() {
  const [newGor, setNewGor] = useState({});
  const [showIdKategori, setShowIdKategori] = useState([]);
  const [showIdLokasi, setShowIdLokasi] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [idAdmin, setIdAdmin] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessAdmin");
    if (!token) {
      push("/dataadmin");
    } else {
      const decoded = jwtDecode(token);
      setIdAdmin(decoded.id);
    }
  }, [push]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseKategori = await axios.get(
          `http://localhost:3008/tampilkategori`
        );
        setShowIdKategori(responseKategori.data);

        const responseLokasi = await axios.get(
          `http://localhost:3008/tampillokasi`
        );
        setShowIdLokasi(responseLokasi.data);
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

  useEffect(() => {
    const gorToEdit = localStorage.getItem("gorToEdit");
    if (gorToEdit) {
      const parsedGor = JSON.parse(gorToEdit);
      setNewGor(parsedGor);
      localStorage.removeItem("gorToEdit");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_gor", newGor.id_gor);
    formData.append("nama_gor", newGor.nama_gor);
    formData.append("id_lokasi", newGor.id_lokasi);
    formData.append("alamat", newGor.alamat);
    let updateGor = { ...newGor };

    if (checkAdmin === 1) {
      updateGor = {
        ...updateGor,
        id_gor: idAdmin,
      };
    }
    if (newGor.photo) {
      formData.append("photo", newGor.photo);
    } else {
      formData.append("photo", selectedFile);
    }
    console.log(formData);
    try {
      if (updateGor.id_gor) {
        await axios.put(
          `http://localhost:3008/updatelapangan/${updateGor.id_gor}`,
          formData,
        );
        push("/dataadmin/home");
      } else {
        await axios.post("http://localhost:3008/addlapangan", formData);
        push("/dataadmin/home");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  };

  const handleCancel = () => {
    push("/dataadmin/home");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGor({ ...newGor, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Layout>
      <div className="p-8 w-full">
        <h2 className="text-xl font-nunito">Pengelolaan Pekerjaan</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          {checkAdmin === 1 && (
            <div className="flex gap-4 mb-2">
              <label htmlFor="id_kategori" className="w-24">
                ID Users:
              </label>
              <input
                className="p-2 border rounded-lg border-slate-50 outline-none w-full h-8"
                id="id_kategori"
                placeholder="ID Users"
                type="number"
                name="id_kategori"
                value={idAdmin}
                readOnly
              />
            </div>
          )}
          <div className="flex gap-4 mb-2">
            <label htmlFor="id_kategori" className="w-24">
              Id Kategori:
            </label>
            <select
              name="id_kategori"
              id="id_kategori"
              value={newGor.id_kategori || ""}
              onChange={handleChange}
            >
              {showIdKategori.map((showKategori, index) => (
                <option key={index} value={showKategori.id_kategori}>
                  {showKategori.id_kategori} - {showKategori.tipe_lapangan}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="nama_gor" className="w-24">
              Nama Gor:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="nama_gor"
              placeholder="Nama Gor"
              type="text"
              name="nama_gor"
              value={newGor.nama_gor || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="id_lokasi" className="w-24">
              Id Lokasi:
            </label>
            <select
              name="id_lokasi"
              id="id_lokasi"
              value={newGor.id_lokasi || ""}
              onChange={handleChange}
            >
              {showIdLokasi.map((showLokasi, index) => (
                <option key={index} value={showLokasi.id_lokasi}>
                  {showLokasi.id_lokasi} - {showLokasi.kota}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="alamat" className="w-24">
              Alamat:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="alamat"
              placeholder="Alamat"
              type="text"
              name="alamat"
              value={newGor.alamat || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="photo" className="w-24">
              Photo:
            </label>
            <input
              className="border rounded-lg border-secondary-10 w-full h-8"
              id="photo"
              placeholder="URL Photo"
              type="file"
              name="photo"
              onChange={handleFileChange}
              required
            />
          </div>
          {newGor.photo && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img src={newGor.photo} className="mx-auto" />
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
