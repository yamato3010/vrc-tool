import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from '@rneui/base';
import axios from 'axios';

export default function Home(props) {
  const [ok, setOk] = useState(null);
  const [friends, setFriends] = useState(null);

  global.instance = axios.create({
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
    });

  useEffect(() => {
    console.log("現在のセッションが有効か確認")
    instance
      .get('https://api.vrchat.cloud/api/1/auth', {
        withCredentials: true
      })
      .then(res => {
        console.log("成功");
        console.log(res.data.ok);
        if (res.data.ok == true){
          setOk(true);
          //フレンド一覧を取得する
          instance
          .get('https://api.vrchat.cloud/api/1/auth/user/friends?offline=true', {
            withCredentials: true
          })
          .then(res => {
            console.log("フレンド一覧を取得しました");
            console.log(res.data);
            setFriends(res.data);
          })
          .catch(err => {
            console.log("フレンド一覧の取得に失敗しました");
            console.log(err.response);
          })
        } //セッションが有向であるときにtrueを返す
        else { //セッションが無効な時にfalseを返す
          console.log("セッションが無効です");
          setOk(false);
        }
      })
      .catch(err => {
        console.log("セッションの確認ができませんでした");
        console.log(err);
        setOk(false);
      })
  }, []);
  if(ok == null) return null;
  if(ok == true){ // セッションが有効な場合，フレンド一覧を出す
    return (
      <View style={styles.container}>
        <Text>有効なセッションです。ログインは不要です。</Text>
        <Text>フレンド一覧</Text>
        {friends.map((friend, i) => <Text key={i}>{i}.{friend.displayName}</Text>)}
        <StatusBar style="auto" />
      </View>
    );
  }else{ // セッションが無効な場合，ログインを促す
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
