import { View, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

type Props = {
  initialInput: string | undefined;
  placeholder: string;
};

const SearchInput: React.FC<Props> = ({ initialInput, placeholder }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialInput || "");
  
  return (
    <View className="w-full h-16 rounded-xl border-2 border-black-200 focus:border-secondary flex-row items-center px-3">
      <TextInput
        className="flex-1 text-white font-psemibold text-base"
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        value={query}
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing Query!",
              "Please input something to search results."
            );
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else if (pathname.startsWith("/saved")) {
            router.push({
              pathname: `/search/${query}`,
              params: { routeName: "saved" },
            });
          } else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
