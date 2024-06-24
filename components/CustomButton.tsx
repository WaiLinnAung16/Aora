import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";

type ButtonProps = {
  title: string;
  icon?: ImageSourcePropType | undefined;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading: boolean;
};

const CustomButton = ({
  title,
  icon,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center flex-row ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {icon && (
        <Image
          source={icon}
          className="w-4 h-4 border border-red-600"
          resizeMode="contain"
        />
      )}
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
