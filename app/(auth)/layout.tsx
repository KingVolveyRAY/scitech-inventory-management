export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100/60 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1040px]">
        {children}
      </div>
    </main>
  );
}
