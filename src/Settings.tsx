import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';

export default function Settings(props) {
  return (
    <View style={styles.container}>
      <Text>これは設定画面です</Text>
      <Button
        title="イベントカレンダーへ"
        onPress={()=>{
          console.log("コンソールログ")
          props.navigation.navigate('Event')
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
