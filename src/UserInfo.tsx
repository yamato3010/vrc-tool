import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function UserInfo({ route }) {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Card style={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                    }}>
                    <Card.Cover source={{ uri: route.params.data.currentAvatarImageUrl }} />
                    <Card.Content>
                        <Text variant="titleLarge">{ route.params.data.displayName } </Text>
                        <Text>Status: { route.params.data.status }
                        { route.params.data.status=="active" ? <Text style={{color: 'green'}}>●</Text>
                        : route.params.data.status=="join me" ? <Text style={{color: 'skyblue'}}>●</Text>
                        : route.params.data.status=="ask me" ? <Text style={{color: 'orange'}}>●</Text>
                        : route.params.data.status=="busy" ? <Text style={{color: 'red'}}>●</Text>
                        : <Text style={{color: 'gray'}}>●</Text>
                    }
                        </Text>
                        
                        <Text variant="bodyMedium">Bio:</Text>
                        <Text variant="bodyMedium">{ route.params.data.bio }</Text>
                    </Card.Content>
                    <Card.Actions>
                    </Card.Actions>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    }
});
