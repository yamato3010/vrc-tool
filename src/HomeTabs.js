import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Event from './Event';
import Settings from './Settings';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
export default function HomeTabs(props) {
  return (
      <Tabs.Navigator>
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{ 
            title: 'ホーム',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-home" size={size} color={color} />
            ),
            headerRight: ({color, size}) => (
              <Button
                icon={
                  <Ionicons name="cog-outline" size={25} color={color} />
                }
                type="clear"
                onPress={()=>{
                  props.navigation.navigate('Settings')
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Event"
          component={Event}
          options={{ 
            title: 'イベントカレンダー',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
            headerRight: ({color, size}) => (
              <Button
                icon={
                  <Ionicons name="cog-outline" size={25} color={color} />
                }
                type="clear"
                onPress={()=>{
                  props.navigation.navigate('Settings')
                }}
              />
            ),
          }}
        />
      </Tabs.Navigator>
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
