import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

type User = {
    fullName: string;
    imageUrl: string;
}


export function useCachedUser() {
    const { user: clerkUser } = useUser();
    let user: User | undefined;
    if (clerkUser) {
        user = {
            fullName: clerkUser.fullName ?? "",
            imageUrl: clerkUser.imageUrl ?? "",
        };
    }
    if (!user) {
        user = loadCachedUser();
    }
    useEffect(() => {
        const existing = loadCachedUser();
        if (clerkUser && (clerkUser.fullName !== existing?.fullName || clerkUser.imageUrl !== existing?.imageUrl)) {
            const newUser: User = {
                fullName: clerkUser.fullName ?? "",
                imageUrl: clerkUser.imageUrl ?? "",
            };
            localStorage.setItem("cached-user", JSON.stringify(newUser));
        }                
    }, [clerkUser]);

    return user;
}

function loadCachedUser(): User | undefined {
    const existing = localStorage.getItem("cached-user");
    return existing ? JSON.parse(existing) : undefined;
}
