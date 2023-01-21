import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Button } from '@rneui/base';
import { Avatar, Card} from 'react-native-paper';
import axios from 'axios';
import { set } from 'react-native-reanimated';

export default function Home(props) {
  const [ok, setOk] = useState(null);
  const [friends, setFriends] = useState(null);
  const [trust, setTrust] = useState(null);
  const [instances, setInstances] = useState(null);
  const [worlds, setWorlds] = useState(null);
  const dataFetchedRef = useRef(false);

  global.instance = axios.create({ // インスタンスを作成
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
    });

  useEffect( () => {
    console.log("現在のセッションが有効か確認")
    async function getData(){
    await instance
      .get('https://api.vrchat.cloud/api/1/auth', {
        withCredentials: true
      })
      .then(res => {
        console.log("成功");
        console.log(res.data.ok);
        if (res.data.ok == true){
          //フレンド一覧を取得する
          instance
          .get('https://api.vrchat.cloud/api/1/auth/user/friends', {
            withCredentials: true
          })
          .then(res => {
            // console.log("フレンド一覧を取得しました");
            // console.log(res.data);
            let friendsArr = res.data;
            let trustArr = [];
            let instanceIDSet = new Set();
            let instanceArr = [];
            let worldArr = [];
            friendsArr.forEach((elem, index) => {
              instanceIDSet.add(elem.location); // instanceSetに入れる
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
            instanceIDSet.delete("offline");
            instanceIDSet.delete("private");

              instanceIDSet.forEach((elem,i) => {
              console.log("ループ内")
              global.instance
              .get('https://api.vrchat.cloud/api/1/instances/' + elem, { // インスタンスを取得
                withCredentials: true
              })
              .then((res) => {
                instanceArr.push(res.data);
                console.log("フレンドがいるインスタンス一覧情報");
                // console.log(res.data);
                global.instance
              .get('https://api.vrchat.cloud/api/1/worlds/' + elem.substring(0, elem.indexOf(":")), { // ワールドを取得
                withCredentials: true
              })
              .then((res) => {
                worldArr.push(res.data);
                console.log("フレンドがいるワールド一覧情報");
                // console.log(res.data);
              })
              })
            })
            setOk(true);
            setFriends(friendsArr);
            setTrust(trustArr);
            setInstances(instanceArr);
            setWorlds(worldArr);
        })
          .catch(err => {
            console.log("フレンド一覧の取得に失敗しました");
            console.log(err.response);
            console.log(err);
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
    }
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      getData();
      console.log("処理完了");
      console.log(instances);
  }, []);

  if(worlds == null || instances == null) return null; //すべてのstateがsetされるまで画面を描画しない
  if(ok == true){ // セッションが有効な場合，フレンド一覧を出す
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>有効なセッションです。ログインは不要です。</Text>
          <Text>フレンド一覧</Text>
          {instances.map((ins,i) => 
            <TouchableOpacity key={i} onPress={() => alert("Text touch Event")}>
            <Card
              mode='outlined'
              style={{
                backgroundColor: 'white',
                borderColor: 'black',
              }}
            >
              <Card.Content>
                <Card.Cover source={{ uri: worlds[worlds.findIndex((obj) => obj.id === ins.id.substring(0, ins.id.indexOf(":")))].imageUrl }} />
                <Text variant="titleLarge">{worlds[worlds.findIndex((obj) => obj.id === ins.id.substring(0, ins.id.indexOf(":")))].name}</Text>
                <Text variant="bodyMedium">{ins.type}({ins.region})</Text>
                <Text variant="bodyMedium">{ins.n_users}/{ins.capacity}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
          )}
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
          <Button
          title="ログアウト"
          onPress={()=>{
            instance
              .put('https://api.vrchat.cloud/api/1/logout', { // インスタンスを取得
                withCredentials: true
              })
              .then((res) => {
                console.log(res.data);
                Alert("ログアウトしました！");
            })
          }}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
