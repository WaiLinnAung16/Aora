import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

type FormProps = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles: string;
  keyboardType: KeyboardTypeOptions;
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}: FormProps) => {
  const [isPassword, setIsPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 rounded-xl border-2 border-black-200 focus:border-secondary flex-row items-center px-3">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          keyboardType={keyboardType}
          onChangeText={handleChangeText}
          secureTextEntry={
            title === "Password" && showPassword ? !isPassword : isPassword
          }
        />

        {title === "Password" ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default FormField;
