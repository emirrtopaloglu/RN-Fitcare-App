import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Theme from '../styles/theme';
import {SvgUri} from 'react-native-svg';
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';

const Button = props => {
  const styles = useDynamicValue(dynamicStyles);
  switch (props.type) {
    case 'color_outline':
      return (
        <TouchableHighlight
          {...props}
          style={[styles.button, styles.button_outline]}
          underlayColor={Theme.colors.primary_light}
          activeOpacity={1}>
          <Text style={[styles.text, styles.text_outline]}>{props.title}</Text>
        </TouchableHighlight>
      );
    case 'with_icon':
      return (
        <TouchableHighlight
          {...props}
          style={[styles.button, styles.button_with_icon]}
          underlayColor={Theme.colors.primary_light}
          activeOpacity={1}>
          <View
            style={{
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {props.icon}
            <Text
              style={[
                styles.text,
                styles.text_outline,
                styles.text_icon
              ]}>
              {props.title}
            </Text>
          </View>
        </TouchableHighlight>
      );
    default:
      return (
        <TouchableOpacity
          {...props}
          style={[styles.button]}
          activeOpacity={0.8}>
          <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
      );
  }
};

const dynamicStyles = new DynamicStyleSheet({
  button: {
    width: '100%',
    backgroundColor: new DynamicValue(LightColors.primary, DarkColors.primary),
    borderRadius: 25,
    borderWidth: 2,
    borderColor: new DynamicValue(LightColors.primary, DarkColors.primary),
  },
  text: {
    color: new DynamicValue(LightColors.white, DarkColors.white),
    textAlign: 'center',
    lineHeight: 48,
    fontSize: 17,
    fontWeight: '500',
  },
  button_outline: {
    backgroundColor: 'transparent',
  },
  text_outline: {
    color: new DynamicValue(LightColors.primary, DarkColors.primary),
  },
  button_with_icon: {
    backgroundColor: new DynamicValue(LightColors.stroke, DarkColors.stroke),
    borderColor: new DynamicValue(LightColors.stroke, DarkColors.stroke),
  },
  text_icon: {
    color: new DynamicValue(LightColors.textDark, DarkColors.text)
  }
});

export default Button;
