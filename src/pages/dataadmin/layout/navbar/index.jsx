import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsOpen(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsOpen(false);
    push("/");
  };

  return (
    <nav className="h-[96px] flex justify-between px-6 py-3 border-b-gray-50 shadow-md fixed w-full bg-slate-50">
      <div>
        <h1 className="font-pacifico desktop-h3 text-[#FAD810]">Halaman Admin</h1>
      </div>
      <div>
        <div className="navbar pr-[112px]">
          <div
            className={`hamburger-menu ${isMenuOpen ? "change" : ""}`}
            onClick={handleToggleMenu}
          >
            <div className="flex items-center text-[#FAD810] p-2 w-[150px]">
              <h2 className="mr-2">Data Master</h2>
              <img
                src="/gambar/vector (8).png"
                alt="User Icon"
                className="w-[30px]"
              />
            </div>

            {isMenuOpen && (
              <div className="rounded  bg-gray-400 w-[150px] mt-2 p-2">
                <Link href="/" className="block hover:underline">
                  Data User
                </Link>
                {isOpen ? (
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-500 mb-2"
                  >
                    Logout
                  </button>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
