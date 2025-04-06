import { type SolanaSmartWallet, useCrossmint, useWallet } from "@crossmint/client-sdk-react-native-ui";
import React, { useEffect, useMemo, useState } from "react";
import { usePrivy, useEmbeddedSolanaWallet, useLoginWithEmail } from "@privy-io/expo";
import { Button, View, Text, TextInput } from "react-native";
import {
    Connection,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

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
    const { setJwt } = useCrossmint();
    const { wallet: smartWallet, getOrCreateWallet, error } = useWallet();
    const { logout, user, getAccessToken } = usePrivy();
    const { wallets, create } = useEmbeddedSolanaWallet();
    const wallet = useMemo(() => wallets?.[0], [wallets]);

    useEffect(() => {
        if (wallets?.length === 0) {
            create?.();
        }
    }, [create, wallets]);

    useEffect(() => {
        updateJwt();
    }, [user]);

    async function updateJwt() {
        const jwt = await getAccessToken();
        if (jwt) {
            setJwt(jwt);
        }
    }

    function hexToUint8Array(hexString: string) {
        const cleanHex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
        const paddedHex = cleanHex.length % 2 ? "0" + cleanHex : cleanHex;
        const bytes = [];
        for (let i = 0; i < paddedHex.length; i += 2) {
            bytes.push(parseInt(paddedHex.substring(i, i + 2), 16));
        }
        return new Uint8Array(bytes);
    }

    async function initSmartWallet() {
        if (!wallet) {
            return;
        }
        const signerAddress = wallet.address;
        const signerProvider = await wallet.getProvider();
        const connection = new Connection("https://api.devnet.solana.com");
        await getOrCreateWallet({
            type: "solana-smart-wallet",
            args: {
                adminSigner: {
                    type: "solana-keypair",
                    address: signerAddress,
                    signer: {
                        signMessage: async (message: Uint8Array<ArrayBufferLike>) => {
                            const response = await signerProvider.request({
                                method: "signMessage",
                                params: {
                                    message: message.toString(),
                                },
                            });
                            return hexToUint8Array(response.signature);
                        },
                        signTransaction: async (transaction: VersionedTransaction) => {
                            const response = (await signerProvider.request({
                                method: "signTransaction",
                                params: {
                                    transaction: transaction,
                                    // @ts-ignore
                                    connection: connection,
                                },
                            })) as unknown as {
                                signedTransaction: VersionedTransaction;
                            };
                            return response.signedTransaction;
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

    const email = useMemo(() => {
        return user?.linked_accounts.find((account) => account.type === "email")?.address;
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <React.Fragment>
            <Text>Email: {email}</Text>
            <Text>Wallet: {wallet?.address}</Text>
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
