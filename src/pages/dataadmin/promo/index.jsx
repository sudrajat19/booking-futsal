import axios from "axios";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Promo() {
  const [search, setSearch] = useState("");
  const [promos, setPromos] = useState([]);
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
    const fetchLapangan = async () => {
      try {
        const url = "http:///localhost:3008/tampilpromo";
        const res = await axios.get(url);
        setPromos(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetchLapangan();
  }, []);
  console.log(promos);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleEditPromo = (promo) => {
    localStorage.setItem("promo", JSON.stringify(promo));
    push("/dataadmin/promo/settingPromo");
  };

  const handleDeleteGor = (id_promo) => {
    axios
      .delete(`http://localhost:3008/deletepromo/${id_promo}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Ada kesalahan dalam menghapus data:", error);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const promoPerPage = 4;
  const filteredGor = promos.filter((promo) =>
    promo.nama_promo.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastGor = currentPage * promoPerPage;
  const indexOfFirstGor = indexOfLastGor - promoPerPage;
  const currentGor = filteredGor.slice(indexOfFirstGor, indexOfLastGor);

  const totalPages = Math.ceil(filteredGor.length / promoPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <Layout>
        <main className="p-8 font-nunito md:w-1/2 lg:w-full">
          <h2 className="text-xl font-bold">Pengelolaan Lapangan</h2>
          <div className="flex justify-between mt-9">
            <div className="flex gap-2">
              <input
                className="p-2 border rounded-lg border-secondary-10 w-96 h-8"
                placeholder="Search"
                type="text"
                id="search"
                name="search"
                value={search}
                onChange={handleSearchChange}
              />
              <button className="bg-secondary-10 w-8 h-8 p-2 rounded-lg flex items-center justify-center">
                <img src="/gambar/search.png" alt="search" />
              </button>
            </div>
            <div>
              <button
                className="bg-secondary-10 w-24 h-8 rounded-lg text-base font-nunito"
                onClick={() => push("/dataadmin/promo/settingPromo")}
              >
                Tambah
              </button>
            </div>
          </div>
          <div className="mt-12 rounded-lg ">
            <table className="w-full text-left overflow-x-auto">
              <thead className="bg-secondary-5">
                <tr>
                  <th className="p-4 border-b">No</th>
                  <th className="p-4 border-b">Nama Promo</th>
                  <th className="p-4 border-b">Potongan</th>
                  <th className="p-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentGor.map((promo, index) => (
                  <tr key={index} className={`hover:bg-gray-100`}>
                    {console.log(promo)}
                    <td className="p-4 border-b">
                      {indexOfFirstGor + index + 1}
                    </td>
                    <td className="p-4 border-b">{promo.nama_promo}</td>
                    <td className="p-4 border-b">Rp.{promo.potongan_promo}</td>
                    <td className="p-4 border-b flex">
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => handleEditPromo(promo)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteGor(promo.id_promo)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 ? (
              <div className="flex gap-4 w-full justify-around py-8">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-2 py-1 ${
                        currentPage === index + 1 ? "bg-gray-300" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </main>
      </Layout>
    </>
  );
}
