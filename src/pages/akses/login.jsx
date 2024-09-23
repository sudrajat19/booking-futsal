import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const { push } = useRouter(); 
  const [login, setLogin] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
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
    setLogin({ ...login, [name]: value });
  };

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3008/login", login); 
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        push("/booking"); 
      } else {
        setMsg(response.data.message); 
      }
    } catch (error) {
      console.error("Error saat login:", error);
      setMsg("Email atau Password salah");
    }
  };

  return (
    <>
      <form
        onSubmit={Auth}
        className="w-full max-w-[296px] md:max-w-[418px] lg:max-w-[398px] bg-white shadow-lg rounded-lg p-8 mx-auto mt-8"
      >
        <p className="text-center bold text-red-500 my-1">{msg}</p>
        <h1 className="text-center mobile-h4">Masuk</h1>
        <label htmlFor="email" className="normal-sm">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange} 
          className="input-border"
          placeholder="Masukkan Email"
          value={login.email}
          required
        />
        <label htmlFor="password" className="normal-sm">
          Password
        </label>
        <div className="input-border flex">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={handleChange} 
            className="outline-none border-none w-full"
            placeholder="*********"
            value={login.password}
            required
          />
          <img
            src="/gambar/Vector.png"
            onClick={toggleShowPassword}
            className="w-4 h-4 self-center m-2 cursor-pointer"
            alt="toggle visibility"
          />
        </div>
        <button type="submit" className="btn-blue my-8">
          Masuk
        </button>
        <p className="text-center normal-xs">
          Belum Punya Akun?
          <Link href="/akses/register" className="text-primary-50">
            Daftar
          </Link>
        </p>
      </form>
    </>
  );
}
