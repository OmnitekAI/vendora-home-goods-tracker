
import { useDashboardData } from "@/hooks/useDashboardData";
import StatsCards from "./StatsCards";
import DashboardCharts from "./DashboardCharts";
import TopProducts from "./TopProducts";
import QuickAccess from "./QuickAccess";
import { useLanguage } from "@/context/LanguageContext";

const DashboardContent = () => {
  const { language } = useLanguage();
  const { stats, chartData, formatCurrency } = useDashboardData();

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <DashboardCharts 
        monthlyRevenueData={chartData.monthlyRevenueData}
        productDistributionData={chartData.productDistributionData}
        locationPerformanceData={chartData.locationPerformanceData}
        formatCurrency={formatCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts products={stats.topProducts} />
        <QuickAccess />
      </div>
    </div>
  );
};

export default DashboardContent;
