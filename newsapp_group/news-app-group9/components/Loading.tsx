// components/Loading.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

type LoadingProps = {
  size?: 'small' | 'large';
};

const Loading: React.FC<LoadingProps> = ({ size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#000" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
