import { View, Text, Image, ScrollView, Button } from "react-native";
import React from "react";
import { images } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalContext";

const index = () => {
  const { isLoading, isLoggined } = useGlobalContext();
  if (!isLoading && isLoggined) return <Redirect href={"/home"} />;
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[90vh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="w-full max-w-[380px] h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-white font-bold text-3xl text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -right-8 -bottom-2"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/(auth)/sign-in")}
            containerStyles={"w-full mt-7"}
            isLoading={false}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default index;
