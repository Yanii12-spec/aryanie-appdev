import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Stack } from 'expo-router';
import Loading from '@/components/Loading';
import { FlatList } from 'react-native';
import { NewsItem } from '@/components/NewsList';
import { useIsFocused } from '@react-navigation/native';
import { safeEncode } from '@/constants/article';
import { NewsDataType } from '@/types';

const Page = () => {
  const [bookmarkNews, setBookmarkNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchBookmark();
  }, [isFocused]);

  const fetchBookmark = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('bookmark');
      const res = token ? JSON.parse(token) : [];
      setBookmarkNews(res);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true }} />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={'large'} />
        ) : (
          <FlatList
            data={bookmarkNews}
            keyExtractor={(item, index) => `list_items_${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const encodedId = safeEncode(item.article_id);
              const iconUri = ''; // optional custom icon logic

              return (
                <Link
                  href={{
                    pathname: "/news/[id]",
                    params: { id: encodedId, category: item.category },
                  }}
                  asChild
                >
                  <TouchableOpacity>
                    <NewsItem item={item} category={item.category} iconUri={iconUri} />
                  </TouchableOpacity>
                </Link>
              );
            }}
          />
        )}
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});
