export default function Fasilitas ({fasilitas}){

    return (
        <>
        <section className=" bg-white sm:flex gap-5 py-8 px-[100px]">
              <div className="shadow-card mb-5 bg-white p-4 rounded-lg sm:flex-1">
                  {fasilitas.length > 0 && <h2  className="desktop-h5 mb-4 capitalize"> {fasilitas[0].nama_gor}</h2>}
                <ul className="flex gap-5 normal-sm">
                  <li className="flex gap-5">
                    <img src="/gambar/Vector (20).png" className="btn-md" />
                    4,5
                  </li>
                  <li className="flex gap-2 capitalize">
                    <img src="/gambar/sports_soccer.png" className="btn-md " />
                    {fasilitas.length > 0 && <p>{fasilitas[0].tipe_lapangan}</p>}
                  </li>
                </ul>
                <h2 className="semibold-bs mb-4 mt-4">Fasilitas</h2>
                <div className="flex">
                  <ul className="grid grid-cols-2 gap-5 normal-sm">
                    {fasilitas.map((fsl, index) => (
                      <li key={index} className="flex gap-2 capitalize">
                        <img src="/gambar/mosque.png" className="btn-md" />
                        {fsl.nama_fasilitas}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="shadow-card mb-5 grid gap-10 p-4 rounded-lg flex-1">
                <h2 className="semibold-bs">Lokasi</h2>
                <div className="line justify-between">
                    {fasilitas.length > 0 && (
                      <p className="normal-sm capitalize">Alamat: {fasilitas[0].alamat}</p>
                    )}
                  <img src="/gambar/Vector (12).png" className="w-9 h-9" />
                </div>
                <img src="/gambar/Rectangle 94.png" className="w-full" />
              </div>
            </section>
        </>
    )
}