import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import useAppWrite from "@/hooks/useAppWrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { VideoProps } from "@/types";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";

const Profile = () => {
  const { user, setUser, setIsLoggined } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const { data: posts, refetch } = useAppWrite<VideoProps[]>(() =>
    getUserPosts(user?.$id)
  );

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggined(false);
    router.replace("/sign-in");
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
            btnTitle="Back to Explore"
            handlePress={() => router.push("/home")}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
