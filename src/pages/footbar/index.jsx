
export default function Footbar() {
  return (
    <>
      <div className="shadow-card  py-8 px-[100px]">
        <div className="container mx-auto md:flex">
          <div className="flex-1">
            <div className="flex items-center">
              <img src="/gambar/Union.png" alt="logo" width={39} height={48}/>
              <p className="text-primary-50 mobile-h4 ml-4">BOOKINGLAPANGAN</p>
            </div>
            <div className="mt-3">
              <ul className="normal-xs">
                <li className="flex mt-1">
                  <img src="/gambar/whatsapp.png" alt="wa" width={16} height={16} className="mr-2" />
                  +62 812 1212 3456
                </li>
                <li className="flex mt-1">
                  <img src="/gambar/ig.png" alt="ig" width={16} height={16} className="mr-2" />
                  @bookinglapangan
                </li>
                <li className="flex mt-1">
                  <img src="/gambar/email.png" alt="email" width={16} height={16} className="mr-1" />
                  cs@bookinglapangan.com
                </li>
                <li className="flex mt-1">
                  <img src="/gambar/language.png" alt="wa" width={16} height={16} className="mr-2" />
                  www.bookinglapangan.com
                </li>
              </ul>
            </div>
          </div>
          <div className="flex mt-8 gap-2 flex-1">
            <div className="flex-1">
              <h2 className="normal-bs mb-4">Kategori Lapangan</h2>
              <ul className="lis normal-sm list-disc ml-6">
                <li>Basketball</li>
                <li>Badminton</li>
                <li>Futsal</li>
                <li>Tenis</li>
              </ul>
            </div>
            <div className="flex-1">
              <h2 className="normal-bs mb-4">Download Aplikasi Booking Lapangan</h2>
              <img src="/gambar/googleplay.png" width={133} height={40} className="mb-4" />
              <img src="/gambar/appstore.png" width={133} height={40} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
