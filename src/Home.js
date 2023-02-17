import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@rneui/base';
import { Avatar, Card } from 'react-native-paper';
import axios from 'axios';
import { Input } from '@rneui/themed';
import { set } from 'react-native-reanimated';

export default function Home({ navigation, route }) {
  const [ok, setOk] = useState(null);
  const [friends, setFriends] = useState(null);
  const [trust, setTrust] = useState(null);
  const [instanceSet, setInstanceSet] = useState(null);
  const [instances, setInstances] = useState(null);
  const [worlds, setWorlds] = useState(null);
  const [dispData, setDispData] = useState(null);
  const [username, setUsername] = useState(null); //テキストフィールドに入力されたユーザIDが入る
  const [password, setPassword] = useState(null); //テキストフィールドに入力されたパスワードが入る
  const [code, setCode] = useState(null); //テキストフィールドに入力されたパスワードが入る
  const dataFetchedRef = useRef(false);

  global.instance = axios.create({ // インスタンスを作成
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
  });

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
        console.log(err.response)
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

  async function mergeData() {
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

  const login = async (userid, password) => {
      console.log("ログインします")
      global.instance
        .get('https://api.vrchat.cloud/api/1/auth/user', {
          auth: {
            username: userid,
            password: password,
          },
          withCredentials: true
        })
        .then(res => {
          console.log("成功");
          console.log(res);
          setOk(true);
        })
        .catch(err => {
          console.log("error");
          console.log(err.response);
        })
  }

  const verifyEmail = async () => {
    global.instance
    .post('https://api.vrchat.cloud/api/1/auth/twofactorauth/emailotp/verify',{
      withCredentials: true,
      code: code
    })
    .then(res => {
      console.log("成功");
      console.log(res);
      // global.cookie = res.headers['set-cookie'];
    })
    .catch(err => {
      console.log("error");
      console.log(err.response);
    })
  }

  useEffect(() => {
    console.log("帰ってきた");
  },[route])

  useEffect(() => {
    // if(props.ok != undefined){
    //   setOk(true);
    // }
    console.log("checkAuth実行");
    checkAuth();
  },[])

  useEffect(() => {
    if(ok == null || ok == false) return
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
    mergeData(instances, friends)
  },[worlds])

  useEffect(() => {
    if(dispData == null) return
  },[dispData])

  if(ok == false) { // セッションが無効な場合，ログインを促す
    // navigation.navigate('Login');
    return (
      <View style={styles.container}>
      <Text>VRChat ID(ユーザーネーム)とパスワードを入力してください</Text>
      <Input
        placeholder='VRChat ID'
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        onChangeText={value => setUsername(value)}
      />
      <Input
        placeholder="パスワード"
        leftIcon={{ type: 'font-awesome', name: 'key' }}
        onChangeText={value => setPassword(value)}
        secureTextEntry={true}
        errorStyle={{ color: 'red' }}
        errorMessage='ENTER A VALID ERROR HERE'
      />
      <Button
        title="ログイン"
        onPress={async () => {
          //入力されたユーザIDとパスワードを使用してログイン関数を呼び出す
          login(username,password);
        }}
      />
      <Input
        placeholder="コード"
        leftIcon={{ type: 'font-awesome', name: 'key' }}
        onChangeText={value => setCode(value)}
        secureTextEntry={true}
        errorStyle={{ color: 'red' }}
        errorMessage='ENTER A VALID ERROR HERE'
      />
      <Button
        title="veryfyEmail"
        onPress={async () => {
          verifyEmail();
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
                  setDispData(null);
                  setWorlds(null);
                  setInstances(null);
                  setInstanceSet(null);
                  setFriends(null);
                  setTrust(null);
                  setOk(false);
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
