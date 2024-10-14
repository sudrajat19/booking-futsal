import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "./layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { push } = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessAdmin");
    if (token) {
      push("/dataadmin/home");
    }
  }, [push]);
  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3008/loginadminuser",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        const { accessAdmin, refreshAdmin } = response.data;
        localStorage.setItem("accessAdmin", accessAdmin);
        localStorage.setItem("refreshAdmin", refreshAdmin);
        push("/dataadmin/home");
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      setMsg("Email atau Password salah");
    }
  };

  return (
    <>
      <Layout>
        <div className="pt-[150px] grid justify-center">
          <div className="w-[518px] p-8 bg-gray shadow-lg border rounded-lg">
            <p className="text-center text-base-semibold text-red-600">{msg}</p>
            <h1 className="desktop-h3 font-nunito font-bold text-center">
              Login
            </h1>
            <div>
              <form onSubmit={Auth} className="font-nunito mb-14">
                <div className="my-4 gap-3 grid ">
                  <label htmlFor="email" className="w-24 font-bold ">
                    Email:
                  </label>
                  <input
                    className="w-full h-[44px] p-4 rounded-md border-2"
                    id="email"
                    type="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4 gap-3 grid">
                  <label htmlFor="password" className="w-24 font-bold ">
                    Kata Sandi:
                  </label>
                  <input
                    className="w-full h-[44px] p-4 rounded-md border-2"
                    id="password"
                    type="password"
                    placeholder="Masukkan Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-secondary-10 w-full rounded-md font-semibold h-[44px]"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
