import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { NewsDataType } from "@/types";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { NewsItem } from "@/components/NewsList";

// Utility function to safely encode the article ID
const safeEncode = (value: string) => {
  return encodeURIComponent(Buffer.from(value).toString("base64"));
};

const Page = () => {
  const { query, category, country } = useLocalSearchParams<{
    query: string;
    category: string;
    country: string;
  }>();

  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    try {
      const categoryString = category ? `&category=${category}` : '';
      const countryString = country ? `&country=${country}` : '';
      const queryString = query ? `&q=${query}` : '';

      const URL = `https://newsapi.org/v2/top-headlines?pageSize=10&apiKey=c018de97b9e04d388f8fba2b1c3ce86e${categoryString}${countryString}${queryString}`;

      const response = await axios.get(URL);

      if (response?.data?.articles) {
        const mappedResults: NewsDataType[] = response.data.articles.map((item: any, index: number) => ({
          article_id: `${item.source?.id || item.source?.name || `source-${index}`}-${item.publishedAt || `time-${index}`}`,
          title: item.title,
          image_url: item.urlToImage,
          source_name: item.source.name,
          source_icon: '', // You can customize this based on source
          published_at: item.publishedAt,
          description: item.description,
          content: item.content,
          link: item.url,
          category: category,
        }));
        setNews(mappedResults);
      }
    } catch (err: any) {
      console.log('Error fetching news:', err.message);
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
          title: "Search",
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading size="large" />
        ) : (
          <FlatList
            data={news}
            keyExtractor={(item, index) => `list_items_${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const articleId = item.article_id;
              const encodedId = safeEncode(articleId);
              const iconUri = ''; // Set this if you have logic for custom icons per source

              return (
                <Link
                  href={{
                    pathname: "/news/[id]",
                    params: { id: encodedId, category },
                  }}
                  asChild
                >
                  <TouchableOpacity>
                    <NewsItem item={item} category={category} iconUri={iconUri} />
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
    marginHorizontal: 20,
    marginVertical: 20,
  },
});
