export function Loading() {
  return (
    <div className="loader-container">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingSmall() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="spinner"></div>
    </div>
  );
}