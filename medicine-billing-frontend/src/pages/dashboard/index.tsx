import StatCard from "../../components/ui/StatCard";
import { ROLE } from "../../Constants";
import { useMe } from "../../hooks/useMe";

const Dashboard = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const isAdmin = user.role === ROLE.ADMIN;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Dashboard
      </h1>

      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Medicines" value="120" />
          <StatCard title="Total Companies" value="18" />
          <StatCard title="Today Sales" value="₹ 8,450" />
          <StatCard title="Low Stock Items" value="6" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard title="Today Purchase" value="₹ 1,250" />
          <StatCard title="Total Bills" value="14" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
