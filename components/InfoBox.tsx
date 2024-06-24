import { View, Text } from "react-native";
import React from "react";

type InfoBoxProps = {
  title: string | number;
  containerStyles?: string;
  titleStyles?: string;
  subtitle?: string;
};

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  containerStyles,
  titleStyles,
  subtitle,
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
