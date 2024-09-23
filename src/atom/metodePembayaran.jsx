import axios from "axios";
import { useState, useEffect } from "react";
export default function MetodePembayaran() {
  const [metod, setmetod] = useState([]);
  useEffect(() => {
    const fetchmetod = async () => {
      try {
        const url = `http://localhost:3008/tampilpembayaran`;
        const res = await axios.get(url);
        setmetod(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchmetod();
  }, []);

  return (
    <>
      <div>
        <h2 className="normal-bs capitalize">metod Tersedia</h2>
        <div className="mt-2 mb-4 grid gap-2 lg:grid-cols-3">
          {metod.map((mtd, index) => (
            <button key={index} className="text-xs text-primary-50 line border border-primary-50 p-2 justify-center rounded">
              <img src="/gambar/gopay.png" className="self-center" />
              {mtd.metode_pembayaran}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
