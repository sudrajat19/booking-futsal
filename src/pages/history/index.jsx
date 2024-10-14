import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout";
import { jwtDecode } from "jwt-decode";
export default function History() {
  const { push } = useRouter();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState();
  const [detailedData, setDetailedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Token = localStorage.getItem("accessToken");

        if (!Token) {
          push("/");
          return;
        }

        const decodedToken = jwtDecode(Token);
        setToken(decodedToken);
        const responseUsers = await axios.get(
          `http://localhost:3008/tampilrincianpembayaranbyusers/${decodedToken.id}`
        );
        setUsers(responseUsers.data);
        const fetchedData = {};
        await Promise.all(
          responseUsers.data.map(async (usr) => {
            const resDetail = await axios.get(
              `http://localhost:3008/tampilpesananbyhistory/${usr.id_rincibayar}`
            );
            fetchedData[usr.id_rincibayar] = resDetail.data;
          })
        );

        setDetailedData(fetchedData);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchData();
  }, [push]);

  // const total = detailedData[usr.id_rincibayar]

  return (
    <>
      <Layout>
        <div className="min-h-screen bg-white">
          <section className="container border-2 py-8 grid grid-cols-2 mx-auto  gap-8 justify-center lg:justify-start">
            {users &&
              users.map((usr, index) => (
                <div
                  key={index}
                  className="shadow-card mb-4 rounded-2xl p-4 sm:my-3 grid gap-4"
                >
                  {detailedData[usr.id_rincibayar] &&
                    detailedData[usr.id_rincibayar].length > 0 && (
                      <div className="grid gap-3">
                        <h2 className="semibold-lg capitalize">
                          {" "}
                          {detailedData[usr.id_rincibayar][0].nama_gor}
                        </h2>
                        <div>
                          <ul className="flex gap-9">
                            <li className="flex gap-1">
                              <img
                                src="/gambar/Vector (20).png"
                                className="btn-md"
                              />
                              4,5
                            </li>
                            <li className="flex capitalize gap-1">
                              <img
                                src="/gambar/Vector1.png"
                                className="btn-md"
                              />
                              {detailedData[usr.id_rincibayar][0].kota}
                            </li>
                          </ul>
                        </div>
                        <h3 className="normal-sm">{}</h3>
                        <p className="normal-xs">
                          {detailedData[usr.id_rincibayar][0].tanggal}
                        </p>
                      </div>
                    )}

                  <div className=" grid grid-cols-4 gap-3">
                    {detailedData[usr.id_rincibayar] &&
                      detailedData[usr.id_rincibayar].map((detail, index) => (
                        <div key={index} className="flex gap-8">
                          <div className="bg-neutral-10 text-neutral-50 rounded-[4px] self-center py-2 px-3 text-ab">
                            <p>
                              {detail.jam_mulai} - {detail.jam_akhir}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {detailedData[usr.id_rincibayar] &&
                    detailedData[usr.id_rincibayar].length > 0 && (
                      <>
                        <h2 className="normal-sm">Rincian Pembayaran</h2>
                        <div className="flex gap-2">
                          <img src="/gambar/payment.png" className="btn-md" />
                          <p className="normal-xs uppercase">
                            {
                              detailedData[usr.id_rincibayar][0]
                                .metode_pembayaran
                            }
                          </p>
                          <img src="/gambar/dollar.png" className="btn-sm" />
                          <p className="normal-xs">
                            {detailedData[usr.id_rincibayar][0].jenis_bayar}
                          </p>
                          {console.log(detailedData[usr.id_rincibayar])}
                        </div>
                        {detailedData[usr.id_rincibayar][0].id_jenis == 1 ? (
                          <h3 className="normal-xs text-error-70">LUNAS</h3>
                        ) : (
                          <h3 className="normal-xs text-error-70">
                            Pelunasan bayar ditempat sebesar Rp{" "}
                            {(detailedData[usr.id_rincibayar].length *
                              detailedData[usr.id_rincibayar][0].harga_perjam -
                              detailedData[usr.id_rincibayar][0]
                                .potongan_promo) /
                              2}
                          </h3>
                        )}
                        <div className="flex gap-8">
                          <button className="w-full normal-xs rounded-[4px] border border-primary-50 text-primary-50 py-2 px-3">
                            Beri Ulasan
                          </button>
                          <button className="bg-primary-50 normal-xs rounded w-full text-white p-3">
                            Booking Lagi
                          </button>
                        </div>
                      </>
                    )}
                </div>
              ))}
          </section>
        </div>
      </Layout>
    </>
  );
}
