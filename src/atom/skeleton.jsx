import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DetailLapanganSkeleton() {
  return (
    <div className="container mx-auto bg-white">
      <div className="flex justify-center">
        <Skeleton className="w-full py-8 px-[100px] pr-0 mt-8" height={300} width={800} />
      </div>

      <section className="w-full py-8 px-[100px] pr-0 mt-8">
        <div className="flex gap-5 mb-4 border-solid overflow-x-scroll">
          {[1, 2, 3].map((item, index) => (
            <Skeleton
              key={index}
              className="w-[200px] h-[150px]"
              style={{ borderRadius: "8px" }}
            />
          ))}
        </div>
        <div className="flex gap-8 justify-center">
          {[1, 2].map((item, index) => (
            <Skeleton
              key={index}
              className="w-[50px] h-[50px]"
              circle={true}
            />
          ))}
        </div>
      </section>

      <div className="py-8 px-[100px]">
        <h2 className="semibold-bs mb-4">
          <Skeleton width={200} />
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item, index) => (
            <div key={index} className="card shadow-card p-4">
              {/* Gambar Kartu */}
              <Skeleton height={150} />
              <div className="mt-4">
                <h3 className="semibold-bs mb-3">
                  <Skeleton width="80%" />
                </h3>
                <ul className="grid gap-5">
                  <li>
                    <Skeleton width={120} />
                  </li>
                  <li>
                    <Skeleton width={60} />
                  </li>
                  <li>
                    <Skeleton width={90} />
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
