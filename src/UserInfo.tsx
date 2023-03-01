import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function UserInfo({ route }) {
    const headerHeight = useHeaderHeight();
    return (
        <ScrollView
            scrollIndicatorInsets={{
                top: headerHeight, left: 0, bottom: 0, right: 0
            }}
        >
            <View style={{
                flex: 1,
                alignItems: 'stretch',
                justifyContent: 'center',
                marginTop: headerHeight,
            }}>
                <Card style={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                    }}>
                    <Card.Cover source={{ uri: route.params.data.currentAvatarImageUrl }} />
                    <Card.Content>
                        <Text variant="titleLarge">
                            { route.params.data.displayName + " " }
                            { 
                                route.params.color == "gray" ? <Ionicons name="shield" size={24} color="gray" />
                                : route.params.color == "blue" ? <Ionicons name="shield" size={24} color="blue" />
                                : route.params.color == "green" ? <Ionicons name="shield" size={24} color="green" />
                                : route.params.color == "orange" ? <Ionicons name="shield" size={24} color="orange" />
                                : <Ionicons name="shield" size={24} color="purple" />
                            }
                        </Text>
                        <Text variant="bodyLarge">
                            { 
                                route.params.data.status=="active" ? <Text style={{color: 'green'}}>●</Text>
                                : route.params.data.status=="join me" ? <Text style={{color: 'skyblue'}}>●</Text>
                                : route.params.data.status=="ask me" ? <Text style={{color: 'orange'}}>●</Text>
                                : route.params.data.status=="busy" ? <Text style={{color: 'red'}}>●</Text>
                                : <Text style={{color: 'gray'}}>●</Text>
                            }
                            { route.params.data.statusDescription == "" ? route.params.data.status : route.params.data.statusDescription }
                            {"\n"}
                        </Text>
                        <Text variant="bodyMedium">{ route.params.data.bio }</Text>
                    </Card.Content>
                    <Card.Actions>
                    </Card.Actions>
                </Card>
            </View>
        </ScrollView>
    );
}