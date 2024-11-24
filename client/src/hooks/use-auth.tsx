import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/services/auth";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/auth");
    } else {
      navigate("/");
    }
  }, [navigate]);
};

export default useAuth;