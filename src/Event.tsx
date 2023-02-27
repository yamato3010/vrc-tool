import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import { useHeaderHeight } from '@react-navigation/elements';
import { Calendar, LocaleConfig } from 'react-native-calendars';

//yarn add react-native-calendars
//yarn add react-native-sqlite-storage
//npx pod-install iosの場合は必要
export default function Event(props) {
const navigation = useNavigation<any>();
const headerHeight = useHeaderHeight();
const bottomHeight = useBottomTabBarHeight();
  return (
      <Calendar 
      enableSwipeMonths
      style={{
        height:"100%",
        marginTop: headerHeight,
        marginBottom: -bottomHeight
      }}
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
  );
}

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
};
LocaleConfig.defaultLocale = 'jp';

