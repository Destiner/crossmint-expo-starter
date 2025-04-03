import Constants from "expo-constants";
import { PrivyProvider, PrivyElements } from "@privy-io/expo";
import type { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
    return (
        <PrivyProvider
            appId={Constants.expoConfig?.extra?.privyAppId}
            clientId={Constants.expoConfig?.extra?.privyClientId}
        >
            {children}
            <PrivyElements />
        </PrivyProvider>
    );
}
