import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home';
import Event from './Event'
import HomeTabs from './HomeTabs';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/base';

const Drawer = createDrawerNavigator();
export default function HomeDrawer(props) {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="Contact Us"
                component={HomeTabs}
                options={{ 
                    title: 'ホーム',
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
        </Drawer.Navigator>
    );
}