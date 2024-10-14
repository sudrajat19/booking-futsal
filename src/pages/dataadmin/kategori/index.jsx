import axios from "axios";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Kategori() {
  const [search, setSearch] = useState("");
  const [kategories, setKategories] = useState([]);
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
        const url = "http:///localhost:3008/tampilkategori";
        const res = await axios.get(url);
        setKategories(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetchLapangan();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDeleteKategori = (id_kategori) => {
    axios
      .delete(`http://localhost:3008/deletekategori/${id_kategori}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Ada kesalahan dalam menghapus data:", error);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const kategoriesPerPage = 4;
  const filteredKategori = kategories.filter((kategori) =>
    kategori.tipe_lapangan.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLasKategori = currentPage * kategoriesPerPage;
  const indexOfFirstKategori = indexOfLasKategori - kategoriesPerPage;
  const currentKategori = filteredKategori.slice(
    indexOfFirstKategori,
    indexOfLasKategori
  );

  const totalPages = Math.ceil(filteredKategori.length / kategoriesPerPage);

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
          <h2 className="text-xl font-bold">Pengelolaan Kategori</h2>
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
                onClick={() => push("/dataadmin/kategori/settingKategori")}
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
                  <th className="p-4 border-b">Tipe Lapangan</th>
                  <th className="p-4 border-b">Photo</th>
                  <th className="p-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentKategori.map((kategori, index) => (
                  <tr key={index} className={`hover:bg-gray-100`}>
                    {console.log(kategori)}
                    <td className="p-4 border-b">
                      {indexOfFirstKategori + index + 1}
                    </td>
                    <td className="p-4 border-b">{kategori.tipe_lapangan}</td>
                    <td className="p-4 border-b">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BASE_API_URL +
                          "/" +
                          kategori.photo
                        }
                        alt=""
                      />
                    </td>
                    <td className="p-4 border-b flex">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() =>
                          handleDeleteKategori(kategori.id_kategori)
                        }
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
