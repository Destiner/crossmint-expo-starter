import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { client } from "./client";
import { useDynamic } from "./useDynamic";

const EmailSignIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const { user, setUser } = useDynamic();

    const handleSendOTP = async () => {
        await client.auth.email.sendOTP(email);
        setOtpSent(true);
    };

    const handleResendOTP = () => {
        client.auth.email.resendOTP();
    };

    const handleVerifyOTP = async () => {
        await client.auth.email.verifyOTP(otp);
        const user = client.auth.authenticatedUser;
        setUser(user);
    };

    return (
        <View>
            {otpSent ? (
                <View>
                    <TextInput value={otp} keyboardType="number-pad" onChangeText={setOtp} placeholder="Login" />
                    <Button onPress={handleVerifyOTP} title="Login" />
                    <Button onPress={handleResendOTP} title="Resend" />
                </View>
            ) : (
                <View>
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
                    <Button onPress={handleSendOTP} title="Send Code" />
                </View>
            )}
        </View>
    );
};

export function Layout() {
    const { authToken, user, activeWallet, solana } = useDynamic();

    const getJwt = () => {
        console.log(authToken);
    };

    const handleLogout = async () => {
        await client.auth.logout();
    };

    const handleSignMessage = async () => {
        if (!activeWallet) {
            return;
        }
        const signer = solana.getSigner({ wallet: activeWallet });
        const response = await signer.signMessage(new TextEncoder().encode("Hello, world!"));
        console.log(response.signature);
    };

    return (
        <React.Fragment>
            <client.reactNative.WebView />
            <SafeAreaView>
                <View
                    style={{
                        marginTop: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    {activeWallet ? (
                        <React.Fragment>
                            <Text>Email: {user?.email}</Text>
                            <Text>Wallet: {activeWallet.address}</Text>
                            <Button title="Sign Message" onPress={handleSignMessage} />
                            <Button title="Get JWT" onPress={getJwt} />
                            <Button onPress={handleLogout} title="Logout" />
                        </React.Fragment>
                    ) : (
                        <EmailSignIn />
                    )}
                </View>
            </SafeAreaView>
        </React.Fragment>
    );
}
