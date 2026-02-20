import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5 text-center">
        <h2 className="text-2xl font-semibold">Signup Disabled</h2>
        <p className="text-gray-600">Public signups are disabled. Please contact your administrator to create an account.</p>
        <Link to={ROUTES.LOGIN} className="inline-block mt-4 text-blue-600">Back to login</Link>
      </div>
    </div>
  );
};

export default Signup;
