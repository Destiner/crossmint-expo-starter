import { useReactiveClient } from "@dynamic-labs/react-hooks";
import type { BaseWallet, UserProfile } from "@dynamic-labs/types";
import { useEffect, useState } from "react";
import { client } from "./client";

export function useDynamic() {
    const { auth, wallets, solana } = useReactiveClient(client);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userWallets, setUserWallets] = useState<BaseWallet[]>([]);
    const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);

    useEffect(() => {
        // Set initial values
        setAuthToken(client.auth.token);
        setUser(client.auth.authenticatedUser);
        setUserWallets(wallets.userWallets);
        setActiveWallet(client.wallets.primary || null);

        // Set up event listeners
        auth.on("loggedOut", (user: UserProfile | null) => {
            setUser(user);
            setAuthToken(null);
        });

        auth.on("tokenChanged", (token: string | null) => {
            setAuthToken(token);
        });

        auth.on("authenticatedUserChanged", (user: UserProfile | null) => {
            setUser(user);
        });

        wallets.on("primaryChanged", (wallet: BaseWallet | null) => {
            setActiveWallet(wallet);
        });

        wallets.on("userWalletsChanged", (wallets: BaseWallet[]) => {
            setUserWallets(wallets);
            setActiveWallet(wallets[0] || null);
        });
    }, []);

    return {
        authToken,
        user,
        setUser,
        userWallets,
        setUserWallets,
        activeWallet,
        setActiveWallet,
        solana,
        auth,
        wallets,
    };
}
