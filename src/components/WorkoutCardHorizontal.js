import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Theme from '../styles/theme';
import Paragraph from './Paragraph';

const WorkoutCardHorizontal = props => {
  const isDarkMode = useDarkMode();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress}
      style={[
        Theme.shadow,
        {
          flexDirection: 'row',
          width: '100%',
          backgroundColor: isDarkMode ? DarkColors.stroke : LightColors.white,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        },
      ]}>
      <View style={{flex: 0.2, marginRight: 16}}>
        <Image
          style={{height: 60, width: 60, borderRadius: 8, resizeMode: 'cover'}}
          source={{uri: props.image}}
        />
      </View>
      <View style={{flex: 0.8, justifyContent: 'center'}}>
        <Paragraph style={{fontWeight: '600'}}>{props.title}</Paragraph>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: '500',
              marginRight: 8,
              color: isDarkMode ? DarkColors.primary : LightColors.primary,
            }}>
            {props.category}
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              backgroundColor: isDarkMode ? DarkColors.primary : LightColors.primary,
              marginRight: 8,
              borderRadius: 4,
            }}
          />
          <Text style={{color: isDarkMode ? DarkColors.text : LightColors.text, fontSize: 12}}>{props.duration} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutCardHorizontal;
