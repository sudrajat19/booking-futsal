import axios from "axios";
import { useState, useEffect } from "react";

export default function Proses({
  setPromoPotongan,
  setJenisPembayaran,
  setMetodePembayaran,
}) {
  const [metod, setmetod] = useState([]);
  const [promo, setPromo] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [selectJenis, setSelectJenis] = useState(null);
  const [selectMetod, setSelectMetod] = useState([]);
  const [selectPromo, setSelectPromo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:3008/tampilpembayaran";
        const urlJenis = "http://localhost:3008/tampiljenispembayaran";
        const urlPromo = "http://localhost:3008/tampilpromo";
        const jenisResponse = await axios.get(urlJenis);
        setJenis(jenisResponse.data);
        const promoResponse = await axios.get(urlPromo);
        setPromo(promoResponse.data);
        const response = await axios.get(url);
        setmetod(response.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };
    fetchData();
  }, []);
  const handlePromo = async (selectPromo) => {
    console.log(selectPromo.potongan_promo);
    setSelectPromo(selectPromo);
    try {
      const response = await axios.get(
        `http://localhost:3008/tampilpromo/${selectPromo}`
      );
      setPromoPotongan(response.data.potongan_promo);
    } catch (error) {
      console.error("Ada kesalahan dalam mengambil data:", error);
    }
  };

  const handleJenis = (selectJenis) => {
    setSelectJenis(selectJenis);
    setJenisPembayaran(selectJenis);
  };

  const handleMetod = (selectMetod) => {
    setSelectMetod(selectMetod);
    setMetodePembayaran(selectMetod);
  };

  return (
    <>
      <div className=" bg-white p-4 rounded-lg shadow-card col-span-2">
        <div>
          <h2 className="semibold-bs">Pembayaran</h2>
          <img src="/gambar/Line 7.png" className="w-full my-4" />
          <div>
            <h2 className="normal-bs">Jenis Pembayaran</h2>
            <div className="mt-2 mb-4 grid gap-4 sm:grid-cols-2">
              {jenis.map((jns, index) => (
                <button
                  key={index}
                  onClick={() => handleJenis(jns.id_jenis)}
                  className={`flex-1 normal-sm border flex gap-4 px-4 p-2 justify-center rounded ${
                    selectJenis === jns.id_jenis
                      ? "bg-primary-50 text-white"
                      : "border-primary-50 text-primary-50"
                  }`}
                >
                  <img src="/gambar/payment1.png" className="self-center" />
                  {jns.jenis_bayar}
                </button>
              ))}
            </div>

            <div>
              <h2 className="normal-bs capitalize">metod Tersedia</h2>
              <div className="mt-2 mb-4 grid gap-2 lg:grid-cols-3">
                {metod.map((mtd, index) => (
                  <button
                    onClick={() => handleMetod(mtd.id_pembayaran)}
                    key={index}
                    className={`text-xs flex gap-2 border  p-2 justify-center rounded  ${
                      selectMetod === mtd.id_pembayaran
                        ? "bg-primary-50 text-white"
                        : "border-primary-50 text-primary-50"
                    }`}
                  >
                    <img src="/gambar/gopay.png" className="self-center" />
                    {mtd.metode_pembayaran}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="normal-bs">Promo Tersedia</h2>
              <div className="mt-2 mb-4 grid gap-2 lg:grid-cols-3">
                {promo.map((prm, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromo(prm.id_promo)}
                    className={`text-xs  flex gap-2 border  p-2 justify-center rounded ${
                      selectPromo === prm.id_promo
                        ? "bg-primary-50 text-white"
                        : "border-primary-50 text-primary-50"
                    }`}
                  >
                    <img
                      src="/gambar/Vector (01).png"
                      className="self-center"
                    />
                    {prm.nama_promo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
