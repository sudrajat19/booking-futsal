// import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
    <nav>
      <div className=" mx-auto py-8 px-[100px]">
        <div className="flex justify-between w-full">
          <img
            src="/gambar/Union.png"
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          {isOpen ? (
            <>
              {" "}
              <ul className="hidden desktop-h5 sm:flex sm:flex-1 sm:text-white md:items-center sm:justify-evenly">
                <li>
                  <a
                    href="/booking"
                    className="text-primary-50 border-b-4 border-primary-50"
                  >
                    Booking
                  </a>
                </li>
                <li>
                  <Link href="/kategori">Kategori</Link>
                </li>
                <li>
                  <a href="#">History</a>
                </li>
              </ul>
            </>
          ) : (
            <></>
          )}
          <div className="navbar pr-[112px]">
            <div
              className={`hamburger-menu ${isMenuOpen ? "change" : ""}`}
              onClick={handleToggleMenu}
            >
              <div className="flex items-center text-white p-2 w-[150px]">
                <h2 className="mr-2">Data User</h2>
                <img
                  src="/gambar/person2.png"
                  alt="User Icon"
                  className="w-[30px]"
                />
              </div>

              {isMenuOpen && (
                <div className="rounded  bg-gray-400 w-[150px] mt-2 p-2">
                  <Link href="/dataadmin" className="block hover:underline">
                    Data Master
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
      </div>
    </nav>
  );
}
