import axios from "axios";
import { useState, useEffect } from "react";
export default function Promo() {
  const [promo, setPromo] = useState([]);
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const url = `http://localhost:3008/tampilpromo`;
        const res = await axios.get(url);
        setPromo(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchPromo();
  }, []);

  return (
    <>
      <div>
        <h2 className="normal-bs">Promo Tersedia</h2>
        <div className="mt-2 mb-4 grid gap-2 lg:grid-cols-3">
          {promo.map((prm, index) => (
            <button key={index} className="text-xs text-primary-50 line border border-primary-50 p-2 justify-center rounded">
              <img src="/gambar/Vector (01).png" className="self-center" />
              {prm.nama_promo}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
