import React from "react";
import { Tabs } from "expo-router";
import { Image, ImageProps, Text, View } from "react-native";
import { icons } from "../../constants";

type TabIconProps = {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className="justify-center items-center gap-2">
      <Image
        source={icon}
        className="w-6 h-6"
        resizeMode="contain"
        tintColor={color}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-sm`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown:false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#cdcde0",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#232533",
          backgroundColor: "#161622",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name={"Home"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              name={"Create"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name={"Profile"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.bookmark}
              color={color}
              name={"Saved"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
