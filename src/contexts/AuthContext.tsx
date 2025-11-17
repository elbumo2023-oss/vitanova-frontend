import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type AuthContextType = {
    token: string | null;
    username: string | null;
    identification: string | null;
    roles: string[] | null;
    login: (token:string) => void;
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    username: null,
    roles: null,
    identification: null,
    login: () => {},
    logout: () => {}
})

export const AuthProvider = ({children}: {children: ReactNode}) =>{
     const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
     const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
     const [identification, setIdentification] = useState<string | null>(
            localStorage.getItem("identification")
        );
     const [roles, setRoles] = useState<string[] | null>(
        localStorage.getItem("roles") ? JSON.parse(localStorage.getItem("roles") as string) : null
    );   

    const decodeToken = (token: string) => {
        try {
        const [, payloadBase64] = token.split(".");
        const payload = JSON.parse(atob(payloadBase64));
        return {
            username: payload.username || payload.sub || null,
            identification: payload.identification || null,
            exp: payload.exp ? payload.exp * 1000 : null,
            roles: payload.roles || null, 
        };
        } catch {
        return { username: null, identification: null, exp: null, roles: null };
        }
    };

        const isTokenExpired = (token: string): boolean => {
            try {
            const [, payloadBase64] = token.split(".");
            const payload = JSON.parse(atob(payloadBase64));
            const exp = payload.exp * 1000;
            return Date.now() > exp;
            } catch {
            return true;
            }
        };

        const login = (newToken: string) => {
            const decoded = decodeToken(newToken);

            localStorage.setItem("token", newToken);
            if (decoded.username) localStorage.setItem("username", decoded.username);
            if (decoded.identification) localStorage.setItem("identification", decoded.identification);
            if (decoded.roles) localStorage.setItem("roles", JSON.stringify(decoded.roles));

            setToken(newToken);
            setUsername(decoded.username);
            setIdentification(decoded.identification);
            setRoles(decoded.roles);
        };

        const logout = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("identification");
            localStorage.removeItem("roles");

            setToken(null);
            setUsername(null);
            setIdentification(null);
            setRoles(null)
        };


       useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
        if (isTokenExpired(storedToken)) {
            logout();
        } else {
            const decoded = decodeToken(storedToken);
            setToken(storedToken);
            setUsername(decoded.username);
            setIdentification(decoded.identification);
            setRoles(decoded.roles);
        }
        }
    }, []);

        return (
            <AuthContext.Provider value={{ token, username, identification, roles, login, logout }}>
            {children}
            </AuthContext.Provider>
        );
}

export const useAuth = () => useContext(AuthContext)