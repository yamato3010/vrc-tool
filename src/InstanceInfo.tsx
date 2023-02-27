import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function InstanceInfo({ route }) {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Card style={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        marginLeft: 1,
                        marginRight: 1,
                    }}>
                    <Card.Cover source={{ uri: route.params.worlds[route.params.worlds.findIndex((obj: { data: { id: any; }; }) => obj.data.id === route.params.ins.instance.data.id.substring(0, route.params.ins.instance.data.id.indexOf(":")))].data.imageUrl }} />
                    <Card.Content>
                        <Text variant="titleLarge">{route.params.worlds[route.params.worlds.findIndex((obj: { data: { id: any; }; }) => obj.data.id === route.params.ins.instance.data.id.substring(0, route.params.ins.instance.data.id.indexOf(":")))].data.name}</Text>                        
                        <Text variant="bodyMedium">{route.params.ins.instance.data.type=="hidden" ? "friend+" : route.params.ins.instance.data.type}({route.params.ins.instance.data.region})</Text>
                        <Text variant="bodyMedium">{route.params.ins.instance.data.n_users}/{route.params.ins.instance.data.capacity}{"\n"}</Text>
                        <Text variant="bodyMedium">{route.params.worlds[route.params.worlds.findIndex((obj: { data: { id: any; }; }) => obj.data.id === route.params.ins.instance.data.id.substring(0, route.params.ins.instance.data.id.indexOf(":")))].data.description}{"\n"}</Text>
                        <Text variant="bodyMedium">作者:{route.params.worlds[route.params.worlds.findIndex((obj: { data: { id: any; }; }) => obj.data.id === route.params.ins.instance.data.id.substring(0, route.params.ins.instance.data.id.indexOf(":")))].data.authorName}</Text>
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
