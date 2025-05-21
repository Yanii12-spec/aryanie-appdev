import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NewsDataType } from '@/types'
import Animated, { interpolate, SharedValue, useAnimatedStyle, Extrapolation } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router'
import { encode as btoa } from 'base-64';

type Props = {
  slideItem: NewsDataType | undefined, // add undefined to be safe
  index: number,
  scrollX: SharedValue<number>
}

const { width } = Dimensions.get('screen')

const SliderItem = ({ slideItem, index, scrollX }: Props) => {
  if (!slideItem) {
    return null; // return null if slideItem is missing
  }

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.15, 0, width * 0.15],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width], 
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  console.log("slideItem.article_id", slideItem.article_id);

  return (
    <Link
      href={{
        pathname: "/news/[id]",
        params: { id: btoa(slideItem.article_id) },
      }}
      asChild
    >
      <TouchableOpacity>
        <Animated.View style={[styles.itemWrapper, rnStyle]} key={slideItem.article_id}>
          {slideItem.image_url ? (
            <Image source={{ uri: slideItem.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={{ color: '#fff' }}>No Image</Text>
            </View>
          )}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.background}>
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceName}>{slideItem.source_name}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>{slideItem.title}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
}

export default SliderItem

const styles = StyleSheet.create({
  itemWrapper: {
    position: 'relative',
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 60,
    height: 180,
    borderRadius: 20,
  },
  placeholder: {
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 30,
    right: 0,
    top: 0,
    width: width - 60,
    height: 180,
    borderRadius: 20,
    padding: 2,
  },
  sourceInfo: {
    flexDirection: 'row',
    position: 'absolute',
    top: 85,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  sourceName: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    color: Colors.white,
    position: 'absolute',
    top: 120,
    paddingHorizontal: 20,
    fontWeight: '600',
  },
})
