import Layout from "@/pages/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Bayar() {
  const [gorId, setGorId] = useState();
  const [jenis, setJenis] = useState();
  const [metode, setMetode] = useState();
  const [metodeP, setMetodeP] = useState();
  useEffect(() => {
    const jenisPembayaran = localStorage.getItem("jenisPembayaran");
    const metodePembayaran = localStorage.getItem("metodePembayaran");
    const idGor = localStorage.getItem("idGor");
    setJenis(jenisPembayaran);
    setMetode(metodePembayaran);
    setGorId(idGor);
  }, []);
  useEffect(() => {
    const fetchMetode = async () => {
      if (!metode) return;
      try {
        const responseMetode = await axios.get(
          `http://localhost:3008/tampilpembayaran/${metode}`
        );
        setMetodeP(responseMetode.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetchMetode();
  }, [metode]);
  return (
    <>
      <Layout>
        <section className="h-screen mb-[20rem] bg-white">
          <div className="grid gap-1 my-8 shadow-card rounded-xl p-4 sm:max-w-xl mx-auto">
            <h1 className="semibold-bs text-center">Scan Disini</h1>
            <img src="/gambar/BARCODE.png" className="mx-auto my-[23px]" />
            <p className="text-center normal-sm capitalize">
              {/* Nama Rekening : {metodeP.nama_rekening} */}
            </p>
            <p className="text-center normal-xs">
              {/* No Rekening: {metodeP.no_rekening} */}
            </p>
          </div>
          <div className="shadow-card my-4 p-4 rounded-xl sm:max-w-xl mx-auto">
            <h2 className="semibold-lg">Metro Sport Center</h2>
            <div className="flex gap-5 p-8 justify-between">
              <div className="flex gap-[90px]">
                <ul className="normal-sm">
                  <li className="flex gap-2 mb-2">
                    <img src="/gambar/Vector (20).png" className="btn-md" />
                    4,5
                  </li>
                  <li className="flex gap-2">
                    <img src="/gambar/sports_soccer.png" className="btn-md" />
                    Futsal
                  </li>
                </ul>
                <ul className="normal-sm">
                  <li className="flex gap-2 mb-2">
                    <img src="/gambar/Vector1.png" className="btn-md" />
                    Jakarta Barat
                  </li>
                  <li className="flex gap-2">
                    <img src="/gambar/Vector (1).png" className="btn-md" />
                    Basketball
                  </li>
                </ul>
              </div>
              <img src="/gambar/Vector (12).png" />
            </div>
            <img src="/gambar/Line 7.png" className="w-full my-4" />
            <div className="grid gap-2">
              <h2 className="semibold-sm">Mini Soccer Lapang Sintesis 2</h2>
              <p className="normal-sm">Sabtu, 18 Februari 2023</p>
              <div className="flex justify-between gap-8 sm:justify-start">
                <div className="bg-neutral-10 rounded py-2 px-3 text-neutral-50">
                  17:00-18:00
                </div>
                <div className="bg-neutral-10 rounded py-2 px-3 text-neutral-50">
                  18:00-19:00
                </div>
                <div className="bg-neutral-10 rounded py-2 px-3 text-neutral-50">
                  20:00-21:00
                </div>
              </div>
            </div>
            <img src="/gambar/Line 7.png" className="w-full my-4" />
            <h2 className="semibold-sm">Rincian Pembayaran</h2>
            <div className="flex sm:max-w-xl">
              <div className="flex gap-2 p-4 pl-0 normal-sm">
                <img src="/gambar/payment.png" />
                <p>Gopay</p>
              </div>
              <div className="flex gap-2 p-4 normal-sm">
                <img src="/gambar/dollar.png" className="btn-sm" />
                <p>DP 50% Rp 250.000</p>
              </div>
            </div>
            <p className="normal-sm text-error-70">
              Lakukan Pelunasan Ditempat Sebesar Rp 250.000
            </p>
          </div>
          <div className="p-4 normal-sm mb-8 shadow-card rounded-xl grid gap-2 sm:max-w-xl mx-auto">
            <h2 className="semibold-sm">Data Pemesanan</h2>
            <img src="/gambar/Line 7.png" className="w-full" />
            <p>Harry Edward Styles</p>
            <p>Harryedwardstyles@gmail.com</p>
            <p>+62 812 1122 3455</p>
          </div>
        </section>
      </Layout>
    </>
  );
}
