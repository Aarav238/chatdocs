import Skeleton from "react-loading-skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="mt-12">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-6">
            <Skeleton width={200} height={28} className="mb-2" />
            <Skeleton width={300} height={20} />
          </div>
          <div className="p-6 pt-0 flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Skeleton width={180} height={40} />
            <Skeleton width={250} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
