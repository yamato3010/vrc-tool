import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from '@rneui/base';
import { Avatar, Card} from 'react-native-paper';
import axios from 'axios';

export default function Home(props) {
  const [ok, setOk] = useState(null);
  const [friends, setFriends] = useState(null);
  const [trust, setTrust] = useState(null);

  global.instance = axios.create({ // インスタンスを作成
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
            let trustArr = [];
            friends.forEach((elem, index) => {
              if(elem.tags.length == 0){ // tagsに何も入っていなければVisiter確定
                trustArr.push("gray");
              }else{
                if(elem.tags.includes('system_trust_basic')){
                  if(elem.tags.includes('system_trust_known')){
                    if(elem.tags.includes('system_trust_trusted')){
                      if(elem.tags.includes('system_trust_veteran')){
                        trustArr.push("purple");
                      }else{
                        trustArr.push("orange");
                      }
                    }else{
                      trustArr.push("green");
                    }
                  }else{
                    trustArr.push("blue");
                  }
                }
              }
            });
            console.log(trustArr);
            setTrust(trustArr);
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

  if(ok == null || friends == null || trust == null) return null; //すべてのstateがsetされるまで画面を描画しない

  if(ok == true){ // セッションが有効な場合，フレンド一覧を出す
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>有効なセッションです。ログインは不要です。</Text>
          <Text>フレンド一覧</Text>
          {friends.map((friend, i) =>
            <TouchableOpacity key={i} onPress={() => alert("Text touch Event")}>
              <Card
                mode='outlined'
                style={{
                  backgroundColor: 'white',
                  borderColor: trust[i],
                }}
              >
                <Card.Cover source={{ uri: friend.currentAvatarImageUrl }} />
                <Card.Content>
                  <Text variant="titleLarge">{friend.displayName}</Text>
                  <Text variant="bodyMedium">Card content</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          <StatusBar style="auto" />
        </View>
      </ScrollView>
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
