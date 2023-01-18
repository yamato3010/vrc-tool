import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';
import * as SQLite from 'expo-sqlite'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/core';
import * as FileSystem from 'expo-file-system'
import { FAB, Provider } from 'react-native-paper';

//yarn add react-native-calendars
//yarn add react-native-sqlite-storage
//npx pod-install iosの場合は必要
export default function Event(props) {
  const calDB = SQLite.openDatabase('calendar.db');

  /*calDB.transaction((tx) => {// remove calendar.db本番では消す
    tx.executeSql(
      "DROP TABLE IF EXISTS calendar",
      null,
      () => {
        console.log("DROP TABLE Success.");
      },
      () => {
        console.log("DROP TABLE Failed.");
        return true;
      });
  },
  () => { console.log("Failed All."); },
  () => { console.log("Success All."); }
  )*/

  calDB.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS calendar (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, startYear INTEGER NOT NULL, startMonth INTEGER NOT NULL, startDay INTEGER NOT NULL, startHour INTEGER NOT NULL, startMinute INTEGER NOT NULL, endYear INTEGER NOT NULL, endMonth INTEGER NOT NULL, endDay INTEGER NOT NULL, endHour INTEGER NOT NULL, endMinute INTEGER NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL);",
      null,
      () => {
        console.log("CREATE TABLE Success.");
      },
      () => {
        console.log("CREATE TABLE Failed.");
        return true;
      });
  },
  () => { console.log("Failed All."); },
  () => { console.log("Success All."); }
  )


  calDB.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO calendar (startYear, startMonth, startDay, startHour, startMinute, endYear,endMonth, endDay, endHour, endMinute, title, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [2023, 1, 23, 21, 0, 2023, 1,24, 23, 0, "testTitle2", "testDescription2"],
      (transact, resultSet) => {
        console.log("INSERT TABLE Success.");
      },
      (transact, err) => {
        console.log("INSERT TABLE Failed.", err);
        return true;
      });
  },
  () => { console.log("Failed All."); },
  () => { console.log("Success All."); }
  );

const navigation = useNavigation();
  return (
  <Provider>
    <Calendar 
      enableSwipeMonths
      style={{height:"100%"}}
      theme = {{
        'stylesheet.calendar.main': {
          monthView: {
            flex: 1,
            height: '100%',
            justifyContent: 'space-around'
          },
          week: {
            flex: 1,
            marginVertical: 0,
            flexDirection: 'row',
            justifyContent: 'space-around'
          },
          dayContainer: {
            borderColor: '#f5f5f5',
            borderWidth: 1,
            flex:1,
          },
        }
      }}
      onDayPress = {data => {
        navigation.navigate('DayTimeline', {
          data: data
        })
      }}
      onMonthChange = {month => {}}
    />
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={() => {console.log("pressed")}}
    />
    </Provider>
  );
}

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
};
LocaleConfig.defaultLocale = 'jp';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    margin: 16,
  }
});