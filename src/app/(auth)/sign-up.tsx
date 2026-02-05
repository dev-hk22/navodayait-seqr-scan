import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import axiosInstance from "@/utils/axiosInstance";
import { VERIFIER_SIGNUP } from "@/utils/routes";
import { useToast } from "react-native-toast-notifications";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { router } from "expo-router";
import { TITLES } from "@/libs/constants";

type Props = {};

type SignUpForm = {
  userFullName: string;
  userEmail: string;
  userPhone: string;
  userName: string;
  userNewPassword: string;
  userConfirmPassword: string;
};

const VERIFICATION_TYPE = [
  {
    id: 1,
    label: "OTP",
    type: 1,
  },
  {
    id: 2,
    label: "Email",
    type: 2,
  },
];

const SignUpScreen = ({}: Props) => {
  const [currentVerificationType, setCurrentVerificationType] = useState<{
    id: number;
    label: string;
    type: number;
  }>(VERIFICATION_TYPE[0]);

  const inset = useSafeAreaInsets();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      userFullName: "",
      userEmail: "",
      userName: "",
      userNewPassword: "",
      userPhone: "",
      userConfirmPassword: "",
    },
  });

  const handleUserSignUp: SubmitHandler<SignUpForm | FieldValues> = async (
    formData
  ) => {
    const signUpFormData = new FormData();

    signUpFormData.append("type", "register");
    signUpFormData.append("registration_type", "0");
    signUpFormData.append("username", formData.userName);
    signUpFormData.append("fullname", formData.userFullName);
    signUpFormData.append("password", formData.userNewPassword);
    signUpFormData.append("email_id", formData.userEmail);
    signUpFormData.append("mobile_no", formData.userPhone);
    signUpFormData.append("verify_by", currentVerificationType.type.toString());

    try {
      const pendingToastId = toast.show("Registering user... Please wait", {
        data: { status: "pending" },
      });
      const response = await axiosInstance.post(
        VERIFIER_SIGNUP,
        signUpFormData
      );

      if (response.data.status !== 200) {
        toast.update(pendingToastId, response.data.message, {
          data: response.data,
        });
        return;
      }

      toast.update(pendingToastId, response.data.message);
      toast.hide(pendingToastId);
      if (currentVerificationType.type === 1) {
        router.replace({
          pathname: "/otp-verify",
          params: {
            userPhone: formData.userPhone,
          },
        });
      } else {
        toast.show(response?.data?.message, {
          data: { type: "success" },
          placement: "top",
          duration: 4000,
        });
        router.back()
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View
        className="flex-1 p-4 bg-white"
        style={{ paddingBottom: inset.bottom }}
      >
        <KeyboardAwareScrollView bottomOffset={62}>
          <>
            <View className="mb-6">
              <Text className="text-center text-sm xs:text-base text-gray-500">
                Please complete all information to create your account on{" "}
                <Text className="font-medium">{TITLES.APP_NAME} SeQR Docs</Text>
              </Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="signUpFormText">Full Name</Text>
                <Controller
                  control={control}
                  name="userFullName"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="signUpInputs focus:signUpInputs_Focused"
                      placeholder="Enter your full name"
                      keyboardType="default"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.userFullName && <Text className="text-red-600 mt-1">This field is required</Text>}
              </View>
              <View>
                <Text className="signUpFormText">Email Address</Text>
                <Controller
                  control={control}
                  name="userEmail"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      autoCapitalize="none"
                      className="signUpInputs focus:signUpInputs_Focused"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.userEmail && (
                  <Text className="text-red-600 mt-1">
                    {errors.userEmail.message as string}
                  </Text>
                )}
              </View>
              <View>
                <Text className="signUpFormText">Phone Number</Text>
                <Controller
                  control={control}
                  name="userPhone"
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Phone number must be 10 digits',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="signUpInputs focus:signUpInputs_Focused"
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                      value={value}
                    />
                  )}
                />
                {errors.userPhone && (
                  <Text className="text-red-600 mt-1">
                    {errors.userPhone.message as string}
                  </Text>
                )}
              </View>
              <View>
                <Text className="signUpFormText">Username</Text>
                <Controller
                  control={control}
                  name="userName"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="signUpInputs focus:signUpInputs_Focused"
                      placeholder="Enter your username"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              <View>
                <Text className="signUpFormText">New Password</Text>
                <Controller
                  control={control}
                  name="userNewPassword"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="signUpInputs focus:signUpInputs_Focused"
                      placeholder="Enter your password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              <View>
                <Text className="signUpFormText">Confirm Password</Text>
                <Controller
                  control={control}
                  name="userConfirmPassword"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="signUpInputs focus:signUpInputs_Focused"
                      placeholder="Confirm your password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>

              <View className="gap-4">
                <Text className="signUpFormText">Verification: </Text>

                <RadioGroup
                  value={currentVerificationType.type.toString()}
                  onValueChange={(value) => {
                    const selectedType = VERIFICATION_TYPE.find(
                      (verification) => verification.type.toString() === value
                    );
                    if (selectedType) {
                      setCurrentVerificationType(selectedType);
                    }
                  }}
                >
                  <View className="flex-row items-center gap-2 justify-around">
                    {VERIFICATION_TYPE.map((verification) => (
                      <View
                        key={verification.id}
                        className="flex-row items-center gap-2"
                      >
                        <RadioGroupItem
                          aria-labelledby={`label-for-${verification.type.toString()}`}
                          value={verification.type.toString()}
                        />
                        <Label
                          nativeID={`label-for-${verification.label}`}
                          onPress={() =>
                            setCurrentVerificationType(verification)
                          }
                        >
                          {verification.label}
                        </Label>
                      </View>
                    ))}
                  </View>
                </RadioGroup>
              </View>
            </View>
          </>
        </KeyboardAwareScrollView>

        <View className="mt-auto android:mb-6">
          <Button onPress={handleSubmit(handleUserSignUp)}>
            <Text>Sign Up</Text>
          </Button>
        </View>
      </View>
      <KeyboardToolbar />
    </>
  );
};

export default SignUpScreen;
