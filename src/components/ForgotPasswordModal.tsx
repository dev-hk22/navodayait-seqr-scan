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
  const [apiError, setApiError] = useState<string>("");

  const handlePasswordChange: SubmitHandler<ResetFormData | FieldValues> = async (formData) => {
    setLoading(true);
    setApiError(""); // Clear previous API errors

    const passwordChangeFormData = new FormData();
    passwordChangeFormData.append("type", "forgotPassword");
    passwordChangeFormData.append("email_id", formData.userEmail);
    // @ts-ignore
    passwordChangeFormData.append("user_type", 1);

    try {
      const response = await axiosInstance.post(VERIFIER_RESET_PASSWORD, passwordChangeFormData);

      if (response.data.status !== 200) {
        const errorMessage = response.data.message || response?.data?.errors?.email_id || "Something went wrong";
        setApiError(errorMessage);
        toast.show(errorMessage, {
          type: 'danger'
        });
      } else {
        toast.show(response.data.message,{
          type: 'success'
        });
        onClose(); // close modal on success
      }
    } catch (error) {
      console.log("CATCH_ERROR_PASSWORD_CHANGE", error);
      const errorMessage = "Something went wrong. Please try again.";
      setApiError(errorMessage);
      toast.show(errorMessage);
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
              onChangeText={(text) => {
                onChange(text);
                if (apiError) setApiError(""); // Clear API error on input change
              }}
            />
          )}
        />

        {errors.userEmail && (
          <Text className="text-destructive mt-1">
            {errors.userEmail.message}
          </Text>
        )}

        {apiError && (
          <Text className="text-destructive mt-1">
            {apiError}
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
