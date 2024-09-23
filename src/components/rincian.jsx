import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
export default function RincianPage({
  detailLapangan,
  selectedJam,
  selectTgl,
}) {
  const { push, query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [idUser, setIdUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = jwtDecode(token);
    setIdUser(decoded.id);
    if (!token) {
      push("/");
    }
  }, [push]);

  let total = selectedJam.length * detailLapangan[0].harga_perjam;

  const handlePesan = async (e) => {
    e.preventDefault();

    const hasil = selectedJam.map((jam) => {
      const [jam_mulai, jam_akhir] = jam.split(" - ");
      return { jam_mulai, jam_akhir };
    });

    const data = hasil.map((d) => ({
      ...d,
      tanggal: selectTgl,
      id_detail: detailLapangan[0].id_detail,
      id_gor: detailLapangan[0].id_gor,
      id_users: idUser
    }));
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3008/addalljadwalpesanan",
        data
      );
      if (response.status === 201) {
        alert("Berhasil memesan lapangan.");
        push(`/lapangan/${query.detail}/${idUser}`);
      } else {
        alert("Gagal membuat pesanan, coba lagi.");
      }
    } catch (error) {
      console.error("Error saat memesan lapangan:", error);
      alert("Terjadi kesalahan, coba lagi.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 shadow-card sm:row-start-8 sm:col-span-2 lg:col-start-3 lg:col-end-5 lg:row-start-4 lg:row-end-7">
        <h2 className="semibold-bs">Rincian Pesanan</h2>
        <img src="/gambar/Line 7.png" className="w-full my-5" />
        {detailLapangan.length > 0 && (
          <h2 className="semibold-bs capitalize">
            {detailLapangan[0].nama_gor}
          </h2>
        )}
        <div className="p-4 grid gap-2">
          {detailLapangan.length > 0 && (
            <h3 className="normal-bs capitalize">
              {detailLapangan[0].nama_lapangan}
            </h3>
          )}
          <p className="normal-sm" value={selectTgl}>
            {selectTgl}
          </p>
          {selectedJam.map((jam, index) => (
            <div
              key={index}
              className="flex justify-between bg-neutral-10 rounded py-2 px-3"
            >
              <p>{jam}</p>
              {detailLapangan.length > 0 && (
                <p>{detailLapangan[0].harga_perjam}</p>
              )}
            </div>
          ))}
          <div className="flex justify-between rounded">
            <p className="normal-sm">Durasi {selectedJam.length} Jam</p>
            <p className="normal-sm">Total Rp.{total}</p>
          </div>

          <button
            className="btn-blue h-10 normal-bs"
            onClick={handlePesan}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Pesan"}
          </button>
        </div>
      </div>
    </>
  );
}
