export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[360px] bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-12 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}


