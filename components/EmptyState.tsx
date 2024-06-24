import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";

const EmptyState = ({
  title,
  subtitle,
  btnTitle,
  handlePress,
}: {
  title: string;
  subtitle: string;
  btnTitle: string;
  handlePress: () => void;
}) => {
  return (
    <View className="items-center px-4">
      <Image
        source={images.empty}
        className="w-[216px] h-[150px]"
        resizeMode="contain"
      />
      <View className="items-center space-y-2">
        <Text className="text-white text-xl font-psemibold">{title}</Text>
        <Text className="text-base font-pregular text-gray-100">
          {subtitle}
        </Text>
      </View>
      <CustomButton
        title={btnTitle}
        handlePress={handlePress}
        isLoading={false}
        containerStyles="w-full mt-3"
      />
    </View>
  );
};

export default EmptyState;
