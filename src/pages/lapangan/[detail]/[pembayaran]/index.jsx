import Proses from "@/components/proses";
import Layout from "../../../layout";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PesanPage from "@/components/pesanPage";
import Fasilitas from "@/components/fasilitas";
export default function Pembayaran() {
  const { push } = useRouter();
  const [rincian, setRincian] = useState([]);
  const [rincianPembayaran, setRincianPembayaran] = useState([]);
  const [fasilitas, setFasilitas] = useState([]);
  const [idUser, setIdUser] = useState(null);
  const [total, setTotal] = useState(null);
  const [add, setAdd] = useState(false);
  const [idGor, setIdGor] = useState(null);
  const [selectId, setSelectId] = useState(null);
  const [promoPotongan, setPromoPotongan] = useState(0);
  const [jenisPembayaran, setJenisPembayaran] = useState();
  const [metodePembayaran, setMetodePembayaran] = useState();
  const [promoP, setPromoP] = useState();
  const resetState = () => {
    setJenisPembayaran("");
    setMetodePembayaran("");
    setPromoPotongan(0);
    setPromoP(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = jwtDecode(token);
    setIdUser(decoded.id);
    if (!token) {
      push("/");
    }
  }, [push]);
  useEffect(() => {
    const fetchData = async () => {
      if (!idUser) return;

      try {
        let responseR = await axios.get(
          `http://localhost:3008/tampilrincianpembayaranbystatus/${idUser}`
        );
        setRincianPembayaran(responseR.data);
        const url = `http://localhost:3008/tampilpesananbytoday/${idUser}/${responseR.data[0].id_rincibayar}`;
        const res = await axios.get(url);
        setRincian(res.data);
        setSelectId(res.data[0].id_detail);

        if (res.data.length > 0) {
          const gorId = res.data[0].id_gor;
          setTotal(res.data.length * res.data[0].harga_perjam);

          const urlFasilitas = `http://localhost:3008/tampilsemuafasilitas/${gorId}`;
          const fasilitasRes = await axios.get(urlFasilitas);
          setFasilitas(fasilitasRes.data);
          setIdGor(fasilitasRes.data[0].id_gor);
        }
        const responsePromo = await axios.get(
          `http://localhost:3008/tampilpromobypromo/${promoPotongan}`
        );
        setPromoP(responsePromo.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchData();
  }, [idUser, promoPotongan]);

  const handleAdd = () => {
    setAdd(!add);
  };

  const handleBayar = async (jenisPembayaran, metodePembayaran) => {
    if (jenisPembayaran && metodePembayaran) {
      const formData = new FormData();
      formData.append("id_jenis", jenisPembayaran);
      formData.append("id_pembayaran", metodePembayaran);
      
      if (promoP && promoP.length > 0) {
        formData.append("id_promo", promoP[0].id_promo);
      }
      
      formData.append("id_users", idUser);
      formData.append("status_bayar", "belum bayar");
      formData.append("bukti_transfer",null); 
  
      formData.forEach((value, key) => {
        console.log(`${key}, ${value}`);
      });
  
      if (rincianPembayaran && rincianPembayaran.length >= 0) {
        const idRinciBayar = rincianPembayaran[0].id_rincibayar;
        console.log("ini yang saya cek", idRinciBayar);
  
        try {
          console.log("Mengirim pembayaran...");
          
          const response = await axios.put(
            `http://localhost:3008/updaterincianpembayaran/${idRinciBayar}`,
            formData
          );
  
          console.log("Response dari server:", response);
  
          if (response.status === 201) {
            resetState();
            push(`/lapangan/${idGor}/${idUser}/bayar`);
          } else {
            console.error("Pembayaran gagal:", response.statusText);
            alert("Pembayaran gagal, silakan coba lagi.");
          }
        } catch (error) {
          console.error("Error saat melakukan pembayaran:", error);
          alert("Terjadi kesalahan saat melakukan pembayaran.");
        }
      } else {
        alert("Data rincian pembayaran tidak ditemukan.");
      }
    } else {
      alert("Pilih pembayaran terlebih dahulu.");
    }
  };
  

  const handleBatal = async (id_jadwal) => {
    if (!id_jadwal) return;
    try {
      const url = `http://localhost:3008/deletejadwalpesanan/${id_jadwal}`;
      await axios.delete(url);

      setRincian((prevRincian) =>
        prevRincian.filter((psn) => psn.id_jadwal !== id_jadwal)
      );
      const updatedTotal = rincian
        .filter((psn) => psn.id_jadwal !== id_jadwal)
        .reduce((acc, psn) => acc + Number(psn.harga_perjam), 0);
      setTotal(updatedTotal);

      console.log(`Pesanan dengan id ${id_jadwal} berhasil dihapus`);
    } catch (error) {
      console.error("Ada kesalahan dalam membatalkan pesanan:", error);
    }
  };


  const totalSetelahPromo = total + 5000 - promoPotongan;

  return (
    <>
      <Layout>
        <div className="grid gap-5 mt-5 md:grid-cols-2 bg-white">
          <div className="col-start-1 col-span-2">
            <Fasilitas fasilitas={fasilitas} />
          </div>
          <div className="py-4 px-8 rounded-lg bg-white shadow-card row-start-2">
            <h2 className="semibold-bs">Rincian Pesanan</h2>
            <img src="/gambar/Line 7.png" className="w-full my-4" />
            {rincian.length > 0 && (
              <p className="normal-bs capitalize">{rincian[0].nama_gor}</p>
            )}
            <div className="p-2 grid gap-2">
              {rincian.length > 0 && (
                <p className="normal-bs capitalize">
                  {rincian[0].nama_lapangan}
                  <span className="normal-sm"> {rincian[0].tanggal}</span>
                </p>
              )}

              {rincian.map((psn, index) => (
                <div
                  key={index}
                  className="flex justify-between normal-sm rounded bg-neutral-10 p-2"
                >
                  <p>
                    {psn.jam_mulai} - {psn.jam_akhir}
                  </p>
                  <p className="flex gap-5">
                    Rp.{psn.harga_perjam}
                    <img
                      className="cursor-pointer"
                      onClick={() => handleBatal(psn.id_jadwal)}
                      src="/gambar/tutup.png"
                      alt=""
                    />
                  </p>
                </div>
              ))}
              <button
                onClick={handleAdd}
                className="border normal-sm border-primary-50 text-primary-50 flex justify-self-end py-1 px-3 rounded"
              >
                <img src="/gambar/Vector10.png" className="self-center mr-3" />
                Tambah
              </button>
            </div>
          </div>
          {add ? (
            <div className="bg-white rounded row-start-2">
              <PesanPage selectedId={selectId} />
            </div>
          ) : (
            <></>
          )}
          <div className="row-start-3">
            <Proses
              setPromoPotongan={setPromoPotongan}
              setJenisPembayaran={setJenisPembayaran}
              setMetodePembayaran={setMetodePembayaran}
            />
          </div>
          {add ? (
            <div className="bg-white py-4 px-8 rounded-lg shadow-card md:col-start-2 md:col-end-3 md:row-start-3">
              <div className="grid gap-4">
                <h2 className="semibold-bs">Rincian Pembayaran</h2>
                <img src="/gambar/Line 7.png" className="w-full" />
                <div className="flex normal-sm justify-between">
                  <p>Biaya Sewa</p>
                  <p>Rp.{total}</p>
                </div>
                <div className="flex normal-sm justify-between">
                  <p>Biaya Layanan</p>
                  <p>Rp 5.000</p>
                </div>
                <div className="flex normal-sm justify-between">
                  <p>Potongan Promo</p>
                  <p>Rp {promoPotongan}</p>
                </div>
                <img src="/gambar/Line 7.png" className="w-full" />
                <div className="flex justify-between semibold-bs">
                  <p>Total Pembayaran</p>
                  <p>Rp {totalSetelahPromo}</p>
                </div>
                <button
                  onClick={() => handleBayar(jenisPembayaran, metodePembayaran)}
                  className="btn-blue flex gap-2"
                >
                  <div className="flex gaap-2 mx-auto">
                    <img src="/gambar/payments.png " />
                    Bayar
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white py-4 px-8 rounded-lg shadow-card md:col-start-2 md:col-end-3 md:row-start-2">
              <div className="grid gap-4">
                <h2 className="semibold-bs">Rincian Pembayaran</h2>
                <img src="/gambar/Line 7.png" className="w-full" />
                <div className="flex normal-sm justify-between">
                  <p>Biaya Sewa</p>
                  <p>Rp {total}</p>
                </div>
                <div className="flex normal-sm justify-between">
                  <p>Biaya Layanan</p>
                  <p>Rp 5.000</p>
                </div>
                <div className="flex normal-sm justify-between">
                  <p>Potongan Promo</p>
                  <p>Rp {promoPotongan}</p>
                </div>
                <img src="/gambar/Line 7.png" className="w-full" />
                <div className="flex justify-between semibold-bs">
                  <p>Total Pembayaran</p>
                  <p>Rp {totalSetelahPromo}</p>
                </div>
                <button
                  onClick={() => handleBayar(jenisPembayaran, metodePembayaran)}
                  className="btn-blue flex gap-2"
                >
                  <div className="flex gap-2 mx-auto">
                    <img src="/gambar/payments.png " />
                    Bayar
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
