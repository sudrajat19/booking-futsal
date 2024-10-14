import { useState,useEffect } from "react";
import { useRouter } from "next/router";

export default function Lapangan({ lapangan }) {
  const { push } = useRouter();
  const [lapanganData, setLapanganData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  // const [idUser, setIdUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // setIdUser(token);
    if (!token) {
      push("/");
    }
  }, [push]);


  if (selectedId) {
    push(`/lapangan/${selectedId}`);
  }

  return (
    <>
      <div className="container w-full bg-white mx-auto   mt-[144px] py-8 px-[100px]">
        <h2 className="p-4 normal-lg">GOR yang tersedia</h2>
        <div className="p-4 gap-5 grid sm:grid-cols-2 lg:grid-cols-4 cursor-pointer">
          {lapangan.map((lpn, index) => (
            <div
              key={index}
              onClick={() => setSelectedId(lpn.id_gor)}
              className="shadow-card grid grid-cols-2 gap-4 p-4 rounded-md sm:grid-cols-1"
            >
              <img src={process.env.NEXT_PUBLIC_BASE_API_URL + "/" + lpn.image_gor} alt="lpng" className="w-full" />
              <div>
                <h2 className="normal-bs capitalize">{lpn.nama_gor}</h2>
                <ul>
                  <li className="capitalize">{lpn.kota}</li>
                  <li className="flex gap-1 capitalize">
                    <img
                      src="/gambar/sports_soccer.png"
                      className="w-3 h-3 self-center"
                      alt="asdas"
                    />
                    {lpn.tipe_lapangan}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
