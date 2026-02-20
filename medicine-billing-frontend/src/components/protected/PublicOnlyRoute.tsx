import { Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import NotFound from "../../pages/NotFound";

const PublicOnlyRoute: React.FC = () => {
  const { data: me, isLoading } = useMe();

  if (isLoading) return null;

  if (me) {
    return <NotFound />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
