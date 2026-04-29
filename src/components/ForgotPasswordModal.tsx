import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Controller, useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";
import { useToast } from "react-native-toast-notifications";
import axiosInstance from "@/utils/axiosInstance";
import { VERIFIER_RESET_PASSWORD } from "@/utils/routes"
import CustomModal from "./ui/CustomModal";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ResetFormData = {
  userEmail: string;
};

const ForgotPasswordModal = ({ visible, onClose }: Props) => {
  const toast = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    mode: "onChange",
    defaultValues: {
      userEmail: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordChange: SubmitHandler<ResetFormData | FieldValues> = async (formData) => {
    setLoading(true);

    const passwordChangeFormData = new FormData();
    passwordChangeFormData.append("type", "forgotPassword");
    passwordChangeFormData.append("email_id", formData.userEmail);
    // @ts-ignore
    passwordChangeFormData.append("user_type", 1);

    try {
      const response = await axiosInstance.post(VERIFIER_RESET_PASSWORD, passwordChangeFormData);

      if (response.data.status !== 200) {
        toast.show(response.data.message);
      } else {
        toast.show(response.data.message);
        onClose(); // close modal on success
      }
    } catch (error) {
      console.log("CATCH_ERROR_PASSWORD_CHANGE", error);
      toast.show("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Forgot Password?">
      <View>
        <Text className="text-muted-foreground mb-2">
          No worries, we will send you reset instructions
        </Text>

        <Controller
          control={control}
          name="userEmail"
          rules={{
            required: "Please enter your email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              // className="signUpInputs focus:signUpInputs_Focused"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoFocus
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        {errors.userEmail && (
          <Text className="text-destructive mt-1">
            {errors.userEmail.message}
          </Text>
        )}

        <Button
          className="mt-4"
          onPress={handleSubmit(handlePasswordChange)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white">OK</Text>
          )}
        </Button>
      </View>
    </CustomModal>
  );
};

export default ForgotPasswordModal;
