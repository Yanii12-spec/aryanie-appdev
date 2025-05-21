import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import  SearchBar  from "@/components/SearchBar"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import newsCategoryList from '@/constants/Categories'
import CheckBox from '@/components/CheckBox'
import { useNewsCategories } from '@/hooks/useNewsCategories'
import { useNewsCountries } from '@/hooks/useNewsCountry'
import { Link } from 'expo-router'

type Props = {}

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  
  const {newsCategories, toggleNewsCategory} = useNewsCategories();
  const {newsCountries, toggleNewsCountry} = useNewsCountries();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
 
  return (
    <View style={[styles.container,{paddingTop:safeTop + 20}]}>
      <SearchBar withHorizontalPadding={false} setSearchQuery={setSearchQuery}/>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.listContainer}>
        {newsCategories.map((item) => (
          <CheckBox key={item.id} label={item.title} checked={item.selected} onPress={() => {
            toggleNewsCategory(item.id)
            setCategory(item.slug);
          }} />
        ))}

      </View>

      <Text style={styles.title}>Country</Text>
      <View style={styles.listContainer}>
        {newsCountries.map((item, index) => (
          <CheckBox key={index} 
          label={item.name} 
          checked={item.selected} 
          onPress={() => {
          toggleNewsCountry(index)
          setCountry(item.code);
          }} />
        ))}

      </View>
      
      <Link href={{
                  pathname: '/news/search',
                  params: {query: searchQuery, category, country}
        }} asChild>
      <TouchableOpacity style={styles.searchBtn}>
        <Text style={styles.searchBtnTxt}>Search</Text>
      </TouchableOpacity>
      </Link>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 10,
  },
  listContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
    marginBottom: 20
  },
  searchBtn: {
    backgroundColor: Colors.tint,
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginVertical: 10

  },
  searchBtnTxt:{
    color: Colors.white,
    fontSize:16,
    fontWeight: '600'
  }
})