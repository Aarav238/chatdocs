import Skeleton from "react-loading-skeleton";

const Loading = () => {
  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <Skeleton width={200} height={40} />
        <Skeleton width={120} height={40} />
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <li
            key={i}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex flex-col gap-2">
              <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                <Skeleton circle width={40} height={40} />
                <div className="flex-1">
                  <Skeleton width="70%" height={20} />
                </div>
              </div>
            </div>
            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6">
              <Skeleton width={80} height={16} />
              <Skeleton width={24} height={24} />
              <Skeleton width="100%" height={32} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Loading;
