import { useContext } from "react";
import {AuthContext} from "../Contexts/Auth/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;