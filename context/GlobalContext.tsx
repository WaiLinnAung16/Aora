import { getCurrentUser } from "@/lib/appwrite";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Models } from "react-native-appwrite";

type GlobalProviderProps = {
  children: ReactNode;
};

type User = Models.Document | null;

type ContextProps = {
  isLoggined: boolean;
  setIsLoggined: Dispatch<SetStateAction<boolean>>;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  isLoading: boolean;
};

const defaultContextProps: ContextProps = {
  isLoggined: false,
  setIsLoggined: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
};

const GlobalContext = createContext<ContextProps>(defaultContextProps);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLoggined, setIsLoggined] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggined(true);
          setUser(res);
        } else {
          setIsLoggined(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggined, setIsLoggined, user, setUser, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
