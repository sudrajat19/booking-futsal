import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";

export default function AddKategori() {
  const [newKategori, setNewKategori] = useState({
    tipe_lapangan: '',
    photo: '',
  });
  const [checkAdmin, setCheckAdmin] = useState(null);
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
    formData.append("tipe_lapangan", newKategori.tipe_lapangan);
    formData.append("photo", newKategori.photo);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    try {
      await axios.post("http://localhost:3008/addkategori", formData);
      push("/dataadmin/kategori");
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  };

  const handleCancel = () => {
    push("/dataadmin/kategori");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewKategori((prevKategori) => ({ ...prevKategori, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Layout>
      <div className="p-8 w-full">
        <h2 className="text-xl font-nunito">Pengelolaan GOR</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-2">
            <label htmlFor="tipe_lapangan" className="w-24">
              Tipe Lapangan:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="tipe_lapangan"
              placeholder="Tipe Lapangan"
              type="text"
              name="tipe_lapangan"
              value={newKategori.tipe_lapangan}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="photo" className="w-24">
              photo:
            </label>
            <input
              className="border rounded-lg border-secondary-10 w-full h-8"
              id="photo"
              placeholder="URL photo"
              type="file"
              name="photo"
              onChange={handleFileChange}
              required
            />
          </div>

          {newKategori.photo && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img src={process.env.NEXT_PUBLIC_BASE_API_URL+"/"+newKategori.photo} className="mx-auto" />
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
