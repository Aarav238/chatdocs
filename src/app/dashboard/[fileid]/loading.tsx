import { Loader2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const Loading = () => {
  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* PDF Viewer Skeleton */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
              <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-4">
                <Skeleton width={150} height={32} />
                <Skeleton width={100} height={32} />
              </div>
              <div className="flex-1 w-full flex items-center justify-center min-h-[600px]">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Skeleton */}
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <div className="flex-1 flex justify-center items-center flex-col mb-28">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <h3 className="font-semibold text-xl">Loading...</h3>
                <p className="text-zinc-500 text-sm">
                  Preparing your document
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
