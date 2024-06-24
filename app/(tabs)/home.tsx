import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import useAppWrite from "@/hooks/useAppWrite";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { VideoProps } from "@/types";
import { useGlobalContext } from "@/context/GlobalContext";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppWrite<VideoProps[]>(getAllPosts);
  const { data: latestPosts } = useAppWrite<VideoProps[]>(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, [router]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-3">
            <View className="mb-6 flex-row justify-between items-start">
              <View className="space-y-2">
                <Text className="text-base font-pregular text-gray-200">
                  Welcome Back
                </Text>
                <Text className="text-white text-xl font-psemibold">
                  {user?.username}
                </Text>
              </View>
              <View>
                <Image
                  source={images.logoSmall}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput initialInput="" placeholder="Search Videos" />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className=" text-gray-100 text-lg font-pregular mb-3">
                Trending Video
              </Text>
              <Trending posts={latestPosts || []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload video."
            btnTitle="Create Video"
            handlePress={() => router.push("/create")}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
