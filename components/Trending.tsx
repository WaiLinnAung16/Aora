import {
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { VideoProps } from "@/types";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

interface TrendingProps {
  posts: VideoProps[];
}

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: string;
  item: VideoProps;
}) => {
  const [play, setPlay] = useState(false);
  const isActive = activeItem === item.$id;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isActive ? 1 : 0.8) }],
    };
  }, [isActive]);
 
  return (
    <Animated.View style={[animatedStyle, { marginRight: 12 }]}>
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay={true}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.6}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<string>(posts[0]?.$id);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key as string);
    }
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <TrendingItem item={item} activeItem={activeItem} />
      )}
      keyExtractor={(item) => item.$id}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 150, y: 0 }}
      horizontal
    />
  );
};

export default Trending;
