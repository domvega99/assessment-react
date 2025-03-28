import { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { User } from "../interfaces/user.interface";

interface AppContextType {
    token: string | undefined;
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
    const [cookies] = useCookies(['token']);
    const [token, setToken] = useState(cookies.token);
    const [user, setUser] = useState<User | null>(null); 

    async function getUser() {
        const res = await fetch("/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        if (res.ok) {
            setUser(data);
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token])

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}
