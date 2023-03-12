import { Entypo, Feather } from '@expo/vector-icons';
import { ListItem } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { version } from '../package.json';

export default function Settings(props) {
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <ListItem>
        <Entypo name="log-out" size={24} color="#3478F7" />
          <ListItem.Content>
            <ListItem.Title>ログアウト</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem> */}
        <ListItem>
        <Feather name="info" size={24} color="#3478F7" />
          <ListItem.Content>
            <ListItem.Title>バージョン{version}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
});
