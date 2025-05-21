import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Loading from '@/components/Loading';
import { NewsDataType } from '@/types';
import { decode as atob } from 'base-64';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const normalize = (str: string) => (str ? str.trim().toLowerCase() : '');

const NewsDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<NewsDataType | null>(null);
  const { id } = useLocalSearchParams();
  const decodedId = atob(id as string);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    try {
      const URL = `https://newsapi.org/v2/top-headlines?apiKey=c018de97b9e04d388f8fba2b1c3ce86e&country=us`;
      const response = await axios.get(URL);

      if (response?.data?.articles) {
        const mappedResults: NewsDataType[] = response.data.articles.map((item: any, index: number) => {
          const article_id = `${normalize(item.source?.name || '')}-${normalize(item.publishedAt || '')}`;
          return {
            article_id,
            title: item.title,
            image_url: item.urlToImage,
            source_name: item.source?.name || '',
            published_at: item.publishedAt,
            description: item.description,
            content: item.content,
            link: item.url,
            category: '',
            source_icon: '',
          };
        });

        mappedResults.forEach((item) => {
          console.log('Mapped article_id:', item.article_id);
        });
        console.log('Decoded id:', decodedId);

        const selectedNews = mappedResults.find((item) => item.article_id === decodedId);

        if (selectedNews) {
          setNews(selectedNews);
        } else {
          setNews(null);
        }
      }
    } catch (error: any) {
      console.log('Error fetching news:', error.message);
    } finally {
      setIsLoading(false);
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
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart-outline" size={22} />
            </TouchableOpacity>
          ),
          title: '',
        }}
      />

      {isLoading ? (
        <Loading size="large" />
      ) : news ? (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>{news.title}</Text>
          <Text style={styles.newsInfo}>{news.published_at}</Text>
          <Text style={styles.newsInfo}>{news.source_name}</Text>
          <Image source={{ uri: news.image_url }} style={styles.newsImg} />
          <Text style={styles.content}>{news.content || news.description || 'No content available.'}</Text>
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
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 15, color: Colors.black },
  newsInfo: { fontSize: 12, color: Colors.darkGrey, marginBottom: 10 },
  newsImg: { width: '100%', height: 300, marginBottom: 20, borderRadius: 10 },
  content: { fontSize: 16, lineHeight: 24 },
  noArticle: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 40 },
});
