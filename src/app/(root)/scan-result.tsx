import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import PagerView from "react-native-pager-view";
import ViewCertificate from "@/components/ViewCertificate";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import useUser from "@/hooks/useUser";
import PrintDetailsCard from "@/components/ui/PrintDetailsCard";

type Props = {};

const TABS = [
    {
        id: 1,
        name: "View Certificate",
    },
    {
        id: 2,
        name: "View Printing Details",
    },
];

const ScanResultScreen = ({ }: Props) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [pagerScrollEnabled, setPagerScrollEnabled] = useState<boolean>(true);
    const { userDetails } = useUser();
    const { scanned_results, qr_data } = useLocalSearchParams();
    const pagerRef = useRef<PagerView>(null);

    const handleTabSwitch = (index: number) => {
        setActiveTabIndex(index);
        pagerRef.current?.setPage(index);
    };
    // console.log(scanned_results, "scanned_results");
    // console.log(qr_data, "qr_data");


    return (
        <View className="flex-1 bg-white">
            {userDetails?.institute_username ? (
                <>
                    <View className="flex-row items-center justify-around border-b-2 border-gray-200">
                        {TABS.map((tab, index) => (
                            <TouchableOpacity
                                key={tab.id}
                                className={`flex-1 py-2 ${activeTabIndex == index ? "border-b-2 border-primary" : "border-0"
                                    } `}
                                onPress={() => handleTabSwitch(index)}
                            >
                                <Text
                                    className={`text-center text-base xs:text-lg ${activeTabIndex == index ? "text-primary font-medium" : ""
                                        }`}
                                >
                                    {tab.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <PagerView
                        ref={pagerRef}
                        style={styles.pagerView}
                        initialPage={0}
                        onPageSelected={(e) => setActiveTabIndex(e.nativeEvent.position)}
                        className="p-4"
                        scrollEnabled={pagerScrollEnabled}
                    >
                        <View key="1" className="p-4 flex-1">
                            <ViewCertificate
                                scannedResults={JSON.parse(scanned_results)}
                                barcodeData={qr_data}
                                setPagerScrollEnabled={setPagerScrollEnabled}
                            />
                        </View>
                        <View key="2" className="items-center justify-center gap-2 flex-1">
                            <PrintDetailsCard data={JSON.parse(scanned_results)} printDetailsAvailable={JSON.parse(scanned_results)?.isPrintDetailsAvailable == '0'} />
                        </View>
                    </PagerView>
                </>
            ) : (
                <View key="1" className="p-4 flex-1">
                    <ViewCertificate
                        scannedResults={JSON.parse(scanned_results)}
                        barcodeData={qr_data}
                        setPagerScrollEnabled={setPagerScrollEnabled}
                    />
                </View>
            )}
        </View>
    );
};

export default ScanResultScreen;

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
});
