import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/base';
import { Calendar } from 'react-native-calendars';
//yarn add react-native-calendars
export default function Event() {
  return (
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
      onDayPress = {day => {
        console.log(day);
      }}
      />
  );
}



