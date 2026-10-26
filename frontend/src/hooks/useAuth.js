import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Convenience hook for accessing auth state/actions anywhere in the component tree
const useAuth = () => useContext(AuthContext);

export default useAuth;
