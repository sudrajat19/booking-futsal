import Layout from "../layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Profile(){
    const { push } = useRouter();
    const [idUser, setIdUser] = useState();
    const [user, setUser] = useState();
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIdUser(jwtDecode(token));
        if (!token) {
          push("/");
        }
      }, [push]);
      useEffect(() => {
        const fetchData = async () => {
          try {
            const url = `http://localhost:3008/tampil/${idUser.id}`;
            const response = await axios.get(url);
            setUser(response.data);
          } catch (error) {
            console.error("Ada kesalahan dalam mengambil data:", error);
          }
        };
        fetchData();
      }, [idUser]);
      const handleEdit = ()=>{
        push("/profile/editprofile");
      }

      const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        push("/");
      };
    return(
        <>
        <Layout>
        <section className="min-h-screen ">
        <div className="max-w-[608px] mx-auto my-7 p-8 rounded bg-white shadow-card">
          <div className="flex justify-between">
            <h1 className="text-lg">Profile</h1>
            <img src="/gambar/edit.png" className='cursor-pointer' onClick={handleEdit}/>
          </div>

          <div
            className="max-w-[250px] grid gap-4 my-4 rounded-lg shadow-card mx-auto p-8 text-center"
          >
            <img src={user && user.picture} className="mx-auto" alt='picture' />
          </div>
          <div>
            <div className="flex justify-between">
              <p className="normal-sm">{user && user.nama}</p>
              <img src="/gambar/Vector (28).png" />
            </div>
            <img src="/gambar/Line 7.png" className="w-full my-5" />
            <div className="flex justify-between">
              <p className="normal-sm">{user && user.email}</p>
              <img src="/gambar/Vector (28).png" />
            </div>
            <img src="/gambar/Line 7.png" className="w-full my-5" />
            <div className="flex justify-between">
              <p className="normal-sm">{user && user.no_telp}</p>
              <img src="/gambar/Vector (28).png" />
            </div>
            <button
              className="flex mt-16 mx-auto text-primary-50 border border-primary-50 rounded py-2 px-3"
            >
              <img src="/gambar/logout.png" className="p-1" onClick={handleLogout}/>Logout
            </button>
          </div>
        </div>
      </section>
        </Layout>
        </>
    )
}