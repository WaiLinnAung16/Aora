import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import useAppWrite from "@/hooks/useAppWrite";
import { getSavedVideo } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { VideoProps } from "@/types";
import { useGlobalContext } from "@/context/GlobalContext";
import { useFocusEffect, useRouter } from "expo-router";

const Saved = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppWrite<VideoProps[] | undefined>(() =>
    getSavedVideo(user?.$id)
  );
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refreshing])
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-3">
            <View className="mb-6 flex-row justify-between items-start">
              <Text className="text-2xl font-psemibold text-gray-200">
                Saved Video
              </Text>
            </View>
            <SearchInput
              placeholder="Search for your saved videos"
              initialInput=""
            />
          </View>
        )}
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

export default Saved;
