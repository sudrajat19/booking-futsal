import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../layout";
import PesanPage from "../../../components/pesanPage";
import Fasilitas from "@/components/fasilitas";
import DetailLapanganSkeleton from "@/atom/skeleton";

export default function DetailLapanganPage() {
  const { query, push } = useRouter();
  const [fasilitas, setFasilitas] = useState([]);
  const [detail, setDetail] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        const [fasilitasRes, detailRes] = await Promise.all([
          axios.get(
            `http://localhost:3008/tampilsemuafasilitas/${query.detail}`
          ),
          axios.get(
            `http://localhost:3008/tampilsemuadetaillapangan/${query.detail}`
          ),
        ]);
        setFasilitas(fasilitasRes.data);
        setDetail(detailRes.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.detail) {
      fetchData();
    }
  }, [query.detail]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Layout>
      <div className="container mx-auto grid bg-white">
        {isLoading ? (
          <DetailLapanganSkeleton />
        ) : (
          <div>
            <section className="w-full py-8 px-[100px] pr-0 mt-8">
              <div className="flex gap-5 mb-4 border-solid overflow-x-scroll">
                {[
                  "/gambar/unsplash_LSOTmGcdaKQ.png",
                  "/gambar/unsplash_LSOTmGcdaKQ.png",
                  "/gambar/unsplash_LSOTmGcdaKQ.png",
                ].map((src, index) => (
                  <img key={index} src={src} alt={`Lapangan ${index + 1}`} />
                ))}
              </div>
              <div className="flex gap-8 justify-center">
                <a href="#">
                  <img
                    src="/gambar/Vector (29).png"
                    className="shadow-card"
                    alt="icon1"
                  />
                </a>
                <a href="#">
                  <img
                    src="/gambar/Vector (28).png"
                    className="shadow-card"
                    alt="icon2"
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
                      src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${dtl.image}`}
                      className="w-full mb-4"
                      alt={dtl.nama_lapangan}
                    />
                    <div>
                      <h2 className="semibold-bs mb-3">{dtl.nama_lapangan}</h2>
                      <ul className="grid gap-5">
                        <li className="normal-sm">Rumput Sintesis</li>
                        <li className="flex gap-2 normal-xs">
                          <img
                            src="/gambar/sports_soccer.png"
                            className="btn-sm"
                            alt="soccer icon"
                          />
                          Indoor
                        </li>
                        <li className="semibold-sm">
                          {formatToRupiah(dtl.harga_perjam)}/Sesi
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
                {selectedId && (
                    <PesanPage selectedId={selectedId} detail={detail} />
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}
