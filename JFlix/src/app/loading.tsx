export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)] bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mb-4"></div>
        <h2 className="text-xl font-semibold text-[var(--primary)]">Loading...</h2>
      </div>
    </div>
  );
}
