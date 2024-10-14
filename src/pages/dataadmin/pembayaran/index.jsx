import axios from "axios";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [search, setSearch] = useState("");
  const [pembayarans, setPembayarans] = useState([]);
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
        const url = "http:///localhost:3008/tampilpembayaran";
        const res = await axios.get(url);
        setPembayarans(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetchLapangan();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleEditPembayaran = (pembayaran) => {
    localStorage.setItem("gorToEdit", JSON.stringify(pembayaran));
    push("/dataadmin/pembayaran/settingPembayaran");
  };

  const handleDeletePembayaran = (id_pembayaran) => {
    axios
      .delete(`http://localhost:3008/deletepembayaran/${id_pembayaran}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Ada kesalahan dalam menghapus data:", error);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pembayaranPerPage = 4;
  const filteredPembayaran = pembayarans.filter((pembayaran) =>
    pembayaran.metode_pembayaran.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastPembayaran = currentPage * pembayaranPerPage;
  const indexOfFirstPembayaran = indexOfLastPembayaran - pembayaranPerPage;
  const currentGor = filteredPembayaran.slice(
    indexOfFirstPembayaran,
    indexOfLastPembayaran
  );

  const totalPages = Math.ceil(filteredPembayaran.length / pembayaranPerPage);

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
          <h2 className="text-xl font-bold">Pengelolaan Pembayaran</h2>
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
                onClick={() => push("/dataadmin/pembayaran/settingPembayaran")}
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
                  <th className="p-4 border-b">Metode Pembayaran</th>
                  <th className="p-4 border-b">Barcode</th>
                  <th className="p-4 border-b">No Rekening</th>
                  <th className="p-4 border-b">Nama Rekening</th>
                  <th className="p-4 border-b">Logo</th>
                  <th className="p-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentGor.map((pembayaran, index) => (
                  <tr key={index} className={`hover:bg-gray-100`}>
                    <td className="p-4 border-b">
                      {indexOfFirstPembayaran + index + 1}
                    </td>
                    <td className="p-4 border-b">
                      {pembayaran.metode_pembayaran}
                    </td>
                    <td className="p-4 border-b">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BASE_API_URL +
                          "/" +
                          pembayaran.barcode
                        }
                        alt=""
                      />
                    </td>
                    <td className="p-4 border-b">{pembayaran.no_rekening}</td>
                    <td className="p-4 border-b">{pembayaran.nama_rekening}</td>
                    <td className="p-4 border-b">
                      <img
                        src={
                          process.env.NEXT_PUBLIC_BASE_API_URL +
                          "/" +
                          pembayaran.logo
                        }
                        alt=""
                      />
                    </td>
                    <td className="p-4 border-b flex">
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => handleEditPembayaran(pembayaran)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() =>
                          handleDeletePembayaran(pembayaran.id_pembayaran)
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
              <div className="flex gap-4 w-full border-2 justify-around py-8">
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
