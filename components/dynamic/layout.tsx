import { Button, SafeAreaView, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { client } from "./client";
import { useDynamic } from "./useDynamic";
import type { SolanaSmartWallet } from "@crossmint/client-sdk-react-native-ui";
import { useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useCrossmint } from "@crossmint/client-sdk-react-native-ui";
import {
    Connection,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

const EmailSignIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const { setUser } = useDynamic();

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
    const { setJwt } = useCrossmint();
    const { wallet: smartWallet, getOrCreateWallet, error } = useWallet();
    const { authToken, user, activeWallet, solana } = useDynamic();

    const handleLogout = async () => {
        await client.auth.logout();
    };

    useEffect(() => {
        if (authToken) {
            setJwt(authToken);
        }
    }, [authToken]);

    function initSmartWallet() {
        if (!activeWallet) {
            return;
        }
        const signerAddress = activeWallet.address;
        const signer = solana.getSigner({ wallet: activeWallet });
        getOrCreateWallet({
            type: "solana-smart-wallet",
            args: {
                adminSigner: {
                    type: "solana-keypair",
                    address: signerAddress,
                    signer: {
                        signMessage: async (message: Uint8Array<ArrayBufferLike>) => {
                            const response = await signer.signMessage(message);
                            return response.signature;
                        },
                        signTransaction: async (transaction: VersionedTransaction) => {
                            return await signer.signTransaction(transaction);
                        },
                    },
                },
            },
        });
    }

    async function mint() {
        if (!smartWallet) {
            return;
        }
        // TODO send a mint transaction
        const connection = new Connection("https://api.devnet.solana.com");
        const memoInstruction = new TransactionInstruction({
            keys: [
                {
                    pubkey: new PublicKey(smartWallet.getAddress()),
                    isSigner: true,
                    isWritable: true,
                },
            ],
            data: Buffer.from("Hello from Crossmint SDK", "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        });

        const blockhash = (await connection.getLatestBlockhash()).blockhash;
        const newMessage = new TransactionMessage({
            payerKey: new PublicKey(smartWallet.getAddress()),
            recentBlockhash: blockhash,
            instructions: [memoInstruction],
        });

        const transaction = new VersionedTransaction(newMessage.compileToV0Message());

        const txHash = await (smartWallet as SolanaSmartWallet).sendTransaction({
            transaction,
        });
        console.log("txHash", txHash);
    }

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
                            <Text>Error: {error}</Text>
                            <View>
                                {smartWallet ? (
                                    <>
                                        <Text>Smart Wallet: {smartWallet.getAddress()}</Text>
                                        <Button title="Mint" onPress={mint} />
                                    </>
                                ) : (
                                    <Button title="Init Smart Wallet" onPress={initSmartWallet} />
                                )}
                                <Button title="Logout" onPress={handleLogout} />
                            </View>
                        </React.Fragment>
                    ) : (
                        <EmailSignIn />
                    )}
                </View>
            </SafeAreaView>
        </React.Fragment>
    );
}
