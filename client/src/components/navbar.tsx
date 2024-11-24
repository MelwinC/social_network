import {
  CalendarDays,
  LogOut,
  PlusCircle,
  Search,
  UserCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { signOut } from "@/services/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    signOut()
    navigate("/auth");
  };

  return (
    <header className="md:top-0 w-full z-50 flex items-center bg-ternary-dark h-16 md:border-b md:bg-secondary-dark/95 border-t border-secondary-dark md:shadow-lg fixed bottom-0">
      <nav className="flex md:justify-between items-center h-full w-full">
        <div className="md:flex-1 text-right hidden md:block">
          <Link to="/">
            <Button variant={"navbarLogo"}>
              <p className="pl-2 text-[1.2rem]">
                <span className="text-indigo-400">Social</span> network
              </p>
            </Button>
          </Link>
        </div>
        <div className="md:flex-[3] md:text-center w-full flex md:justify-center justify-evenly">
          <Link to="/" className="md:pr-6">
            <Button variant={"navbarItem"} className="p-0 md:px-2">
              <Search />
              <p className="md:block pl-2 text-[0.8rem] hidden">
                Button 1
              </p>
              <p className="md:pl-2 text-[0.8rem] md:hidden p-0">Button 1</p>
            </Button>
          </Link>
          <Link to="/" className="md:pr-6">
            <Button variant={"navbarItem"} className="p-0 md:px-2">
              <CalendarDays />
              <p className="md:pl-2 text-[0.8rem] p-0">Button 2</p>
            </Button>
          </Link>
          <Link to="/">
            <Button variant={"navbarItem"} className="p-0 md:px-2">
              <PlusCircle />
              <p className="md:block pl-2 text-[0.8rem] hidden">
                Button 3
              </p>
              <p className="md:pl-2 text-[0.8rem] md:hidden p-0">Button 3</p>
            </Button>
          </Link>
          <Link to="/" className="text-white md:hidden">
            <Button variant={"navbarItem"} className="p-0 md:px-2">
              <UserCircle2 />
              <p className="p-0 text-[0.8rem]">Account</p>
            </Button>
          </Link>
        </div>
        <div className="md:flex md:flex-[0.8] md:justify-start hidden">
          <Link to="/compte">
            <UserCircle2 className="text-primary-light/60 hover:text-primary-light/90 hover:cursor-pointer mr-4" />
          </Link>
          <LogOut
            className="text-primary-light/60 hover:text-primary-light/90 hover:cursor-pointer"
            onClick={logout}
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
