import Navbar from "./_components/Navbar";

async function TasteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen w-full overflow-hidden">
      <Navbar />
      <div className="no-scrollbar w-full overflow-y-scroll">{children}</div>
    </main>
  );
}

export default TasteLayout;
