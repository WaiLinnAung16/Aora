import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { VideoCardProps } from "@/types";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "@/context/GlobalContext";
import { addSaved, deletePost, getSavedVideo } from "@/lib/appwrite";

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const {
    title,
    thumbnail,
    video: videoUrl,
    creators: { username, avatar },
    favourite,
  } = video;
  const [play, setPlay] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useGlobalContext();
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Add Video to Saved
  const handleAddSaved = async () => {
    try {
      setIsLoading(true);
      await addSaved(video.$id, user?.$id);
      setIsAdded(!isAdded);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsShow(false), 1000);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsLoading(true);
      await deletePost(video.$id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsShow(false), 1000);
    }
  };

  useEffect(() => {
    if (user && favourite) {
      setIsAdded(favourite.includes(user.$id));
    }
  }, []);

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              numberOfLines={1}
              className="text-white font-psemibold text-sm"
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-gray-100 text-xs font-pregular"
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2 relative">
          <TouchableOpacity onPress={() => setIsShow(!isShow)}>
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Add to Favourite button */}
          {isShow ? (
            <View className="gap-3 w-[100px] absolute top-12 right-2 z-20 rounded bg-black-200 px-3">
              <CustomButton
                title={isAdded ? "Saved" : "Save"}
                containerStyles="min-h-[35px] bg-black-200 "
                textStyles="text-sm  text-white"
                handlePress={handleAddSaved}
                isLoading={isLoading}
              />
              <CustomButton
                title={"Delete"}
                containerStyles="min-h-[35px] bg-black-200 "
                textStyles="text-sm  text-white"
                handlePress={handleDeletePost}
                isLoading={isLoading}
              />
            </View>
          ) : null}
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: videoUrl }}
          className="w-full h-60 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.COVER}
          shouldPlay
          useNativeControls
          isLooping
          onPlaybackStatusUpdate={(video) => {
            if (video.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
