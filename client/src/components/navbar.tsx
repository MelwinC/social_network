import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { signOut } from "@/services/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <header className="md:top-0 w-full z-50 flex items-center bg-ternary-dark h-16 md:border-b md:bg-secondary-dark/95 border-t border-secondary-dark md:shadow-lg fixed bottom-0">
      <nav className="flex md:justify-between items-center h-full w-full mx-16">
        <Link to="/">
          <Button variant={"navbarLogo"}>
            <p className="pl-2 text-[1.2rem]">
              <span className="text-indigo-400">Social</span> network
            </p>
          </Button>
        </Link>
        <LogOut
          className="text-primary-light/60 hover:text-primary-light/90 hover:cursor-pointer"
          onClick={logout}
        />
      </nav>
    </header>
  );
};

export default Navbar;
