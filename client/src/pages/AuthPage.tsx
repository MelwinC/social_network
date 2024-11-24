import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Toast from "@/components/Toast";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/services/auth";
import useAuth from "@/hooks/use-auth";

const AuthPage = () => {
  useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [variant, setVariant] = useState("login");

  const navigate = useNavigate();

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const login = useCallback(async () => {
    try {
      if (!email || !password) {
        setError("Veuillez remplir tous les champs !");
        return;
      }
  
      const response = await signIn({ email, password });
  
      if ("error" in response) {
        switch (response.error) {
          case "Incorrect credentials":
            setError("Email ou mot de passe incorrect.");
            break;
          case "User not found":
            setError("Utilisateur non trouvé.");
            break;
          default:
            setError("Erreur lors de la connexion.");
        }
      } else if ("message" in response && response.message === "User successfully logged in") {
        Toast(true, "Connecté avec succès !");
        navigate("/");
      }
    } catch (error) {
      setError("Erreur inattendue lors de la connexion !");
    }
  }, [email, password, navigate]);
  

  const register = useCallback(async () => {
    try {
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas !");
      } else {
        const response = await signUp({
          email,
          password,
        });
        if ("error" in response && response.error === "Invalid email") {
          setError("Format d'email incorrect.");
        } else if (
          "message" in response &&
          response.message === "User successfully logged in"
        ) {
          Toast(true, "Compte créé avec succès !");
          navigate("/");
        }
      }
    } catch (error) {
      setError("Erreur lors de l'inscription !");
    }
  }, [email, password, confirmPassword, navigate]);

  useEffect(() => {
    setError(null);
  }, [email, password, confirmPassword]);

  return (
    <div className="flex justify-center items-center bg-primary-dark w-full h-full">
      <div className="flex justify-center w-full h-full">
        <div className="bg-ternary-dark px-16 py-12 self-center mt-2 min-w-min max-w-2xl rounded-lg w-4/5">
          <div className="text-center mb-8">
            <Button variant={"navbarLogo"} className="hover:cursor-default">
              <p className="pl-2 text-[2rem]">
                <span className="text-indigo-400">Social</span> network
              </p>
            </Button>
          </div>
          <h2 className="text-white text-4xl mb-8 font-semibold">
            {variant === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              variant === "login" ? login() : register();
            }}
          >
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex flex-col gap-4">
              <Input
                label="Email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                id="email"
                type="text"
                value={email}
              />
              <Input
                label="Mot de passe"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                id="password"
                type="password"
                value={password}
              />
              {variant === "register" && (
                <Input
                  label="Confirmer le mot de passe"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                />
              )}
            </div>
            <Button
              type="submit"
              variant="dark"
              className="text-lg w-full mt-10 active:bg-neutral-700 active:duration-300 py-6"
            >
              {variant === "login" ? "Se connecter" : "Créer un compte"}
            </Button>
            <div className="flex flex-row items-center gap-4 mt-8 justify-center"></div>
            <p className="text-neutral-300 mt-4">
              {variant === "login"
                ? "Pas encore de compte ?"
                : "Vous possédez déjà un compte ?"}
              <span
                onClick={toggleVariant}
                className="text-indigo-400 ml-1 hover:underline cursor-pointer font-semibold"
              >
                {variant === "login" ? "Inscrivez-vous" : "Connectez-vous"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
