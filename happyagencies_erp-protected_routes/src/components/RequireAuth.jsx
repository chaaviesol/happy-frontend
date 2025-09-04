import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.post("/auth/accesstoken");
        // console.log(response);
        const { roles, user ,allowedPages,userType,division,logged_id} = response.data;
        setAuth({
          allowedPages,
          userType,
          user,
          roles,
          division,
          logged_id
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location]);
  // console.log(auth);
  if (!isLoading) {
    return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
      <Outlet />
    ) : auth?.user ? (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }
};

export default RequireAuth;
