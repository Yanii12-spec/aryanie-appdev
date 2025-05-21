import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { NewsDataType } from '@/types';
import { Colors } from '@/constants/Colors';
import Loading from './Loading';
import { Link } from 'expo-router';
import { encode as btoa } from 'base-64';
  import { generateArticleId } from '@/constants/article';


type Props = {
  newsList: Array<NewsDataType>;
  category: string;
};

const safeEncode = (str: string) => btoa(str); 

const sourceIcons: { [key: string]: string } = {
  CNN: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/1200px-CNN.svg.png",
  "BBC News": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/BBC_News.svg/1200px-BBC_News.svg",
  Reuters: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Reuters_Logo.svg/1200px-Reuters_Logo.svg.png",
  "The Verge": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/The_Verge_logo.svg/1200px-The_Verge_logo.svg.png",
  "Associated Press": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Associated_Press_logo_2012.svg/1200px-Associated_Press_logo_2012.svg.png",
};

const NewsList = ({ newsList, category }: Props) => {
  return (
    <View style={styles.container}>
      {newsList.length === 0 ? (
        <Loading size="large" />
      ) : (
        <>
          {newsList.map((item, index) => {
            const iconUri = sourceIcons[item.source_name] || 'https://via.placeholder.com/20';

            // Create consistent article_id here if not provided
            const articleId = generateArticleId(item.source_name, item.published_at, index);

            return (
              <Link
                key={articleId}
                href={{
                  pathname: "/news/[id]",
                  params: { id: safeEncode(articleId), category },
                }}
                asChild
              >
                <TouchableOpacity>
                  <NewsItem item={item} category={category} iconUri={iconUri}  />
                </TouchableOpacity>
              </Link>
            );
          })}
        </>
      )}
    </View>
  );
};



export default NewsList;

export const NewsItem = ({item, iconUri, category}: {item: NewsDataType; category: string; iconUri:string}) => {
  return (
    <View style={styles.itemContainer}>
    <Image source={{ uri: item.image_url }} style={styles.itemImg} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemCategory}>{category.toUpperCase()}</Text>
                      <View style={styles.itemSourceInfo}>
                        <Image source={{ uri: iconUri }} style={styles.itemSourceImg} />
                        <Text style={styles.itemSourceName}>{item.source_name}</Text>
                    </View>
                  </View>
                  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flex: 1,
    gap: 10,
  },
  itemImg: {
    width: 90,
    height: 100,
    borderRadius: 20,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    gap: 10,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.black,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.darkGrey,
    textTransform: 'capitalize',
  },
  itemSourceInfo: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  itemSourceImg: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  itemSourceName: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.darkGrey,
  },
});
