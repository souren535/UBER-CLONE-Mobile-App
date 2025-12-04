import CustomButton from "@/components/customButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [Verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...Verification, state: "pending" });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: Verification.code,
      });

      if (signUpAttempt.status === "complete") {
        // Create user in database
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdSessionId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        await setActive({ session: signUpAttempt.createdSessionId });

        // Update verification state to success
        setVerification({ ...Verification, state: "success" });
      } else {
        setVerification({
          ...Verification,
          error: "Verification failed",
          state: "error",
        });
      }
    } catch (err: any) {
      setVerification({
        ...Verification,
        error:
          err?.errors?.[0]?.longMessage ||
          err?.message ||
          "Verification failed",
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[200px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            placeholderTextColor="#999"
            icon={icons.person}
            value={form.name}
            onChangeText={(e: string) => {
              setForm({ ...form, name: e });
            }}
          />

          <InputField
            label="Email"
            placeholder="Enter your Email"
            placeholderTextColor="#999"
            icon={icons.email}
            value={form.email}
            onChangeText={(e: string) => {
              setForm({ ...form, email: e });
            }}
          />

          <InputField
            label="password"
            placeholder="Password"
            placeholderTextColor="#999"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(e: string) => {
              setForm({ ...form, password: e });
            }}
          />

          <CustomButton
            title="Sign Up"
            className="mt-6"
            onPress={onSignUpPress}
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center first-letter:text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Sign In</Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal
          isVisible={Verification.state === "pending"}
          onModalHide={() => {
            // When verification modal closes and state is success, show success modal
            if (Verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
          useNativeDriverForBackdrop={true}
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          hideModalContentWhileAnimating={true}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-3">
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              placeholderTextColor="#999"
              value={Verification.code}
              keyboardType="numeric"
              onChangeText={(code) => {
                setVerification({ ...Verification, code });
              }}
            />
            {Verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {Verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        {/* Success Modal */}
        <ReactNativeModal
          isVisible={showSuccessModal}
          useNativeDriverForBackdrop={true}
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          hideModalContentWhileAnimating={true}
        >
          <View className="bg-white p-5 rounded-20">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl text-black font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-500 text-center">
              You have successfully verified your account
            </Text>
            <CustomButton
              title="Browse Home"
              className="mt-5"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}
