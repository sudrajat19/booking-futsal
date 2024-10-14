import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function SkeletonProses() {
  return (
    <>
      <div className="bg-white p-4 rounded shadow-card col-span-2">
        <div>
          <h2 className="semibold-bs"><Skeleton/></h2>
          <div className="w-full h-1 bg-gray-300 my-4"></div>

          <div>
            <h2 className="normal-bs"><Skeleton/></h2>
            <div className="mt-2 mb-4 grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="flex-1 normal-sm border flex gap-4 px-4 p-2 justify-center rounded bg-gray-300 h-12 animate-pulse"
                ></div>
              ))}
            </div>

            <div>
              <h2 className="normal-bs capitalize"><Skeleton/></h2>
              <div className="mt-2 mb-4 grid gap-2 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="text-xs flex gap-2 border uppercase p-2 justify-center rounded bg-gray-300 h-10 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="normal-bs"><Skeleton/></h2>
              <div className="mt-2 mb-4 grid gap-2 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="text-xs flex gap-2 border p-2 justify-center rounded bg-gray-300 h-10 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
