import axios from "axios";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

export default function Transaksi() {
  const [search, setSearch] = useState("");
  const [rincian, setRincian] = useState([]);
  const [idAdmin, setIdAdmin] = useState();
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

  useEffect(() => {}, [rincian]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleDeleteRincian = (id_rincibayar) => {
    axios
      .delete(`http://localhost:3008/deleterincianpembayaran/${id_rincibayar}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Ada kesalahan dalam menghapus data:", error);
      });
  };
  const handleBayar = async (id_rincibayar) => {
    try {
      const response = await axios.get(
        `http://localhost:3008/tampilrincianpembayaran/${id_rincibayar}`
      );

      const existingData = response.data;

      const formData = new FormData();

      Object.keys(existingData).forEach((key) => {
        if (key !== "status_bayar") {
          formData.append(key, existingData[key]);
        }
      });

      formData.append("status_bayar", "done");

      await axios.put(
        `http://localhost:3008/updaterincianpembayaran/${id_rincibayar}`,
        formData
      );

      setRincian((prevRincian) =>
        prevRincian.map((rinci) =>
          rinci.id_rincibayar === id_rincibayar
            ? { ...rinci, status_bayar: "done" }
            : rinci
        )
      );
    } catch (error) {
      console.error("Ada kesalahan dalam memperbarui data:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rincianPerPage = 4;
  const filteredRincian = rincian.filter((rinci) =>
    rinci.nama.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastRinci = currentPage * rincianPerPage;
  const indexOfFirstRinci = indexOfLastRinci - rincianPerPage;
  const currentGor = filteredRincian.slice(indexOfFirstRinci, indexOfLastRinci);

  const totalPages = Math.ceil(filteredRincian.length / rincianPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Layout>
      <main className="p-8 font-nunito md:w-1/2 lg:w-full">
        <h2 className="text-xl font-bold">Pengelolaan Transaksi</h2>
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
        </div>
        <div className="mt-12 rounded-lg ">
          <table className="w-full text-left overflow-x-auto">
            <thead className="bg-secondary-5">
              <tr>
                <th className="p-4 border-b">No</th>
                <th className="p-4 border-b">Nama</th>
                <th className="p-4 border-b">No Telp</th>
                <th className="p-4 border-b">Bukti Transaksi</th>
                <th className="p-4 border-b">Via</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentGor.map((rinci, index) => (
                <tr key={rinci.id_rincibayar} className={`hover:bg-gray-100`}>
                  <td className="p-4 border-b">
                    {indexOfFirstRinci + index + 1}
                  </td>
                  <td className="p-4 border-b">{rinci.nama}</td>
                  <td className="p-4 border-b">{rinci.no_telp}</td>
                  <td className="p-4 border-b">
                    <img
                      src={
                        rinci.bukti_transfer
                          ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${rinci.bukti_transfer}`
                          : "/placeholder-image.png"
                      }
                      alt="Bukti Transfer"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="p-4 border-b capitalize">
                    {rinci.metode_pembayaran}
                  </td>
                  <td className="p-4 border-b text-green-500 capitalize">
                    {rinci.status_bayar}
                  </td>
                  <td className="p-4 flex gap-2">
                    {rinci.status_bayar !== "done" && (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleBayar(rinci.id_rincibayar)}
                      >
                        Bayar
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteRincian(rinci.id_rincibayar)}
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
  );
}
