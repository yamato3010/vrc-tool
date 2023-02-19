import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';

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
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  global.instance = axios.create({ // インスタンスを作成
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
  });

  async function checkAuth() {
    await global.instance
      .get('https://api.vrchat.cloud/api/1/auth', {
        withCredentials: true
      })
      .then((res: { data: { ok: boolean; }; }) => {
        if (res.data.ok == true) setOk(true);
        else setOk(false);
      })
      .catch((err: { response: any; }) => {
        console.log("checkAuthに失敗しました。");
        alert("checkAuthに失敗しました。");
        console.log(err.response)
        setOk(false);
      })
  }

  async function getFriends() {
    await global.instance
      .get('https://api.vrchat.cloud/api/1/auth/user/friends', {
        withCredentials: true
      })
      .then((res: { data: any; }) => {
        setFriends(res.data);
      })
      .catch((err: { response: any; }) => {
        console.log("getFriendsに失敗しました。");
        alert("getFriendsに失敗しました。");
        console.log(err.response);
      })
  }

  async function createTrustAndInstanceSet() {
    let instanceIDSet = new Set();
    let trustArr:Object[] = [];
    await friends.forEach((data: { location: object; tags: string | string[]; id: string; }, index: any) => {
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
    instanceIDSet.delete("traveling");
    setTrust(trustArr);
    setInstanceSet(instanceIDSet);
  }

  async function getInstance(insSet: Set<string>) {
    let instanceArr = [];
    // map関数を使うため，SetをArrayに変換
    const insArr = Array.from(insSet);
    const promises = insArr.map(item =>{
      return global.instance
      .get('https://api.vrchat.cloud/api/1/instances/' + item, { // インスタンスを取得
        withCredentials: true
      })
    })
    const response = await Promise.all(promises);
    instanceArr.push(...response);
    // for (let item of insSet) {
    //   instanceArr.push(await global.instance
    //     .get('https://api.vrchat.cloud/api/1/instances/' + item, { // インスタンスを取得
    //       withCredentials: true
    //     })
    //     .catch((err:any) => {
    //       console.log(err.response);
    //       console.log(item);
    //     }))
    // }
    setInstances(instanceArr);
  }

  async function getWorld(insSet: Set<string>) {
    let worldArr:Object[] = [];
    // map関数を使うため，SetをArrayに変換
    const insArr = Array.from(insSet);
    const promises = insArr.map(item =>{
      return global.instance
      .get('https://api.vrchat.cloud/api/1/worlds/' + item.substring(0, item.indexOf(":")), { // ワールドを取得
        withCredentials: true
      })
    })
    const response = await Promise.all(promises);
    worldArr.push(...response);
    // for (let item of insSet) {
    //   worldArr.push(await global.instance
    //     .get('https://api.vrchat.cloud/api/1/worlds/' + item.substring(0, item.indexOf(":")), { // ワールドを取得
    //       withCredentials: true
    //     }))
    // }
    setWorlds(worldArr);
  }

  async function mergeData() {
    let data:any = [];
    await new Promise<void>((resolve, reject) => {
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

  const login = async (userid: string, password: string) => {
    console.log("ログインします");
    global.instance
      .get('https://api.vrchat.cloud/api/1/auth/user', {
        auth: {
          username: userid,
          password: password,
        },
        withCredentials: true
      })
      .then((res: any) => {
        console.log("成功");
        console.log(res);
        // TODO メール認証が発生した場合にOKになってしまうので，それをどうにかする
        setOk(true);
      })
      .catch((err: { response: any; }) => {
        console.log("error");
        alert("ログインに失敗しました");
        console.log(err.response);
      })
  }

  const verifyEmail = async () => {
    global.instance
      .post('https://api.vrchat.cloud/api/1/auth/twofactorauth/emailotp/verify', {
        withCredentials: true,
        code: code
      })
      .then((res: any) => {
        console.log("成功");
        console.log(res);
        // global.cookie = res.headers['set-cookie'];
      })
      .catch((err: { response: any; }) => {
        console.log("error");
        alert("コード認証に失敗しました");
        console.log(err.response);
      })
  }

  const refresh = useCallback(async () => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    // if(props.ok != undefined){
    //   setOk(true);
    // }
    console.log("checkAuth実行");
    checkAuth();
  }, [])

  useEffect(() => {
    if (ok == null || ok == false) return
    setLoading(true);
    console.log(ok)
    console.log("getFriends実行");
    getFriends();
  }, [ok, refreshing])

  useEffect(() => {
    if (friends == null) return
    console.log(friends.length)
    console.log("friendsから，instanceIDSetとtrustArrを作成");
    createTrustAndInstanceSet();
  }, [friends])

  useEffect(() => {
    if (trust == null || instanceSet == null) return
    console.log(trust.length + " " + instanceSet.size)
    console.log("インスタンス情報取得");
    getInstance(instanceSet);
  }, [instanceSet])

  useEffect(() => {
    if (instances == null) return
    console.log(instances.length)
    console.log("インスタンスを確認");
    getWorld(instanceSet);
  }, [instances])

  useEffect(() => {
    if (worlds == null) return
    console.log(worlds.length)
    console.log("ワールドを確認");
    mergeData();
  }, [worlds])

  useEffect(() => {
    if (dispData == null) return
    setLoading(false);
    setRefreshing(false);
  }, [dispData])

  if (ok == false) { // セッションが無効な場合，ログインを促す
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
            login(username, password);
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

  if (ok == null || friends == null || worlds == null || instances == null || dispData == null || loading == true) 
    return (
      <View style={styles.loadscreen}>
        <ActivityIndicator size="large" />
        <Text>データ取得中...</Text>
      </View>
    );
  if (ok == true && dispData != null) { // セッションが有効な場合，フレンド一覧を出す
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <View style={styles.container}>
          {dispData.sort(function (a: { friends: string | any[]; }, b: { friends: string | any[]; }) {
            if (a.friends.length > b.friends.length) return -1;
            else if (b.friends.length > a.friends.length) return 1;
            else return 0;
          }).map((ins: { id: Key; instance: { data: { id: string; type: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal; region: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal; n_users: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal; capacity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal; }; }; friends: any[]; }, i: any) => (
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
                    <Card.Cover source={{ uri: worlds[worlds.findIndex((obj: { data: { id: any; }; }) => obj.data.id === ins.instance.data.id.substring(0, ins.instance.data.id.indexOf(":")))].data.imageUrl }} />
                    <Text>{worlds[worlds.findIndex((obj: { data: { id: any; }; }) => obj.data.id === ins.instance.data.id.substring(0, ins.instance.data.id.indexOf(":")))].data.name}</Text>
                    <Text>{ins.instance.data.type}({ins.instance.data.region})</Text>
                    <Text>{ins.instance.data.n_users}/{ins.instance.data.capacity}</Text>
                    <View style={styles.friendCard}>
                      {ins.friends.map((friend: { id: Key; currentAvatarImageUrl: any; displayName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal; }, j: any) =>
                        <TouchableOpacity key={friend.id} onPress={() => alert("Text touch Event")}>
                          <Card
                            key={friend.id}
                            mode='elevated'
                            style={{
                              backgroundColor: 'white',
                              borderColor: trust[trust.findIndex((obj: { id: any; }) => obj.id === friend.id)].color,
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
                              <Text
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
                .then((res: { data: any; }) => {
                  console.log(res.data);
                  setDispData(null);
                  setWorlds(null);
                  setInstances(null);
                  setInstanceSet(null);
                  setFriends(null);
                  setTrust(null);
                  setOk(false);
                  alert("ログアウトしました！");
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
  loadscreen: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
