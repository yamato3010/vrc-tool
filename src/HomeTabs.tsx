import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from '@rneui/base';
import { StyleSheet } from 'react-native';
import Event from './Event';
import Home from './Home';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
export default function HomeTabs(props) {
  return (
      <Tabs.Navigator>
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{ 
            headerShown: false,
            title: 'ホーム',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Event"
          component={Event}
          options={{ 
            title: 'イベントカレンダー',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
            headerRight: ({tintColor}) => (
              <Button
                icon={
                  <Ionicons name="cog-outline" size={25} color={tintColor} />
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
