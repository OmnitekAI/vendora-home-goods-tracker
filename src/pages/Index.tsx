
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { translations } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
