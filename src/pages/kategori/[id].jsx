import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DetailPage() {
  const { query,push } = useRouter();
  const [detailLapangan, setDetailLapangan]=useState([]);
  const token = localStorage.getItem("accessToken");
  if (!token) {
    push("/")
  }

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        const url = `http://localhost:3008/tampildetailbygor/${query.id}`;
        const res = await axios.get(url);
        setDetailLapangan(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchLapangan();
  }, []);
  return (
    <>
      <section class="py-8 px-[100px]">
        <h2 class="semibold-bs mb-4">Lapangan Tersedia</h2>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {detailLapangan.map((dtl, index) => (
                  <div
                    key={index}
                    class="card gap-4 shadow-card hover:bg-neutral-80 sm:block"
                  >
                    <img
                      src="/gambar/Rectangle 91 (4).png"
                      class="w-full mb-4"
                    />
                    <div>
                      <h2 class="semibold-bs mb-3">{dtl.nama_lapangan}</h2>
                      <ul class="grid gap-3">
                        <li class="normal-sm">Rumput Sintesis</li>
                        <li class="line normal-xs">
                          <img src="/gambar/sports_soccer.png" class="btn-sm" />
                          Indoor
                        </li>
                        <li class="semibold-sm  ">
                          Rp.{dtl.harga_perjam}/Sesi
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
        </div>
      </section>
    </>
  );
}
