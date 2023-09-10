import {View, Text, TouchableHighlight} from 'react-native';
import React from 'react';
import Theme from '../styles/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDarkMode} from 'react-native-dynamic';
import Paragraph from './Paragraph';
import {DarkColors, LightColors} from '../styles/colors';

const SettingItem = props => {
  const isDarkMode = useDarkMode();
  return (
    <TouchableHighlight
      style={{width: '100%'}}
      activeOpacity={1}
      underlayColor={
        isDarkMode ? DarkColors.background : LightColors.background
      }
      onPress={props.onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: props.lastItem ? 0 : 1,
          borderColor: isDarkMode ? DarkColors.textGray : LightColors.stroke,
          width: '100%',
          paddingLeft: 20,
          paddingRight: 10,
          paddingVertical: 10,
        }}>
        <Paragraph style={props.color ? {color: props.color} : null}>
          {props.title}
        </Paragraph>
        {props.icon ? (
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={isDarkMode ? DarkColors.text : LightColors.text}
          />
        ) : (
          <Paragraph
            style={{color: isDarkMode ? DarkColors.text : LightColors.text}}>
            {props.value}
          </Paragraph>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default SettingItem;
