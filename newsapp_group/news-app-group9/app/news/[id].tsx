import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { NewsDataType } from '@/types';
import Loading from '@/components/Loading';
import { Colors } from '@/constants/Colors';
import base64 from 'base-64';
import { generateArticleId } from '@/constants/article';
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewsDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<NewsDataType | null>(null);
  const { id } = useLocalSearchParams();
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    if (id) getNews();
  }, [id]);

  useEffect(() => {
    if (!isLoading && news) {
      checkBookmark(news.article_id);
    }
  }, [isLoading, news]);

  const getNews = async () => {
    setIsLoading(true);
    try {
      let decodedId = '';
      try {
        decodedId = base64.decode(id as string);
      } catch (e) {
        console.error('❌ Failed to decode article ID:', id);
        return;
      }

      const URL = 'https://newsapi.org/v2/top-headlines?apiKey=c018de97b9e04d388f8fba2b1c3ce86e&country=us';
      const response = await axios.get(URL);

      if (response?.data?.articles) {
        const mappedResults: NewsDataType[] = response.data.articles.map((item: any, index: number) => ({
          article_id: generateArticleId(item.source?.name || null, item.publishedAt || null, index),
          title: item.title,
          image_url: item.urlToImage,
          source_name: item.source?.name || '',
          source_icon: '',
          published_at: item.publishedAt,
          description: item.description,
          content: item.content,
          link: item.url,
          category: '',
        }));

        const selectedNews = mappedResults.find(item => item.article_id === decodedId) || null;
        setNews(selectedNews);
      }
    } catch (err) {
      console.error('❌ Error fetching article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBookmark = async (article: NewsDataType) => {
    try {
      setBookmark(true);
      const token = await AsyncStorage.getItem("bookmark");
      const existing = token ? JSON.parse(token) : [];
      const exists = existing.find((item: NewsDataType) => item.article_id === article.article_id);
      if (!exists) {
        existing.push(article);
        await AsyncStorage.setItem("bookmark", JSON.stringify(existing));
      }
    } catch (err) {
      console.error("❌ Failed to save bookmark:", err);
    }
  };

  const removeBookmark = async (articleId: string) => {
    try {
      setBookmark(false);
      const token = await AsyncStorage.getItem("bookmark");
      const existing = token ? JSON.parse(token) : [];
      const updated = existing.filter((item: NewsDataType) => item.article_id !== articleId);
      await AsyncStorage.setItem("bookmark", JSON.stringify(updated));
    } catch (err) {
      console.error("❌ Failed to remove bookmark:", err);
    }
  };

  const checkBookmark = async (articleId: string) => {
    try {
      const token = await AsyncStorage.getItem("bookmark");
      const existing = token ? JSON.parse(token) : [];
      const found = existing.find((item: NewsDataType) => item.article_id === articleId);
      setBookmark(!!found);
    } catch (err) {
      console.error("❌ Failed to check bookmark:", err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          headerRight: () =>
            news ? (
              <TouchableOpacity
                onPress={() =>
                  bookmark
                    ? removeBookmark(news.article_id)
                    : saveBookmark(news)
                }
              >
                <Ionicons
                  name={bookmark ? "heart" : "heart-outline"}
                  size={22}
                  color={bookmark ? "red" : Colors.black}
                />
              </TouchableOpacity>
            ) : null,
          title: '',
        }}
      />
      {isLoading ? (
        <Loading size="large" />
      ) : news ? (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{news.title}</Text>
          <View style={styles.newsInfoWrapper}>
            <Text style={styles.newsInfo}>
              {news.published_at
                ? new Date(news.published_at).toLocaleDateString()
                : 'N/A'}
            </Text>
            <Text style={styles.newsInfo}>{news.source_name}</Text>
          </View>
          {news.image_url ? (
            <Image source={{ uri: news.image_url }} style={styles.newsImg} />
          ) : null}
          <Text style={styles.content}>
            {news.content || news.description || 'No content available.'}
          </Text>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.noArticle}>Article not found.</Text>
        </View>
      )}
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: Colors.black,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.darkGrey,
  },
  noArticle: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 40,
  },
  newsImg: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  newsInfo: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  newsInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
