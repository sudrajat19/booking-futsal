import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex pt-[100px]">
        <Sidebar />
        <div className="w-full p-4">{children}</div>
      </div>
    </>
  );
}
