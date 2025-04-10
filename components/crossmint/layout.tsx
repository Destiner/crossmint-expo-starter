import "react-native-get-random-values";
import { install } from "react-native-quick-crypto";
install();

import { type SolanaSmartWallet, useCrossmint, useWallet } from "@crossmint/client-sdk-react-native-ui";
import { useEffect, useMemo } from "react";
import { Button, Text, View } from "react-native";
import {
    Keypair,
    Connection,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

const jwt = process.env.EXPO_PUBLIC_CROSSMINT_JWT;

export function Layout() {
    const { setJwt } = useCrossmint();
    const { wallet, error, getOrCreateWallet } = useWallet();

    useEffect(() => {
        setJwt(jwt);
    }, [setJwt]);

    const walletAddress = useMemo(() => wallet?.getAddress(), [wallet]);

    function initWallet() {
        const keypair = Keypair.fromSeed(
            new Uint8Array([
                42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
                42, 42, 42, 42, 42, 42,
            ])
        );
        getOrCreateWallet({
            type: "solana-smart-wallet",
            args: {
                adminSigner: {
                    type: "solana-keypair",
                    signer: keypair,
                    address: keypair.publicKey.toBase58(),
                },
            },
        });
    }

    async function makeTransaction() {
        if (wallet == null) {
            console.log("Wallet not initialized");
            return;
        }

        const connection = new Connection("https://api.devnet.solana.com");
        const memoInstruction = new TransactionInstruction({
            keys: [
                {
                    pubkey: new PublicKey(wallet.getAddress()),
                    isSigner: true,
                    isWritable: true,
                },
            ],
            data: Buffer.from("Hello from Crossmint SDK", "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        });

        const blockhash = (await connection.getLatestBlockhash()).blockhash;
        const newMessage = new TransactionMessage({
            payerKey: new PublicKey(wallet.getAddress()),
            recentBlockhash: blockhash,
            instructions: [memoInstruction],
        });

        const transaction = new VersionedTransaction(newMessage.compileToV0Message());

        const txHash = await (wallet as SolanaSmartWallet).sendTransaction({
            transaction,
        });
        console.log("txHash", txHash);
    }

    if (!jwt) {
        return (
            <View>
                <Text style={{ color: "tomato" }}>Crossmint JWT is required</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Wallet: {walletAddress}</Text>
            <Text>Error: {error}</Text>
            <Button title="Init Wallet" onPress={() => initWallet()} />
            <Button title="Make Transaction" onPress={() => makeTransaction()} />
        </View>
    );
}
