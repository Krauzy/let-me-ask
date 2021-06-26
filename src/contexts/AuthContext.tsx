//Context, Nodes and Hooks
import { createContext, ReactNode, useEffect, useState } from "react";

// Services
import { auth, firebase } from "../services/firebase";

//Types
type UserType = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: UserType | undefined;
    OAuthGoogle: () => Promise<void>;
}

type AuthContextProps = {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProps) {
    const [user, setUser] = useState<UserType>();
    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            if(user) {
                const { displayName, photoURL, uid } = user;
                if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.');
                }
                setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
                })
            }
        })
        return () => {
            unsub();
        }
    }, [])

    async function OAuthGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider)
        if(result.user) {
            const { displayName, photoURL, uid } = result.user;
            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.');
            }
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }
    return (
        <AuthContext.Provider value={{ user, OAuthGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}