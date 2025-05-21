import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import axios from 'axios';
import { NewsDataType } from '@/types';
import BreakingNews from '@/components/BreakingNews';
import Categories from '@/components/Categories';
import NewsList from '@/components/NewsList';
import Loading from '@/components/Loading';

const Page = () => {
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    getBreakingNews();
    getNews();
  }, []);

  const getNews = async (category: string = '') => {
    try {
      const URL = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=10&apiKey=c018de97b9e04d388f8fba2b1c3ce86e`;
      const response = await axios.get(URL);
      if (response?.data?.articles) {
        const mappedResults = response.data.articles.map((item: any, index: number) => ({
          article_id: encodeURIComponent(item.source?.id || item.source?.name || `source-${index}`) +
                      '-' + encodeURIComponent(item.publishedAt || `time-${index}`),
          title: item.title,
          image_url: item.urlToImage,
          source_name: item.source.name,
          source_icon: '',
          published_at: item.publishedAt,
          description: item.description,
          content: item.content,
          link: item.url,
          category: item.category,
        }));
        setNews(mappedResults);
      }
    } catch (err) {
      console.log('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBreakingNews = async (category: string = '') => {
    try {
      const categoryString = category ? `&category=${category}` : '';
      const URL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=c018de97b9e04d388f8fba2b1c3ce86e${categoryString}`;
      const response = await axios.get(URL);
      if (response?.data?.articles) {
        const mappedResults = response.data.articles.map((item: any, index: number) => ({
          article_id: encodeURIComponent(item.source?.id || item.source?.name || `source-${index}`) +
                      '-' + encodeURIComponent(item.publishedAt || `time-${index}`),
          title: item.title,
          image_url: item.urlToImage,
          source_name: item.source.name,
          source_icon: '',
          published_at: item.publishedAt,
          description: item.description,
          content: item.content,
          link: item.url,
          category: item.category,
        }));
        setBreakingNews(mappedResults);
      }
    } catch (err) {
      console.log('Error fetching breaking news:', err);
    }
  };

  const onCatChanged = (category: string) => {
    setSelectedCategory(category);
    setNews([]);
    getBreakingNews(category);
    getNews(category);
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
  <SearchBar
  withHorizontalPadding={true}
  setSearchQuery={setSearchQuery}
/>      {isLoading ? <Loading size="large" /> : <BreakingNews newsList={breakingNews} />}
      <Categories onCategoryChanged={onCatChanged} />
      <NewsList newsList={news} category={selectedCategory} />
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});