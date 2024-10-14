import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout";

export default function Kategori() {
  const { push } = useRouter();
  const [kategori, setKategori] = useState([]);
  const [lapangan, setLapangan] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLapangan, setSelectedLapangan] = useState(null);
  const [token,setToken] = useState("")

  useEffect(() => {
    const tempToken = localStorage.getItem("accessToken")
    setToken(tempToken)
    if (!tempToken) {
      push("/");
    }

    const fetchData = async () => {
      try {
        const url = `http://localhost:3008/tampilkategori`;
        const response = await axios.get(url);
        setKategori(response.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      const fetchLapangan = async () => {
        try {
          const urlL = `http://localhost:3008/tampilsemualapangan/${selectedId}`;
          const resLapangan = await axios.get(urlL);
          setLapangan(resLapangan.data);
        } catch (error) {
          console.error("Ada kesalahan dalam mengambil data:", error);
        }
      };

      fetchLapangan();
    }
  }, [selectedId]);

  const handleSelected = (id_kategori) => {
    setSelectedId(selectedId === id_kategori ? null : id_kategori);
  };
  // console.log("env",);
  const selectedGor = lapangan.filter((lpn) => lpn.id_kategori === selectedId);
  console.log(selectedLapangan);
  if (selectedLapangan) {
    push(`/kategori/${selectedLapangan}`);
  }

  return (
    <>
      <Layout>
        <div className="py-8 px-[100px]">
          <p className="text-white">Kategori Lapangan</p>
          <Olahraga
            onClick={handleSelected}
            selectedId={selectedId}
            kategori={kategori}
          />
        </div>
        {selectedId ? (
          <div className=" bg-white container mx-auto py-8 px-[100px]">
            <h2 className="normal-lg">Kategori </h2>
            <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {selectedGor.map((gor, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedLapangan(gor.id_gor)}
                  className="card shadow-card sm:block mx-auto"
                >
                  <img src="/gambar/Rectangle 91.png" alt="Gor Image" />
                  <div className="ml-4">
                    <h2 className="normal-bs mb-4 capitalize">
                      {gor.nama_gor}
                    </h2>
                    <ul className="grid gap-2">
                      <li className="normal-sm">{gor.kota}</li>
                      <li className="line">
                        <img
                          src="/gambar/sports_soccer.png"
                          className="btn-md normal-xs"
                          alt="Icon"
                        />
                        Futsal
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </Layout>
    </>
  );
}

function Olahraga({ kategori, onClick, selectedId }) {
  return (
    <div className="grid grid-cols-4 gap-4 cursor-pointer">
      {kategori.map((ktr) => (
        <div
          key={ktr.id_kategori}
          className={`bg-white p-4 rounded-lg ${
            selectedId === ktr.id_kategori ? "bg-blue-500" : ""
          }`}
          onClick={() => onClick(ktr.id_kategori)}
        >
          <img src={process.env.NEXT_PUBLIC_BASE_API_URL +"/"+ktr.photo} alt="Kategori" />
          <p className="capitalize text-center">{ktr.tipe_lapangan}</p>
        </div>
      ))}
    </div>
  );
}
