import { createClient } from "@dynamic-labs/client";
import Constants from "expo-constants";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { SolanaExtension } from "@dynamic-labs/solana-extension";

const client = createClient({
    environmentId: Constants.expoConfig?.extra?.dynamicEnvironmentId,
    appName: "Dynamic Demo",
})
    .extend(ReactNativeExtension())
    .extend(ViemExtension())
    .extend(SolanaExtension());

export { client };
