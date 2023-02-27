import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function UserInfo({route}) {
    return (
        <View style={styles.container}>
            <Text>{route.params.data.displayName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      justifyContent: 'center',
    }
  });
  