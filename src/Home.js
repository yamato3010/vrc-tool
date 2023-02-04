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
  const [instanceSet, setInstanceSet] = useState(null);
  const [instances, setInstances] = useState(null);
  const [worlds, setWorlds] = useState(null);
  const [dispData, setDispData] = useState(null);
  const dataFetchedRef = useRef(false);

  global.instance = axios.create({ // インスタンスを作成
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
  });

  async function getData() {
    global.instance
      .get('https://api.vrchat.cloud/api/1/auth', {
        withCredentials: true
      })
      .then(res => {
        console.log("現在のセッションは有効です");
        console.log(res.data.ok);
        if (res.data.ok == true) {
          //フレンド一覧を取得する
          global.instance
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

  async function checkAuth() {
    await global.instance
      .get('https://api.vrchat.cloud/api/1/auth', {
        withCredentials: true
      })
      .then(res => {
        if (res.data.ok == true) setOk(true);
        else setOk(false);
      })
      .catch(err =>{
        console.log("checkAuthに失敗しました。");
        console.log(err.response);
        setOk(false);
      })
  }

  async function getFriends() {
    await global.instance
      .get('https://api.vrchat.cloud/api/1/auth/user/friends', {
        withCredentials: true
      })
      .then(res => {
        setFriends(res.data);
      })
      .catch(err =>{
        console.log("getFriendsに失敗しました。");
        console.log(err.response);
      })
  }

  async function createTrustAndInstanceSet() {
    let instanceIDSet = new Set();
    let trustArr = [];
    await friends.forEach((data, index) => {
      instanceIDSet.add(data.location); // instanceSetに入れる
      if (data.tags.length == 0) { // tagsに何も入っていなければVisiter確定
        trustArr.push("gray");
      } else {
        if (data.tags.includes('system_trust_basic')) {
          if (data.tags.includes('system_trust_known')) {
            if (data.tags.includes('system_trust_trusted')) {
              if (data.tags.includes('system_trust_veteran')) {
                trustArr.push({
                  color: "purple",
                  id: data.id
                });
              } else {
                trustArr.push({
                  color: "orange",
                  id: data.id
                });
              }
            } else {
              trustArr.push({
                color: "green",
                id: data.id
              });
            }
          } else {
            trustArr.push({
              color: "blue",
              id: data.id
            });
          }
        }
      }
    })
    instanceIDSet.delete("offline");
    instanceIDSet.delete("private");
    setTrust(trustArr);
    setInstanceSet(instanceIDSet);
  }

  async function getInstance(insSet) {
    let instanceArr = [];
      for(let item of insSet){
        instanceArr.push(await global.instance
        .get('https://api.vrchat.cloud/api/1/instances/' + item, { // インスタンスを取得
          withCredentials: true
        }))
      }
    setInstances(instanceArr);
  }

  async function getWorld(insSet) {
    let worldArr = [];
    for(let item of insSet){
      worldArr.push(await global.instance
        .get('https://api.vrchat.cloud/api/1/worlds/' + item.substring(0, item.indexOf(":")), { // ワールドを取得
          withCredentials: true
        }))
    }
    setWorlds(worldArr);
  }

  async function margeData() {
    let data = [];
    await new Promise((resolve, reject) => {
    for (let i = 0; i < instances.length; i++) {
      data.push(
        {
          instance: instances[i],
          friends: []
        }
      );
      for (let j = 0; j < friends.length; j++) {
        if (instances[i].data.location == friends[j].location) {
          data[i].friends.push(friends[j]);
        }
      }
    }
    resolve();
  })
    setDispData(data);
  }
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
  // useEffect(() => {
  //   if (dataFetchedRef.current) return;
  //   dataFetchedRef.current = true;
  //   // getData();
  // }, []);

  // useEffect(() => {
  //   if (friends == null || instances == null) return
  //   setDispData(mergeData(instances, friends));
  // }, [friends, instances])

  useEffect(() => {
    console.log("checkAuth実行");
    checkAuth();
  },[])

  useEffect(() => {
    if(ok == null) return
    console.log(ok)
    console.log("getFriends実行");
    getFriends();
  },[ok])

  useEffect(() => {
    if(friends == null) return
    console.log(friends.length)
    console.log("friendsから，instanceIDSetとtrustArrを作成");
    createTrustAndInstanceSet();
  },[friends])

  useEffect(() => {
    if(trust == null || instanceSet == null) return
    console.log(trust.length + " " + instanceSet.size)
    console.log("インスタンス情報取得");
    getInstance(instanceSet);
  },[trust,instanceSet])

  useEffect(() => {
    if(instances == null) return
    console.log(instances.length)
    console.log("インスタンスを確認");
    getWorld(instanceSet);
  },[instances])

  useEffect(() => {
    if(worlds == null) return
    console.log(worlds.length)
    console.log("ワールドを確認");
    margeData(instances, friends)
  },[worlds])

  useEffect(() => {
    if(dispData == null) return
    console.log("ーーーーーーdispdataここからーーーーーー");
    console.log(dispData)
    console.log("ーーーーーーdispdataここまでーーーーーー");
  },[dispData])

  if(ok == false) { // セッションが無効な場合，ログインを促す
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

  if (ok == null || friends == null || worlds == null || instances == null || dispData == null) return null; //すべてのstateがsetされるまで画面を描画しない
  if (ok == true && dispData != null) { // セッションが有効な場合，フレンド一覧を出す
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
              <TouchableOpacity key={ins.id} onPress={() => alert("Text touch Event")}>
                <Card
                  key={ins.id}
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
                    <Card.Cover source={{ uri: worlds[worlds.findIndex((obj) => obj.data.id === ins.instance.data.id.substring(0, ins.instance.data.id.indexOf(":")))].data.imageUrl }} />
                    <Text variant="titleLarge">{worlds[worlds.findIndex((obj) => obj.data.id === ins.instance.data.id.substring(0, ins.instance.data.id.indexOf(":")))].data.name}</Text>
                    <Text variant="bodyMedium">{ins.instance.data.type}({ins.instance.data.region})</Text>
                    <Text variant="bodyMedium">{ins.instance.data.n_users}/{ins.instance.data.capacity}</Text>
                    <View style={styles.friendCard}>
                      {ins.friends.map((friend, j) =>
                        <TouchableOpacity key={friend.id} onPress={() => alert("Text touch Event")}>
                          <Card
                            key={friend.id}
                            mode='elevated'
                            style={{
                              backgroundColor: 'white',
                              borderColor: trust[trust.findIndex((obj) => obj.id === friend.id)].color,
                              width: 115,
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
              global.instance
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
    alignItems: "flex-start",
    flexWrap: "wrap"
  },
});
