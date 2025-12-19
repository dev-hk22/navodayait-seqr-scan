import { ActivityIndicator, Platform, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
  BarcodeType,
} from "expo-camera";
import { Button } from "@/components/ui/button";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import BarcodeMask from "react-native-barcode-mask";

import * as Haptics from "expo-haptics";
import axiosInstance from "@/utils/axiosInstance";
import {
  SCAN_AUDIT_TRIALS,
  SCAN_INSTITUTE_CERT,
  SCAN_VERIFIER_CERT,
} from "@/utils/routes";
import useUser from "@/hooks/useUser";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { storage } from "@/utils/storageService";

type Props = {};

const CameraScreen = ({ }: Props) => {
  const { userDetails } = useUser();
  const [scanned, setScanned] = useState<boolean>(false);
  const [isFetchingScannedData, setIsFetchingScannedData] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const toast = useToast();
  const { scanner_type } = useLocalSearchParams<{ scanner_type: BarcodeType }>();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loginType = storage.getString("login_type");

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      cameraRef.current?.resumePreview();
      setScanned(false); // Reset scanned state when focused
    } else {
      cameraRef.current?.pausePreview();
    }
    navigation.setOptions({
      header: () => <Header isBackVisible headerTitle="Scan QR" />,
    });
  }, [isFocused]);

  const handleBarCodeScanned = (barcodeData: BarcodeScanningResult) => {
    if (scanned || !barcodeData || isFetchingScannedData) return;

    setScanned(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showScannedResult(barcodeData);
    cameraRef.current?.pausePreview();
  };

  const showScannedResult = async (barcodeData: BarcodeScanningResult) => {
    setIsFetchingScannedData(true);

    try {
      const formatBarcodeData = barcodeData.data
        .split("\n")
        .filter((line) => line.trim() !== "");
      const sanitizeBarcodeData = formatBarcodeData.pop() || "";
      const otherBarcodeData = formatBarcodeData.join("\n");

      const scannedFormData = new FormData();
      scannedFormData.append("device_type", Platform.OS);
      scannedFormData.append(
        "scanned_by",
        userDetails?.username || userDetails?.institute_username
      );
      scannedFormData.append("user_id", userDetails?.id);
      scannedFormData.append("key", sanitizeBarcodeData);

      const response = await axiosInstance.post(
        scanner_type === "code128"
          ? SCAN_AUDIT_TRIALS
          : loginType === "verifier"
            ? SCAN_VERIFIER_CERT
            : SCAN_INSTITUTE_CERT,
        scannedFormData
      );

      if (!response.data.success) {
        resetCameraAfterDelay();
        toast.show(response.data?.data?.message || response.data?.message, {
          data: response.data,
        });
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (scanner_type === "code128") {
        router.navigate({
          pathname: "/scan-audit-details",
          params: {
            scanned_results: JSON.stringify(response.data?.data),
            qr_data: otherBarcodeData,
          },
        });
      } else {
        router.navigate({
          pathname: "/scan-result",
          params: {
            scanned_results: JSON.stringify(response.data?.data),
            qr_data: otherBarcodeData,
            qr_type: scanner_type,
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError<IServerError>(error)) {
        const errorMessage =
          error.response?.data?.data?.message || "An error occurred";
        toast.show(errorMessage, {
          data: error.response?.data?.data,
        });
      }
      resetCameraAfterDelay();
    } finally {
      setIsFetchingScannedData(false);
    }
  };

  const resetCameraAfterDelay = (delay = 2000) => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    scanTimeoutRef.current = setTimeout(() => {
      setScanned(false);
      if (isFocused) {
        cameraRef.current?.resumePreview();
      }
    }, delay);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-stone-900">
        <Text className="text-white text-center">
          We need to access your camera to scan your document's / certificate's QR Code
        </Text>
        <Button onPress={requestPermission}>
          <Text>Continue</Text>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, position: "relative" }}
        barcodeScannerSettings={{
          barcodeTypes: [scanner_type],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <BarcodeMask
        width={300}
        height={scanner_type == "qr" ? 300 : 100}
        showAnimatedLine={false}
        edgeRadius={8}
      />

      {isFetchingScannedData && (
        <View className="absolute top-3/4 self-center items-center flex-row">
          <ActivityIndicator size={'small'} color={'#237fc5'} />
          <Text className="text-white bg-black/40 p-4 rounded-lg">
            Scanning your {scanner_type} data. Please wait...
          </Text>
        </View>
      )}
    </View>
  );
};

export default CameraScreen;