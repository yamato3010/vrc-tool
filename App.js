import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Tab } from '@rneui/base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import Home from './src/Home';
import Hometabs from './src/HomeTabs';
import Event from './src/Event';
import Settings from './src/Settings';
import Login from './src/Login';
import HomeDrawer from './src/HomeDrawer'
import { decode, encode } from 'base-64';
import { DayTimeline } from './src/EventCalendar/DayTimeline';

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
          name="Settings"
          component={Settings}
          options={{
            title: '設定',
          }}
        />
        <Stack.Screen
          name="DayTimeline"
          component={DayTimeline}
          options={{
            title: 'タイムライン',
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
