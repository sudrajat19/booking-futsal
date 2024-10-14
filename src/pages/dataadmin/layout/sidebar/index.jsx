import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Sidebar() {
  const { push } = useRouter();
  const [active, setActive] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setActive(token);
  }, []);
  const links = [
    { to: "/dataadmin/pengunjung", text: "Pengunjung" },
    { to: "/dataadmin/", text: "Detail Gor " },
    { to: "/dataadmin/transaksi", text: "Laporan Transaksi" },
    { to: "/dataadmin/promo", text: "Kelola promo" },
    { to: "/dataadmin/lokasi", text: "Tambah lokasi" },
    { to: "/dataadmin/kategori", text: "Kelola kategori" },
    { to: "/dataadmin/fasilitas", text: "Tambah fasilitas" },
    { to: "/dataadmin/pembayaran", text: "Kelola pembayaran" },
  ];
  return (
    <>
      {active ? (
        <div className="w-[243px] min-h-screen border-r-gray-50 shadow-lg py-8 px-6 gap-8">
          <div className="gap-6 grid font-semibold">
            {links.map((link, index) => (
              <p key={index}>
                <Link href={link.to}>{link.text}</Link>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
