import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const SkeletonPesanPage = () => {
  return (
    <div className="p-4">
      <h2 className="semibold-lg p-4">
        <Skeleton width={200} height={30} />
      </h2>

      <div className="shadow-card normal-bs p-4 mb-4">
        <Skeleton height={40} />
      </div>

      <div className="shadow-card grid grid-cols-3 gap-4 p-4 mb-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} height={50} />
        ))}
      </div>

      <div className="shadow-card p-4 mb-4">
        <Skeleton height={50} />
        <Skeleton height={30} />
      </div>
    </div>
  );
};

export default SkeletonPesanPage;
