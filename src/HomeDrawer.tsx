import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from '@rneui/base';
import React from 'react';
import HomeTabs from './HomeTabs';

const Drawer = createDrawerNavigator();

export default function HomeDrawer(props) {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="Contact Us"
                component={HomeTabs}
                options={{ 
                    title: 'ホーム',
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
        </Drawer.Navigator>
    );
}