import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Input } from '@rneui/themed';
import { Button } from '@rneui/base';
import axios from 'axios';

export default function Login(state) {
  const [username, setUsername] = useState(null); //テキストフィールドに入力されたユーザIDが入る
  const [password, setPassword] = useState(null); //テキストフィールドに入力されたパスワードが入る

  global.instance = axios.create({
    withCredentials: true,
    baseURL: "https://api.vrchat.cloud/api/1"
    });

  const login = async (userid, password) => {
    let ok = await verify();
    if (ok == true) { //TODO:ここが機能していない。verify関数からtrue or falseが返ってきて来てから処理を行いたい。
      console.log("cookieあるよ");
      console.log(global.cookie[0]);
    }
    else {
      console.log("cookieがないので取得")
      // instance
      //   .get('https://api.vrchat.cloud/api/1/auth/user', {
      //     headers: {
      //       'Authorization': { username: userid, password: password },
      //     },
      //     withCredentials: true
      //   })
      //   .then(res => {
      //     console.log("成功");
      //     console.log(res);
      //     global.cookie = res.headers['set-cookie'];
      //   })
      //   .catch(err => {
      //     console.log("error");
      //     console.log(err);
      //   })
    }
  }

  const verify = async () => {
      console.log("現在のセッションが有効か確認")
      instance
        .get('https://api.vrchat.cloud/api/1/auth', {
          withCredentials: true
        })
        .then(res => {
          console.log("成功");
          if(res.data.ok == true) return true; //セッションが有向であるときにtrueを返す
          else return false; //セッションが無効な時にfalseを返す
        })
        .catch(err => {
          console.log("error");
          console.log(err);
          return false;
        })
  }

  const testCookie = () => { //テスト用関数。将来的に削除
    console.log("cookieを使って情報を取得します");
    instance
        .get('https://api.vrchat.cloud/api/1/auth/user/friends', {
          
          withCredentials: true
        })
        .then(res => {
          console.log("成功");
          console.log(res);
        })
        .catch(err => {
          console.log("error");
          console.log(err);
        })
  }
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
      <Button
        title="ログインテスト"
        onPress={async () => {
        }}
      />
      <Button
        title="cookieテスト"
        onPress={async () => {
          // await verify()
          // .then(() => {
          //   if(ok){
          //     console.log("セッション有効");
          //   }else{
          //     console.log("無効なセッション");
          //   }
          // })
          // .catch((res) => {
          //   console.log(res);
          //   console.log("認証の確認時に何らかのエラー");
          // })
          console.log(verify()); //TODO:verify()から結果が返されてから処理を行うようにする
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
