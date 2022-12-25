import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';

export default function Home(props) {
  return (
    <View style={styles.container}>
      <Text>フレンド一覧を表示するためにはVRChatアカウントでログインする必要があります</Text>
      <Button
        title="ログイン"
        onPress={()=>{
          //ログイン画面へ
          props.navigation.navigate('Login')
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
