import { AdminData, AdminRole, UserStatus } from "@/interfaces";
import { useNavigate } from "react-router-dom";
import { createContext, FC, PropsWithChildren, useCallback, useState, useEffect } from "react";

type UserContext = {
    user: AdminData | null | undefined;
    isError: boolean;
    isLoading: boolean;
    refetch: () => void;
    logout: () => void;
};

export const UserContext = createContext<UserContext>({
    user: null,
    isError: false,
    isLoading: false,
    logout: () => { },
    refetch: () => { },
});

// Mock user data for template
const MOCK_USER: AdminData = {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: AdminRole.Admin,
    status: UserStatus.Active,
    fullName: "Admin User",
    phoneNumber: "+1234567890",
    profilePhoto: "/images/defaultAvatar.png",
    createdAt: new Date().toISOString(),
    types: [],
};

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminData | null>(null);

    // Check for mock token on mount
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
        if (token) {
            setUser(MOCK_USER);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        navigate("/auth/login");
    }, [navigate]);

    const refetch = useCallback(() => {
        // Mock refetch - just set user if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
        if (token) {
            setUser(MOCK_USER);
        }
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                isError: false,
                isLoading: false,
                refetch,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;