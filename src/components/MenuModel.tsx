import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Separator } from "./ui/separator";
import { router } from "expo-router";
import { storage } from "@/utils/storageService";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/utils/axiosInstance";
import { USER_LOGOUT } from "@/utils/routes";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import useUser from "@/hooks/useUser";
import Icon from "@/libs/LucideIcon";
import CustomModal from "./ui/CustomModal";

const MenuModal = () => {
  const { setIsUserLoggedIn, setAuthToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const toast = useToast();
  const { userDetails } = useUser();

  const handleUserLogOut = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(USER_LOGOUT);

      if (!response.data.success) {
        toast.show(response.data?.data?.message || response.data?.message);
      }

      storage.clearAll();
      setAuthToken(null);
      setIsUserLoggedIn(false);
      toast.show(response.data?.message || "Logged out successfully",{
        type: 'success'
      });
      router.replace("/welcome");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.show(error.response?.data?.message || error.message);
      } else {
        toast.show(error?.message || "Something went wrong");
      }
      storage.clearAll();
      setAuthToken(null);
      setIsUserLoggedIn(false);
      router.replace("/welcome");
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  const handleRemoveAccount = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you sure you want to delete your account?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setVisible(false);
            router.navigate("/(root)/removeAccount");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View>
      {/* Trigger button (3-dot menu) */}
      <Button
        variant="ghost"
        size="icon"
        className="p-0"
        onPress={() => setVisible(true)}
      >
        <Icon name="EllipsisVertical" color="#000" size={24} />
      </Button>

      {/* Menu Popover */}
      <CustomModal
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <View style={styles.menuContainer}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setVisible(false);
              router.navigate("/about");
            }}
          >
            <Text className="native:text-base">About Us</Text>
          </Button>

          <Separator />

          {userDetails && !userDetails?.institute_username && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onPress={handleRemoveAccount}
              >
                <Text className="native:text-base text-destructive">
                  Remove Account
                </Text>
              </Button>
              <Separator />
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onPress={handleUserLogOut}
          >
            {loading ? (
              <ActivityIndicator size="small" color="blue" />
            ) : (
              <Text className="native:text-base text-destructive">
                Logout
              </Text>
            )}
          </Button>
        </View>
      </CustomModal>
    </View>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  menuContainer: {
    gap: 4,
  },
});
