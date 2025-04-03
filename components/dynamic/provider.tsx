import React, { type ReactNode } from "react";
import { SafeAreaView } from "react-native";

import { client } from "./client";

export function Provider({ children }: { children: ReactNode }) {
    return (
        <React.Fragment>
            <client.reactNative.WebView />
            <SafeAreaView>{children}</SafeAreaView>
        </React.Fragment>
    );
}
