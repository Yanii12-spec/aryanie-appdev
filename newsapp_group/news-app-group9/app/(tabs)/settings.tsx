import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { Switch, TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

type Props = {}

const Page = (props: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled ((previousState) => !previousState);
  return (
    <>
    <Stack.Screen options = {{
      headerShown: true
    }} />
    <View style={styles.container}>
     <TouchableOpacity style={styles.itemBtn}>
      <Text style={styles.itemBtnTxt}>About</Text>
      <MaterialIcons name='arrow-forward-ios' size={16} color={Colors.lightGrey}/>
     </TouchableOpacity>
      <TouchableOpacity style={styles.itemBtn}>
      <Text style={styles.itemBtnTxt}>Send Feedback</Text>
      <MaterialIcons name='arrow-forward-ios' size={16} color={Colors.lightGrey}/>
     </TouchableOpacity>
      <TouchableOpacity style={styles.itemBtn}>
      <Text style={styles.itemBtnTxt}>Privacy Policy</Text>
      <MaterialIcons name='arrow-forward-ios' size={16} color={Colors.lightGrey}/>
     </TouchableOpacity>
      <TouchableOpacity style={styles.itemBtn}>
      <Text style={styles.itemBtnTxt}>Terms of Conditions</Text>
      <MaterialIcons name='arrow-forward-ios' size={16} color={Colors.lightGrey}/>
     </TouchableOpacity>
      <TouchableOpacity style={styles.itemBtn} onPress={toggleSwitch}>
      <Text style={styles.itemBtnTxt}>Dark Mode</Text>
      <Switch
      trackColor={{false: '767577', true: '#3e3e3e'}}
      thumbColor={isEnabled ? '#f5dd4b' : 'f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
      style={{transform: [{scale: 0.6}], marginBottom: -15, marginRight: -8}}/>
     </TouchableOpacity>
      <TouchableOpacity style={styles.itemBtn}>
      <Text style={[styles.itemBtnTxt, {color:'red'}]}>Logout</Text>
      <MaterialIcons name='logout' size={16} color={'red'}/>
     </TouchableOpacity>
    </View>
     </>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
   
  },

  itemBtn :{
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal:  16, 
    paddingVertical: 20,
    borderBottomColor: Colors.background,
    borderBottomWidth: 1

  },

  itemBtnTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black

  }
})