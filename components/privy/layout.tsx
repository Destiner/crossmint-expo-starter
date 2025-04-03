import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    type PrivyEmbeddedSolanaWalletProvider,
    usePrivy,
    useEmbeddedSolanaWallet,
    useLoginWithEmail,
} from "@privy-io/expo";
import { Button, View, Text, TextInput } from "react-native";

function LoginWithEmail() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const { sendCode, loginWithCode } = useLoginWithEmail();
    const [otpSent, setOtpSent] = useState(false);

    const handleLogin = async () => {
        await loginWithCode({ code, email });
        setOtpSent(false);
    };

    const handleSendCode = async () => {
        await sendCode({ email });
        setOtpSent(true);
    };

    return (
        <View>
            {otpSent ? (
                <React.Fragment>
                    <TextInput value={code} keyboardType="number-pad" onChangeText={setCode} placeholder="Code" />
                    <Button onPress={() => handleLogin()} title="Login" />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        placeholder="Enter your email"
                    />
                    <Button onPress={() => handleSendCode()} title="Send Code" />
                </React.Fragment>
            )}
        </View>
    );
}

const UserScreen = () => {
    const { logout, user, getAccessToken } = usePrivy();
    const { wallets, create } = useEmbeddedSolanaWallet();
    const wallet = useMemo(() => wallets?.[0], [wallets]);

    useEffect(() => {
        if (wallets?.length === 0) {
            create?.();
        }
    }, [create, wallets]);

    const email = useMemo(() => {
        return user?.linked_accounts.find((account) => account.type === "email")?.address;
    }, [user]);

    const getJwt = useCallback(async () => {
        const jwt = await getAccessToken();
        console.log(jwt);
    }, [getAccessToken]);

    const signMessage = useCallback(async (provider: PrivyEmbeddedSolanaWalletProvider | undefined) => {
        if (!provider) {
            console.error("No provider found");
            return;
        }
        try {
            const message = await provider.request({
                method: "signMessage",
                params: {
                    message: "Hello, world!",
                },
            });
            console.log(message.signature);
        } catch (e) {
            console.error(e);
        }
    }, []);

    if (!user) {
        return null;
    }

    return (
        <React.Fragment>
            <Text>Email: {email}</Text>
            <Text>Wallet: {wallet?.address}</Text>
            <View>
                <Button title="Sign Message" onPress={async () => signMessage(await wallet?.getProvider())} />
                <Button title="Get JWT" onPress={getJwt} />
                <Button title="Logout" onPress={logout} />
            </View>
        </React.Fragment>
    );
};

export function Layout() {
    const { user } = usePrivy();
    return (
        <View
            style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >
            {user ? <UserScreen /> : <LoginWithEmail />}
        </View>
    );
}
