import CustomButton from "@/components/customButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import ReactNativeModal from "react-native-modal";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [Verification, setVerification] = useState({
    state: "pending",
    error: "",
    code: "",
  });
  const [code, setCode] = useState("");
  const [from, setFrom] = useState<{
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

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: from.email,
        password: from.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({ ...Verification, state: "pending" });
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: Verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...Verification, state: "success" });
        router.replace("/");
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
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  if (Verification.state === "pending") {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </>
    );
  }
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
            icon={icons.person}
            value={from.name}
            onChangeText={(e: string) => {
              setFrom({ ...from, name: e });
            }}
          />

          <InputField
            label="Email"
            placeholder="Enter your Email"
            icon={icons.email}
            value={from.email}
            onChangeText={(e: string) => {
              setFrom({ ...from, email: e });
            }}
          />

          <InputField
            label="password"
            placeholder="Password"
            icon={icons.lock}
            secureTextEntry={true}
            value={from.password}
            onChangeText={(e: string) => {
              setFrom({ ...from, password: e });
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

        {/* verification modal */}
        <ReactNativeModal className="rounded-xl" isVisible={Verification.state === "success"}>
          <View className="bg-white p-5 rounded-20">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl text-black font-JakartaBold text-center">
              verified
            </Text>
            <Text className="text-base text-gray-500 text-center">
              You have successfully verified your account
            </Text>
            <CustomButton
              title="Browse Home"
              className="mt-5"
              onPress={() => router.replace("/(root)/(tabs)/home")}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}
