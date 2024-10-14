import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";

export default function AddPembayaran() {
  const [newPembayaran, setNewPembayaran] = useState({
    metode_pembayaran: "",
    no_rekening: "",
    nama_rekening: "",
  });
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [idAdmin, setIdAdmin] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileLogo, setSelectedFileLogo] = useState(null);
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

  useEffect(() => {
    const gorToEdit = localStorage.getItem("gorToEdit");
    if (gorToEdit) {
      const parsedPembayaran = JSON.parse(gorToEdit);
      setNewPembayaran(parsedPembayaran);
      localStorage.removeItem("gorToEdit");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedFile);
    console.log(selectedFileLogo);

    if (!selectedFile || !selectedFileLogo) {
      console.error("File barcode dan logo harus diisi");
      return;
    }

    const formData = new FormData();
    formData.append("metode_pembayaran", newPembayaran.metode_pembayaran);
    formData.append("no_rekening", newPembayaran.no_rekening);
    formData.append("nama_rekening", newPembayaran.nama_rekening);

    formData.append("barcode", selectedFile);
    formData.append("logo", selectedFileLogo);

    console.log("Form Data sebelum dikirim:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    let updatePembayaran = { ...newPembayaran };
    if (checkAdmin === 1) {
      updatePembayaran = {
        ...updatePembayaran,
        id_pembayaran: idAdmin,
      };
    }

    try {
      if (updatePembayaran.id_pembayaran) {
        await axios.put(
          `http://localhost:3008/updatepembayaran/${updatePembayaran.id_pembayaran}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3008/addpembayaran", formData);
      }
      push("/dataadmin/pembayaran");
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const handleCancel = () => {
    push("/dataadmin/pembayaran");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPembayaran((prevGor) => ({ ...prevGor, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleFileChangeLogo = (e) => {
    setSelectedFileLogo(e.target.files[0]);
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
            <label htmlFor="metode_pembayaran" className="w-24">
              Metode Pembayaran:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="metode_pembayaran"
              placeholder="Metode Pembayaran"
              type="text"
              name="metode_pembayaran"
              value={newPembayaran.metode_pembayaran}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="barcode" className="w-24">
              barcode:
            </label>
            <input
              className="border rounded-lg border-secondary-10 w-full h-8"
              id="barcode"
              placeholder="URL barcode"
              type="file"
              name="barcode"
              onChange={handleFileChange}
              required
            />
          </div>

          {newPembayaran.barcode && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  process.env.NEXT_PUBLIC_BASE_API_URL +
                  "/" +
                  newPembayaran.barcode
                }
                className="mx-auto"
              />
            </div>
          )}

          <div className="flex gap-4 mb-2">
            <label htmlFor="no_rekening" className="w-24">
              No Rekening:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="no_rekening"
              placeholder="No Rekening"
              type="text"
              name="no_rekening"
              value={newPembayaran.no_rekening}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4 mb-2">
            <label htmlFor="nama_rekening" className="w-24">
              Nama Rekening:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="nama_rekening"
              placeholder="Nama Rekening"
              type="text"
              name="nama_rekening"
              value={newPembayaran.nama_rekening}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="logo" className="w-24">
              logo:
            </label>
            <input
              className="border rounded-lg border-secondary-10 w-full h-8"
              id="logo"
              placeholder="URL logo"
              type="file"
              name="logo"
              onChange={handleFileChangeLogo}
              required
            />
          </div>

          {newPembayaran.logo && (
            <div className="flex gap-4 mb-2">
              <label className="w-24">Preview:</label>
              <img
                src={
                  process.env.NEXT_PUBLIC_BASE_API_URL +
                  "/" +
                  newPembayaran.logo
                }
                className="mx-auto"
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
