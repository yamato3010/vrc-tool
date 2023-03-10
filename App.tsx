import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { decode, encode } from 'base-64';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import Event from './src/Event';
import Home from './src/Home';
import HomeDrawer from './src/HomeDrawer';
import Hometabs from './src/HomeTabs';
import InstanceInfo from './src/InstanceInfo';
import Login from './src/Login';
import Settings from './src/Settings';
import UserInfo from './src/UserInfo';
// import { DayTimeline } from './src/EventCalendar/DayTimeline';

const Stack = createStackNavigator();

export default function App() {
  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="HomeDrawer"
            component={HomeDrawer}
            options={{
              title: '戻る',
              headerShown: false
            }}
          />
        <Stack.Screen
          name="Hometabs"
          component={Hometabs}
          options={{
            title: '戻る',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'ホーム',
          }}
        />
        <Stack.Screen
          name="Event"
          component={Event}
          options={{
            title: 'イベントカレンダー',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'ログイン',
          }}
        />
        <Stack.Screen
          name="UserInfo"
          component={UserInfo}
          options={{
            title: 'ユーザ情報',
            headerTransparent: true,
            headerBackground: () => (
                <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
            ),
          }}
        />
        <Stack.Screen
          name="InstanceInfo"
          component={InstanceInfo}
          options={{
            title: 'インスタンス情報',
            headerTransparent: true,
            headerBackground: () => (
                <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
            ),
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: '設定',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
