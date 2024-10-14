import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";

export default function AddLokasi() {
  const [newLokasi, setNewLokasi] = useState({
    kota: "",
  });
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [idAdmin, setIdAdmin] = useState(null);
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

    let updateLokasi = { ...newLokasi };

    if (checkAdmin === 1) {
      updateLokasi = {
        ...updateLokasi,
        id_lokasi: idAdmin,
      };
    }

    try {
      await axios.post("http://localhost:3008/addlokasi", updateLokasi);
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
    setNewLokasi((prevLokasi) => ({ ...prevLokasi, [name]: value }));
  };

  return (
    <Layout>
      <div className="p-8 w-full">
        <h2 className="text-xl font-nunito">Tambah Lokasi</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          {checkAdmin === 1 && (
            <div className="flex gap-4 mb-2">
              <label htmlFor="id_lokasi" className="w-24">
                ID Admin:
              </label>
              <input
                className="p-2 border rounded-lg border-slate-50 outline-none w-full h-8"
                id="id_lokasi"
                placeholder="ID Admin"
                type="number"
                name="id_lokasi"
                value={idAdmin}
                readOnly
              />
            </div>
          )}
          <div className="flex gap-4 mb-2">
            <label htmlFor="kota" className="w-24">
              Kota:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="kota"
              placeholder="Kota"
              type="text"
              name="kota"
              value={newLokasi.kota}
              onChange={handleChange}
              required
            />
          </div>

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
