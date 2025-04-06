import Constants from "expo-constants";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { Provider as CrossmintProvider, Layout as CrossmintLayout } from "@/components/crossmint";
import { Layout as DynamicLayout } from "@/components/dynamic";
import { Provider as PrivyProvider, Layout as PrivyLayout } from "@/components/privy";

function RootView({ children }: { children: ReactNode }) {
    return (
        <View
            style={{
                marginTop: 60,
            }}
        >
            <View
                style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                {children}
            </View>
        </View>
    );
}

export default function RootLayout() {
    const crossmintAppId = Constants.expoConfig?.extra?.crossmintAppId;
    const privyAppId = Constants.expoConfig?.extra?.privyAppId;
    const privyClientId = Constants.expoConfig?.extra?.privyClientId;
    const dynamicEnvironmentId = Constants.expoConfig?.extra?.dynamicEnvironmentId;

    if (!crossmintAppId) {
        <RootView>
            <Text style={{ color: "tomato" }}>Missing config: "crossmintAppId" is required in app.json</Text>
        </RootView>;
    }

    if (privyAppId && privyClientId) {
        return (
            <PrivyProvider>
                <CrossmintProvider>
                    <RootView>
                        <PrivyLayout />
                    </RootView>
                </CrossmintProvider>
            </PrivyProvider>
        );
    }

    if (dynamicEnvironmentId) {
        return (
            <CrossmintProvider>
                <RootView>
                    <DynamicLayout />
                </RootView>
            </CrossmintProvider>
        );
    }

    return (
        <CrossmintProvider>
            <RootView>
                <CrossmintLayout />
            </RootView>
        </CrossmintProvider>
    );
}
