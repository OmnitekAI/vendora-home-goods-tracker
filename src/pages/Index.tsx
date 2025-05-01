
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <h1 className="text-3xl font-bold mb-6 text-vendora-800">
          Welcome to Vendora
        </h1>
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
