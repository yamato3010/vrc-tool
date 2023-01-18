import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '@rneui/base';
//import SQLite from 'react-native-sqlite-storage'
import * as SQLite from 'expo-sqlite'
import { Agenda, Calendar } from 'react-native-calendars';
import { useRoute } from '@react-navigation/core';
import { useState } from 'react';
import { FAB, Provider } from 'react-native-paper';
//yarn add react-native-calendars
//yarn add react-native-sqlite-storage
//yarn add react-native-paper
//npx expo install expo-sqlite
export function DayTimeline(props) {
  const route = useRoute();
  const data = route.params.data;

  const [calItems, setCalItems] = useState(null);

  const calDB = SQLite.openDatabase('calendar.db');

  calDB.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM calendar WHERE startYear=? AND startMonth=?`,
      [data.year, data.month],
      (_, resultSet) => {
        let calArr = resultSet.rows._array;
        let calI = calArr.map(( value ) => { // Map to Items
          return `'${value.startYear}-${value.startMonth}-${value.startDay}': [{name: '${value.title}'}]`
        });
console.log(calI.join())
        setCalItems(calI.join());// arr to str
      },
      () => {
        console.log("SELECT TABLE Failed.");
        return false; // no role back
      });
  },
  () => { console.log("Failed All."); },
  () => { console.log("Success All."); }
  );
  
  return (
    <Provider>
      <Agenda
        selected={data.dateString}
        scrollEnabled
        items={{calItems
        }}
        markedDates={{
          '2023-01-16': {selected: true, marked: true},
          '2023-01-17': {marked: true},
          '2023-01-18': {disabled: true}
        }}
        renderItem={(item, firstItemInDay) => {
          return <TouchableOpacity></TouchableOpacity>;
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {console.log("pressed")}}
      />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    flex: 1,
    position: 'absolute',
    right: 16,
    bottom: 16,
    margin: 16,
  }
});