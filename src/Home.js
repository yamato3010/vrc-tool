import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Button } from '@rneui/base';
import { Avatar, Card } from 'react-native-paper';
import axios from 'axios';
import { set } from 'react-native-reanimated';

export default function Home(props) {
  const [ok, setOk] = useState(null);
  const [friends, setFriends] = useState(null);
  const [trust, setTrust] = useState(null);
  const [instances, setInstances] = useState(null);
  const [worlds, setWorlds] = useState(null);
  const [dispData, setDispData] = useState(null);
  const dataFetchedRef = useRef(false);

  global.instance = axios.create({ // インスタンスを作成
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
  });

  useEffect(() => {
    console.log("現在のセッションが有効か確認")
    async function getData() {
      await instance
        .get('https://api.vrchat.cloud/api/1/auth', {
          withCredentials: true
        })
        .then(res => {
          console.log("成功");
          console.log(res.data.ok);
          if (res.data.ok == true) {
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
                  if (elem.tags.length == 0) { // tagsに何も入っていなければVisiter確定
                    trustArr.push("gray");
                  } else {
                    if (elem.tags.includes('system_trust_basic')) {
                      if (elem.tags.includes('system_trust_known')) {
                        if (elem.tags.includes('system_trust_trusted')) {
                          if (elem.tags.includes('system_trust_veteran')) {
                            trustArr.push({
                              color: "purple",
                              id: elem.id
                            });
                          } else {
                            trustArr.push({
                              color: "orange",
                              id: elem.id
                            });
                          }
                        } else {
                          trustArr.push({
                            color: "green",
                            id: elem.id
                          });
                        }
                      } else {
                        trustArr.push({
                          color: "blue",
                          id: elem.id
                        });
                      }
                    }
                  }
                });
                console.log(trustArr);
                instanceIDSet.delete("offline");
                instanceIDSet.delete("private");

                instanceIDSet.forEach((elem, i) => {
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
                setDispData(mergeData(instanceArr, friendsArr));
                setOk(true);
                setFriends(friendsArr);
                setTrust(trustArr); //トラストレベルをstateに入れる
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
  }, []);

  useEffect(() => {
    if (friends == null || instances == null) return
    setDispData(mergeData(instances, friends));
  }, [friends, instances])

  const mergeData = (instances, friends) => {
    let data = [];
    for (let i = 0; i < instances.length; i++) {
      data.push(
        {
          instance: instances[i],
          friends: []
        }
      );
      for (let j = 0; j < friends.length; j++) {
        if (instances[i].location == friends[j].location) {
          data[i].friends.push(friends[j]);
        }
      }
    }
    return data;
  }

  if (ok == null || friends == null || worlds == null || instances == null || dispData == null) return null; //すべてのstateがsetされるまで画面を描画しない
  if (ok == true) { // セッションが有効な場合，フレンド一覧を出す
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>有効なセッションです。ログインは不要です。</Text>
          <Text>フレンド一覧</Text>
          {dispData.sort(function (a, b) {
            if (a.friends.length > b.friends.length) return -1;
            else if (b.friends.length > a.friends.length) return 1;
            else return 0;
          }).map((ins, i) => (
            <>
              <TouchableOpacity key={i} onPress={() => alert("Text touch Event")}>
                <Card
                  mode='elevated'
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    marginTop: 10,
                    marginLeft: 1,
                    marginRight: 1,
                  }}
                >
                  <Card.Content>
                    <Card.Cover source={{ uri: worlds[worlds.findIndex((obj) => obj.id === ins.instance.id.substring(0, ins.instance.id.indexOf(":")))].imageUrl }} />
                    <Text variant="titleLarge">{worlds[worlds.findIndex((obj) => obj.id === ins.instance.id.substring(0, ins.instance.id.indexOf(":")))].name}</Text>
                    <Text variant="bodyMedium">{ins.instance.type}({ins.instance.region})</Text>
                    <Text variant="bodyMedium">{ins.instance.n_users}/{ins.instance.capacity}</Text>
                    <View key={"view" + i} style={styles.friendCard}>
                      {ins.friends.map((friend, j) =>
                        <TouchableOpacity key={"f" + j} onPress={() => alert("Text touch Event")}>
                          <Card
                            mode='elevated'
                            style={{
                              backgroundColor: 'white',
                              borderColor: trust[trust.findIndex((obj) => obj.id === friend.id)].color,
                              width: 130,
                              height: 115,
                              borderWidth: 1.5,
                              borderRadius: 13.5,
                              marginTop: 1,
                              marginLeft: 1,
                              marginRight: 1,
                            }}
                          >
                            <Card.Cover source={{ uri: friend.currentAvatarImageUrl }} style={{
                              height: 95,
                            }} />
                            <Card.Content>
                              <Text variant="titleLarge"
                                style={{
                                  textAlign: 'center',
                                }}
                                numberOfLines={1}
                              >{friend.displayName}</Text>
                            </Card.Content>
                          </Card>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            </>
          )
          )}
          <Button
            title="ログアウト"
            onPress={() => {
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
  } else { // セッションが無効な場合，ログインを促す
    return (
      <View style={styles.container}>
        <Text>フレンド一覧を表示するためにはVRChatアカウントでログインする必要があります</Text>
        <Button
          title="ログイン"
          onPress={() => {
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
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  friendCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
});
