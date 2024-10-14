"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Lapangan from "../lapangan";
import Layout from "../layout";
// import SkeletonLoad from "@/atom/skeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Booking() {
  const { push } = useRouter();
  const [lokasi, setLokasi] = useState([]);
  const [tipe, setTipe] = useState([]);
  const [selectedLokasi, setSelectedLokasi] = useState(null);
  const [selectedTipe, setSelectedTipe] = useState(null);
  const [selectedTgl, setSelectedTgl] = useState(null);
  const [selectedJamMulai, setSelectedJamMulai] = useState(null);
  const [selectedJamAkhir, setSelectedJamAkhir] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lapangan, setLapangan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const lapanganRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      push("/");
    }
  }, [push]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = "http://localhost:3008/tampillokasi";
        const tipeUrl = "http://localhost:3008/tampilkategori";
        const tipeResponse = await axios.get(tipeUrl);
        setTipe(tipeResponse.data);
        const response = await axios.get(url);
        setLokasi(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      selectedJamAkhir !== null &&
      selectedJamMulai !== null &&
      selectedTgl !== null &&
      selectedTipe !== null &&
      selectedLokasi !== null
    ) {
      const fetchLapangan = async () => {
        try {
          const urlL = `http://localhost:3008/tampilsemualapangankosong/${selectedLokasi}/${selectedTipe}/${selectedJamMulai}/${selectedJamAkhir}/${selectedTgl}`;
          const resLapangan = await axios.get(urlL);
          setLapangan(resLapangan.data);
        } catch (error) {
          console.error("Ada kesalahan dalam mengambil data:", error);
        }
      };

      fetchLapangan();
    }
  }, [selectedJamAkhir, selectedJamMulai, selectedTgl]);

  useEffect(() => {
    if (lapangan.length > 0 && lapanganRef.current) {
      console.log("Scrolling to lapangan...");
      lapanganRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lapangan]);

  const handleSelected = (e) => {
    e.preventDefault();
    if (
      selectedLokasi &&
      selectedTipe &&
      selectedJamAkhir &&
      selectedJamMulai &&
      selectedTgl
    ) {
      setIsSubmitted(true);
    } else {
      console.error("Pilih semua field sebelum mencari lapangan.");
    }
  };

  return (
    <Layout>
      <main className=" py-[144px]">
        {isLoading ? (
          <div className='flex justify-center'>
            <Skeleton
              className="w-full max-w-[296px] lg:max-w-[398px] bg-white shadow-sw-frm rounded-[16px] sm:rounded-[8px] p-8 mx-auto mt-8"
              height={500}
              width={398}
            />

            {/* <Skeleton count={3} /> */}
          </div>
        ) : (
          <form
            className="w-full max-w-[296px] lg:max-w-[398px] bg-white shadow-sw-frm rounded-[16px] sm:rounded-[8px] p-8 mx-auto mt-8"
            onSubmit={handleSelected}
          >
            <h1 className="text-center mobile-h4 mb-4">Cari Lapangan</h1>
            <label htmlFor="lokasi" className="normal-lg">
              Lokasi
            </label>
            <div className="input-border p-0 flex">
              <img
                src="/gambar/Vector1.png"
                className="w-3 h-3 self-center m-2"
              />
              <select
                id="lokasi"
                className="outline-none"
                onChange={(e) => setSelectedLokasi(e.target.value)}
              >
                <option>Pilih Lokasi</option>
                {lokasi.map((lks) => (
                  <option key={lks.kota} value={lks.kota}>
                    {lks.kota}
                  </option>
                ))}
              </select>
            </div>
            <label htmlFor="lapangan" className="normal-lg">
              Lapangan
            </label>
            <div className="input-border p-1">
              <select
                id="lapangan"
                className="outline-none"
                onChange={(e) => setSelectedTipe(e.target.value)}
              >
                <option>Pilih Tipe Lapangan</option>
                {tipe.map((tp) => (
                  <option key={tp.tipe_lapangan} value={tp.tipe_lapangan}>
                    {tp.tipe_lapangan}
                  </option>
                ))}
              </select>
            </div>
            <label htmlFor="date" className="normal-lg">
              Tanggal
            </label>
            <input
              type="date"
              id="date"
              className="input-border"
              onChange={(e) => setSelectedTgl(e.target.value)}
            />
            <label htmlFor="time" className="normal-lg">
              Waktu
            </label>
            <div className="flex gap-2">
              <div className="relative w-1/2">
                <p className="absolute normal-xs bg-white left-2">Mulai</p>
                <input
                  type="time"
                  id="time"
                  className="input-border"
                  onChange={(e) => setSelectedJamMulai(e.target.value)}
                />
              </div>
              <div className="relative w-1/2">
                <p className="absolute normal-xs bg-white left-2">Selesai</p>
                <input
                  type="time"
                  id="time"
                  className="input-border"
                  onChange={(e) => setSelectedJamAkhir(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-blue mt-4 normal-bs cursor-pointer"
            >
              Cari
            </button>
          </form>
        )}
        {isSubmitted && lapangan.length > 0 ? (
          <div ref={lapanganRef}>
            <Lapangan lapangan={lapangan} />
          </div>
        ) : (
          <></>
        )}
      </main>
    </Layout>
  );
}
