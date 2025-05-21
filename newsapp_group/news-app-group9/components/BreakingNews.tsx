import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, ViewToken } from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import SliderItem from '@/components/SliderItem';
import Pagination from '@/components/Pagination';
import { Colors } from '@/constants/Colors';
import { NewsDataType } from '@/types';

type Props = {
  newsList: NewsDataType[];
};

const BreakingNews = ({ newsList }: Props) => {
  const { width } = useWindowDimensions();
const data = newsList.length > 0 ? [...newsList, newsList[0]] : [];

  const ref = useAnimatedRef<Animated.FlatList<any>>();
  const scrollX = useSharedValue(0);
  const offset = useSharedValue(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const [paginationIndex, setPaginationIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Scroll handler with runOnJS to update paginationIndex on UI thread safely
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      offset.value = event.contentOffset.x;
      // Calculate current index after momentum ends
      const index = Math.round(event.contentOffset.x / width);

      if (index === data.length - 1) {
        // If on cloned slide, jump back to real first slide WITHOUT animation
        scrollTo(ref, 0, 0, false);
        offset.value = 0;

        // Update pagination dot to 0 on UI thread
        runOnJS(setPaginationIndex)(0);
      } else {
        runOnJS(setPaginationIndex)(index);
      }
    },
  });

  // Autoplay effect
  useEffect(() => {
    if (!isAutoPlay) {
      if (interval.current) clearInterval(interval.current);
      return;
    }

    interval.current = setInterval(() => {
      // Calculate current index
      const currentIndex = Math.round(offset.value / width);
      let nextIndex = currentIndex + 1;

      if (nextIndex >= data.length) {
        // jump to 0 first without animation
        nextIndex = 1;
        offset.value = 0;
        scrollTo(ref, 0, 0, false);
      }

      offset.value = nextIndex * width;
      scrollTo(ref, offset.value, 0, true);
      runOnJS(setPaginationIndex)(nextIndex === data.length - 1 ? 0 : nextIndex);
    }, 4000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [isAutoPlay, width, data.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length === 0) return;
    let index = viewableItems[0].index ?? 0;
    if (index === data.length - 1) {
      index = 0; // clone slide => dot 0
    }
    setPaginationIndex(index);
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breaking News</Text>
      <View style={styles.slideWrapper}>
        <Animated.FlatList
          ref={ref}
          data={data}
          keyExtractor={(_, index) => `list_items_${index}`}
          renderItem={({ item, index }) => (
            <SliderItem slideItem={item} index={index} scrollX={scrollX} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScrollHandler}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => setIsAutoPlay(false)}
          onScrollEndDrag={() => setIsAutoPlay(true)}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged.current}
        />
        <Pagination items={newsList} paginationIndex={paginationIndex} scrollX={scrollX}/>
      </View>
    </View>
  );
};

export default BreakingNews;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    height: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
  },
  slideWrapper: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
  },
});
