import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';

export default function Event() {
  return (
    <View style={styles.container}>
      <Text>これはイベントカレンダー画面です</Text>
      <Button
        title="Click Me"
        onPress={()=>{
          alert("アラート表示");
          console.log("コンソールログ")
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
