import Layout from "@/pages/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
export default function Bayar() {
  const { push } = useRouter();
  const [rincian, setRincian] = useState([]);
  const [jenisP, setJenisP] = useState();
  const [promoP, setPromoP] = useState();
  const [metodeP, setMetodeP] = useState();
  const [users, setUsers] = useState();
  const [idUser, setIdUser] = useState();
  const [rincianPembayaran, setRincianPembayaran] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const fetchMetode = async () => {
      const idUsers = localStorage.getItem("accessToken");
      if (!idUsers) return; 
      const userId = jwtDecode(idUsers);
      setIdUser(userId.id);
      console.log(userId.id);
      
      try {
        const resRincianPembayaran = await axios.get(
          `http://localhost:3008/tampilrincianpembayaranbystatusnotpayyet/${userId.id}`
        );
        setRincianPembayaran(resRincianPembayaran.data);
        console.log(resRincianPembayaran.data);
  
        if (resRincianPembayaran.data.length >= 0) {
          const url = `http://localhost:3008/tampilpesananbynotpayyet/${userId.id}/${resRincianPembayaran.data[0].id_rincibayar}`;
          const res = await axios.get(url);
          setRincian(res.data);
  
          const responseMetode = await axios.get(
            `http://localhost:3008/tampilpembayaran/${resRincianPembayaran.data[0].id_pembayaran}`
          );
          setMetodeP(responseMetode.data);
  
          const responsePromo = await axios.get(
            `http://localhost:3008/tampilpromobypromo/${resRincianPembayaran.data[0].id_promo}`
          );
          setPromoP(responsePromo.data);
  
          const responseJenis = await axios.get(
            `http://localhost:3008/tampiljenispembayaran/${resRincianPembayaran.data[0].id_jenis}`
          );
          setJenisP(responseJenis.data);
        }
  
        const responseUsers = await axios.get(
          `http://localhost:3008/tampilpesananbyusers/${userId.id}`
        );
        setUsers(responseUsers.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
  
    fetchMetode();
  }, [idUser]); 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!selectedFile) {
      alert("Silakan unggah bukti transfer.");
      return;
    }
    if (rincianPembayaran.length > 0) {
      const id_rincibayar = rincianPembayaran[0].id_rincibayar;
      console.log(rincianPembayaran[0].id_rincibayar);
      formData.append("bukti_transfer", selectedFile);
      formData.append("id_jenis", rincianPembayaran[0].id_jenis);
      formData.append("id_pembayaran", rincianPembayaran[0].id_pembayaran);
      formData.append("id_promo", rincianPembayaran[0].id_promo);
      formData.append("id_users", idUser);
      formData.append("status_bayar", "belum bayar");
      console.log("Form Data sebelum dikirim:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      try {
        await axios.put(
          `http://localhost:3008/updaterincianpembayaran/${id_rincibayar}`,
          formData
        );
        alert('perubahan selesai')
        push("/history");
      } catch (error) {
        console.error("Error saat mengirim data:", error);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("File terpilih:", file);
  };

  return (
    <>
      <Layout>
        <section className="min-h-screen bg-white">
          <div className="grid gap-1 my-8 shadow-card rounded-xl p-4 sm:max-w-xl mx-auto">
            <h1 className="semibold-bs text-center">
              Scan{" "}
              <span className="uppercase">
                {metodeP ? metodeP.metode_pembayaran : ""}
              </span>{" "}
              Disini
            </h1>
            <img
              src={
                metodeP && metodeP.barcode
                  ? process.env.NEXT_PUBLIC_BASE_API_URL + "/" + metodeP.barcode
                  : ""
              }
              className="mx-auto my-[23px]"
            />
            <p className="text-center normal-sm capitalize">
              Nama Rekening : {metodeP ? metodeP.nama_rekening : ""}
            </p>
            <p className="text-center normal-xs">
              No Rekening: {metodeP ? metodeP.no_rekening : ""}
            </p>
            <div className="flex gap-4 mb-2">
              <label htmlFor="photo" className="w-24">
                Bukti Transfer:
              </label>
              <input
                className="border rounded-lg border-secondary-10 w-full h-8"
                id="photo"
                type="file"
                onChange={handleFileChange}
                required
              />
              <button
                type="submit"
                className="bg-secondary-10 h-[30px] w-[100px] rounded-md"
                onClick={handleSubmit}
              >
                Kirim
              </button>
            </div>
            {selectedFile && (
              <div className="flex gap-4 mb-2">
                <label className="w-24">Preview:</label>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  className="mx-auto"
                  alt="Preview Bukti Transfer"
                  style={{ maxHeight: "100px", maxWidth: "100px" }}
                />
              </div>
            )}
          </div>
          <div className="shadow-card my-4 p-4 rounded-xl sm:max-w-xl mx-auto">
            {rincian && rincian.length > 0 && (
              <h2 className="semibold-lg capitalize">{rincian[0].nama_gor}</h2>
            )}
            <div className="flex gap-5 p-8 justify-between">
              <div className="flex gap-[90px]">
                <ul className="normal-sm">
                  <li className="flex gap-2 mb-2">
                    <img src="/gambar/Vector (20).png" className="btn-md" />
                    4,5
                  </li>
                  <li className="flex gap-2">
                    <img src="/gambar/sports_soccer.png" className="btn-md" />
                    {rincian && rincian.length > 0 && (
                      <p className="capitalize">{rincian[0].tipe_lapangan}</p>
                    )}
                  </li>
                </ul>
                <ul className="normal-sm">
                  <li className="flex gap-2 mb-2">
                    <img src="/gambar/Vector1.png" className="btn-md" />
                    {rincian && rincian.length > 0 && (
                      <p className="capitalize">{rincian[0].kota}</p>
                    )}
                  </li>
                </ul>
              </div>
              <img src="/gambar/Vector (12).png" />
            </div>
            <img src="/gambar/Line 7.png" className="w-full my-4" />
            <div className="grid gap-2">
              {rincian && rincian.length > 0 && (
                <h2 className="capitalize">{rincian[0].nama_lapangan}</h2>
              )}
              {rincian && rincian.length > 0 && (
                <p className="capitalize">{rincian[0].tanggal}</p>
              )}
              <div className="flex flex-wrap justify-between gap-8 sm:justify-start">
                {rincian &&
                  rincian.map((rnc, index) => (
                    <div
                      key={index}
                      className="bg-neutral-10 rounded py-2 px-3 text-neutral-50"
                    >
                      <p>
                        {rnc.jam_mulai}-{rnc.jam_akhir}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <img src="/gambar/Line 7.png" className="w-full my-4" />
            <h2 className="semibold-sm">Rincian Pembayaran</h2>
            <div className="flex sm:max-w-xl">
              <div className="flex gap-2 p-4 pl-0 normal-sm">
                <img
                  src={
                    metodeP && metodeP.logo
                      ? process.env.NEXT_PUBLIC_BASE_API_URL +
                        "/" +
                        metodeP.logo
                      : ""
                  }
                />
                <p className="uppercase">
                  {metodeP ? metodeP.metode_pembayaran : ""}
                </p>
              </div>
              <div className="flex gap-2 p-4 normal-sm">
                <img src="/gambar/dollar.png" className="btn-sm" />
                {jenisP && <p className="capitalize">{jenisP.jenis_bayar}</p>}
              </div>
            </div>
            {jenisP && jenisP.id_jenis == 1 ? (
              <p className="normal-sm text-error-70">
                Lakukan Pelunasan{" "}
                {rincian && rincian.length > 0 && (
                  <span>Rp.{rincian.length * rincian[0].harga_perjam}</span>
                )}
              </p>
            ) : (
              <p className="normal-sm text-error-70">
                Bayar DP{" "}
                {rincian && rincian.length > 0 && (
                  <span>
                    Rp.{(rincian.length * rincian[0].harga_perjam) / 2}{" "}
                  </span>
                )}
                Lakukan Pelunasan Ditempat Sebesar{" "}
                {rincian && rincian.length > 0 && (
                  <span>
                    Rp.{(rincian.length * rincian[0].harga_perjam) / 2}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="p-4 normal-sm mb-8 shadow-card rounded-xl grid gap-2 sm:max-w-xl mx-auto">
            <h2 className="semibold-sm">Data Pemesanan</h2>
            <img src="/gambar/Line 7.png" className="w-full" />
            {users && users.length > 0 && (
              <p className="capitalize">{users[0].nama}</p>
            )}
            {users && users.length > 0 && <p>{users[0].email}</p>}
            {users && users.length > 0 && (
              <p className="capitalize">{users[0].no_telp}</p>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
