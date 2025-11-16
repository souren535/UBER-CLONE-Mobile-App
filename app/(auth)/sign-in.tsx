import CustomButton from "@/components/customButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
export default function SignIn() {
  const [from, setFrom] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const onSignInPress = () => {
    console.log(from);
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
            title="Sign In"
            className="mt-6"
            onPress={onSignInPress}
          />
          <OAuth />
          <Link
            href="/sign-up"
            className="text-lg text-center first-letter:text-general-200 mt-10"
          >
            <Text>Don&apos;t have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
