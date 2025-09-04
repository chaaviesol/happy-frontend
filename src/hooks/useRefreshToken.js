import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();
  const refreshToken = sessionStorage.getItem("refreshToken");

  const headers = {
    Authorization: `Bearer ${refreshToken}`,
  };
  const refresh = async () => {
    const response = await axios.post("/auth/refreshtoken", null, {
      headers,
    });
    console.log(response);
    const accessToken = response.data.accessToken;
    sessionStorage.setItem("accessToken", accessToken);
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;