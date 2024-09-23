import axios from "axios";
import Layout from "../layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Pengunjung() {
  const [search, setSearch] = useState("");
  const [visits, setVisits] = useState([]);
  const { push } = useRouter();

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const url = "http:///localhost:3008/tampiljadwalpesanan";
        const res = await axios.get(url);
        setVisits(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetchJadwal();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDeleteVisits = (id_jadwal) => {
    axios
      .delete(`http://localhost:3008/deletejadwal/${id_jadwal}`)
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Ada kesalahan dalam menghapus data:", error);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const visitsPerPage = 4;
  const filteredVisit = visits.filter((work) =>
    work.nama_lapangan.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisit = filteredVisit.slice(indexOfFirstVisit, indexOfLastVisit);

  const totalPages = Math.ceil(filteredVisit.length / visitsPerPage);

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
            </div>
          </div>
          <div className="mt-12 rounded-lg ">
            <table className="w-full text-left overflow-x-auto">
              <thead className="bg-secondary-5">
                <tr>
                  <th className="p-4 border-b">No</th>
                  <th className="p-4 border-b">Id user</th>
                  <th className="p-4 border-b">No Telp</th>
                  <th className="p-4 border-b">Jam Mulai</th>
                  <th className="p-4 border-b">Jam Akhir</th>
                  <th className="p-4 border-b">Tanggal</th>
                  <th className="p-4 border-b">Id_gor</th>
                  <th className="p-4 border-b">Id_detail</th>
                  <th className="p-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentVisit.map((work, index) => (
                  <tr key={index} className={`hover:bg-gray-100`}>
                    <td className="p-4 border-b">
                      {indexOfFirstVisit + index + 1}
                    </td>
                    <td className="p-4 border-b">
                      {work.id_users}-{work.nama}
                    </td>
                    <td className="p-4 border-b">
                      {work.no_telp}
                    </td>
                    <td className="p-4 border-b">{work.jam_mulai}</td>
                    <td className="p-4 border-b">{work.jam_akhir}</td>
                    <td className="p-4 border-b">{work.tanggal}</td>
                    <td className="p-4 border-b">
                      {work.id_gor}-{work.nama_gor}
                    </td>
                    <td className="p-4 border-b">
                      {work.id_detail}-{work.nama_lapangan}
                    </td>
                    <td className="p-4 border-b flex">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteVisits(work.id_jadwal)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </div>
        </main>
      </Layout>
    </>
  );
}
