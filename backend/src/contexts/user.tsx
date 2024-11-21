import React, { createContext, useState } from "react";

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatarPath: string;
    role: string;
    jwtToken: string;
}

interface UserContextState {
    user: User;
    setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextState>({
    user: {
        id: undefined,
        username: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phoneNumber: undefined,
        avatarPath: undefined,
        role: undefined,
        jwtToken: undefined,
    },
    setUser: () => {}
})

export function UserProvider({ children }) {
    const [user, setUser] = useState<User>({
        id: undefined,
        username: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phoneNumber: undefined,
        avatarPath: undefined,
        role: undefined,
        jwtToken: undefined,
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}