import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Input } from '@rneui/themed';
import { Button } from '@rneui/base';

export default function Login(state) {
  const [username, setUsername] = useState(null); //テキストフィールドに入力されたユーザIDが入る
  const [password, setPassword] = useState(null); //テキストフィールドに入力されたパスワードが入る

  const login = async (userid, password) => {
      console.log("ログインします")
      instance
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
          // global.cookie = res.headers['set-cookie'];
        })
        .catch(err => {
          console.log("error");
          console.log(err.response);
        })
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
          login("testAvater", "ponchannnyamato");
        }}
      />
      <Button
        title="cookieテスト"
        onPress={async () => {
          let res = await verify();
          console.log(res); //TODO:verify()から結果が返されてから処理を行うようにする
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
