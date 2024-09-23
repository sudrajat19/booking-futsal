import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Register() {
  const { push } = useRouter();
  const [register, setRegister] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      push("/booking");
    }
  }, [push]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { ...register };
    try {
      const res = await axios.post(`http://localhost:3008/register/`, newUser);
      if (res.status === 200) {
        alert("Berhasil registrasi.");
        push("/");
      } else {
        alert("Gagal membuat akun, coba lagi.");
        console.log(res);
      }
    } catch (error) {
      console.error("Error saat registrasi:", error);
      alert("Terjadi kesalahan, coba lagi.", error);
    }
  };

  return (
    <>
      <div className="bg-custom bg-cover p-[29px] ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[298px] md:max-w-[418px] lg:max-w-[398px] bg-white shadow-sw-frm rounded-lg p-8 mx-auto mt-6"
        >
          <h1 className="text-center mobile-h4 mb-8">Daftar</h1>
          <label htmlFor="name" className="normal-sm">
            Nama{" "}
          </label>
          <input
            type="text"
            id="name"
            name="nama"
            className="input-border"
            placeholder="Harry Edward Styles"
            onChange={handleChange}
          />
          <label htmlFor="email" className="normal-sm">
            Email{" "}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-border"
            placeholder="Harryedwardstyles@gmail.com"
            onChange={handleChange}
          />
          <label htmlFor="password" className="normal-sm">
            Password
          </label>
          <div className="input-border flex">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              className="outline-none border-none  w-full"
              placeholder="*********"
              onChange={handleChange}
            />
            <img
              src="/gambar/Vector.png"
              onClick={toggleShowPassword}
              className="w-4 h-4 self-center m-2 cursor-pointer"
            />
          </div>
          <label htmlFor="number" className="normal-sm">
            Nomor
          </label>
          <input
            type="number"
            id="number"
            name="no_telp"
            className="input-border"
            placeholder="+62 812 11 22 3344"
            onChange={handleChange}
          />

          <button className="btn-blue">Daftar</button>
          <p className="text-center mt-8 normal-xs">
            Sudah Punya Akun?
            <Link href="/" className="text-primary-50 normal-xs">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
