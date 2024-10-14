import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";

export default function AddPromo() {
  const [newPromo, setNewPromo] = useState({
    nama_promo: "",
    potongan_promo: "",
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

  useEffect(() => {
    const promo = localStorage.getItem("promo");
    if (promo) {
      const parsedPromo = JSON.parse(promo);
      setNewPromo(parsedPromo);
      localStorage.removeItem("promo");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatePromo = { ...newPromo };

    console.log("Promo yang akan dikirim: ", updatePromo);

    if (checkAdmin === 1) {
      updatePromo = {
        ...updatePromo,
        id_promo: idAdmin,
      };
    }

    try {
      if (updatePromo.id_promo) {
        await axios.put(
          `http://localhost:3008/updatepromo/${updatePromo.id_promo}`,
          updatePromo
        );
        push("/dataadmin/promo");
      } else {
        await axios.post("http://localhost:3008/addpromo", updatePromo);
        push("/dataadmin/promo");
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  };

  const handleCancel = () => {
    push("/dataadmin/promo");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPromo((prevPromo) => ({ ...prevPromo, [name]: value }));
  };

  return (
    <Layout>
      <div className="p-8 w-full">
        <h2 className="text-xl font-nunito">Pengelolaan Promo</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          {checkAdmin === 1 && (
            <div className="flex gap-4 mb-2">
              <label htmlFor="id_promo" className="w-24">
                ID Admin:
              </label>
              <input
                className="p-2 border rounded-lg border-slate-50 outline-none w-full h-8"
                id="id_promo"
                placeholder="ID Admin"
                type="number"
                name="id_promo"
                value={idAdmin}
                readOnly
              />
            </div>
          )}
          <div className="flex gap-4 mb-2">
            <label htmlFor="nama_promo" className="w-24">
              Nama Promo:
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="nama_promo"
              placeholder="Nama Promo"
              type="text"
              name="nama_promo"
              value={newPromo.nama_promo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="potongan_promo" className="w-24">
              Potongan (%):
            </label>
            <input
              className="p-2 border rounded-lg border-secondary-10 w-full h-8"
              id="potongan_promo"
              placeholder="Potongan"
              type="number"
              name="potongan_promo"
              value={newPromo.potongan_promo}
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
