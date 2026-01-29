import Skeleton from "react-loading-skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center mb-10">
        <Skeleton width={200} height={40} className="mx-auto mb-4" />
        <Skeleton width={400} height={20} className="mx-auto" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-white p-8 shadow-sm"
          >
            <Skeleton width={80} height={28} className="mb-4" />
            <Skeleton width={120} height={40} className="mb-2" />
            <Skeleton width={150} height={16} className="mb-6" />

            <div className="space-y-3 mb-6">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} width="100%" height={20} />
              ))}
            </div>

            <Skeleton width="100%" height={44} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
