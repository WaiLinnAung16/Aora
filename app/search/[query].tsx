import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import useAppWrite from "@/hooks/useAppWrite";
import { searchSavedVideos, serachPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { VideoProps } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";

const Search = () => {
  const { query, routeName }: Partial<{ query: string; routeName: string }> =
    useLocalSearchParams();
  const { user } = useGlobalContext();

  const { data: posts, refetch } = useAppWrite<VideoProps[] | undefined>(() => {
    if (routeName) {
      return searchSavedVideos(query, user?.$id);
    } else {
      return serachPosts(query);
    }
  });

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className="space-y-2 mb-3">
              <Text className="text-base font-pregular text-gray-200">
                Search Results
              </Text>
              <Text className="text-white text-xl font-psemibold">{query}</Text>
            </View>
            <SearchInput initialInput={query} placeholder="Search Videos" />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found with this serach query."
            btnTitle="Back to Explore"
            handlePress={() => router.back()}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
