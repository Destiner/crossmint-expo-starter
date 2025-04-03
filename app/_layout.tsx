import { Layout as DynamicLayout } from "@/components/dynamic";
import { Provider as PrivyProvider, Layout as PrivyLayout } from "@/components/privy";
import { useState } from "react";
import { View } from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";

export default function RootLayout() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    function handleIndexChange(index: number) {
        setSelectedIndex(index);
    }

    return (
        <PrivyProvider>
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
                    <SegmentedControlTab
                        values={["Privy", "Dynamic"]}
                        selectedIndex={selectedIndex}
                        onTabPress={handleIndexChange}
                    />
                    {selectedIndex === 0 ? <PrivyLayout /> : <DynamicLayout />}
                </View>
            </View>
        </PrivyProvider>
    );
}
