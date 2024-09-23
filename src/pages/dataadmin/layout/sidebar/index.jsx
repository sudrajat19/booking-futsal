import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Sidebar() {
  const { push } = useRouter();
  const [active, setActive] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessAdmin");
    setActive(token);
  }, []);
  const links = [
    { to: "/dataadmin/pengunjung", text: "Pengunjung" },
    { to: "/dataadmin/home", text: "Detail Gor " },
    { to: "/dataadmin/transaksi", text: "Laporan Transaksi" },
    { to: "/admin/projectAdmin", text: "Project" },
    { to: "/admin/skillAdmin", text: "Skill" },
    { to: "/dataadmin/kasir", text: "Kelola Kasir" },
  ];
  return (
    <>
      {active ? (
        <div className="w-[243px] h-screen border-r-gray-50 shadow-lg py-8 px-6 gap-8">
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
