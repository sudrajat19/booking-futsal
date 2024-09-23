import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../layout";
import PesanPage from "../../../components/pesanPage";
import Fasilitas from "@/components/fasilitas";
export default function DetailLapanganPage() {

  const { query, push } = useRouter();
  const [fasilitas, setFasilitas] = useState([]);
  const [detail, setDetail] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      push("/");
    }
  }, [push]);

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        const url = `http://localhost:3008/tampilsemuafasilitas/${query.detail}`;
        const res = await axios.get(url);
        setFasilitas(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchLapangan();
  }, [query.detail]);

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        const urlL = `http://localhost:3008/tampilsemuadetaillapangan/${query.detail}`;
        const resLapangan = await axios.get(urlL);
        setDetail(resLapangan.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchLapangan();
  }, [query.detail]);
  return (
    <>
      <Layout>
        <div className="container mx-auto bg-white">
          <div>
            <section className="w-full py-8 px-[100px] pr-0 mt-8">
              <div className="flex gap-5 mb-4 border-solid overflow-x-scroll">
                <img src="/gambar/unsplash_LSOTmGcdaKQ.png" alt="" />
                <img src="/gambar/unsplash_LSOTmGcdaKQ.png" alt="" />
                <img src="/gambar/unsplash_LSOTmGcdaKQ.png" alt="" />
              </div>
              <div className="flex gap-8 justify-center">
                <a href="#">
                  <img
                    src="/gambar/Vector (29).png"
                    className="shadow-card"
                    alt="asdaw"
                  />
                </a>
                <a href="#">
                  <img
                    src="/gambar/Vector (28).png"
                    className="shadow-card"
                    alt="asdaw"
                  />
                </a>
              </div>
            </section>
            <Fasilitas fasilitas={fasilitas} />
            <section className="py-8 px-[100px]">
              <h2 className="semibold-bs mb-4">Lapangan Tersedia</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {detail.map((dtl, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedId(dtl.id_detail)}
                    className="card gap-4 shadow-card hover:bg-neutral-80 sm:block cursor-pointer"
                  >
                    <img
                      src="/gambar/Rectangle 91 (4).png"
                      className="w-full mb-4"
                    />
                    <div>
                      <h2 className="semibold-bs mb-3">{dtl.nama_lapangan}</h2>
                      <ul className="grid gap-5">
                        <li className="normal-sm">Rumput Sintesis</li>
                        <li className="flex gap-2 normal-xs">
                          <img
                            src="/gambar/sports_soccer.png"
                            className="btn-sm"
                          />
                          Indoor
                        </li>
                        <li className="semibold-sm  ">
                          Rp.{dtl.harga_perjam}/Sesi
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
                {selectedId ? (
                  <PesanPage selectedId={selectedId} detail={detail} />
                ) : (
                  <></>
                )}
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
}
