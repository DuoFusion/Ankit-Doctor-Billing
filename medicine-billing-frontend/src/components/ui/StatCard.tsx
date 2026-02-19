interface StatCardProps {
  title: string;
  value: string;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="bg-white border-l-4 border-cyan-500 rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-2">
        {value}
      </h3>
    </div>
  );
};

export default StatCard;
