import { Button } from '@rneui/base';
import { Input } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Login({ navigation, route }) {
  const [username, setUsername] = useState(null); //テキストフィールドに入力されたユーザIDが入る
  const [password, setPassword] = useState(null); //テキストフィールドに入力されたパスワードが入る
  const [code, setCode] = useState(null); //テキストフィールドに入力されたパスワードが入る

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
          // global.cookie = res.headers['set-cookie'];
        })
        .catch(err => {
          console.log("error");
          console.log(err.response);
        })
  }

  const verify = async () => {
      console.log("現在のセッションが有効か確認")
      global.instance
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
      <Button
        title="cookieテスト"
        onPress={async () => {
          // navigation.navigate({
          //   name: 'HomeDrawer',
          //   params: { ok: true },
          //   merge: true,
          // });
          navigation.navigate('HomeDrawer',{
            screen: 'Home',
            params:{ok: true}
          })
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
