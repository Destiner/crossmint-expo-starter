import { CrossmintProvider, CrossmintWalletProvider } from "@crossmint/client-sdk-react-native-ui";
import Constants from "expo-constants";
import type { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
    const apiKey = process.env.EXPO_PUBLIC_CROSSMINT_API_KEY;

    if (!apiKey) {
        throw new Error("Missing config: EXPO_PUBLIC_CROSSMINT_API_KEY is required");
    }

    return (
        <CrossmintProvider apiKey={apiKey} appId={Constants.expoConfig?.extra?.crossmintAppId}>
            <CrossmintWalletProvider>{children}</CrossmintWalletProvider>
        </CrossmintProvider>
    );
}
