import Footbar from "../footbar";
import Navbar from "../navbar";

export default function Layout({ children }) {
  return (
    <>
      <div className="bg-custom bg-cover ">
        <Navbar />
        {children}
      </div>
      <Footbar />
    </>
  );
}
