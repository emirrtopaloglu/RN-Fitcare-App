import {View, Text, Pressable, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Heading from './Heading';
import Paragraph from './Paragraph';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

const SelectIconText = props => {
  const styles = useDynamicValue(dynamicStyles);
  return (
    <View>
      <Pressable onPress={props.onPress}>
        <View style={[styles.selectItem, props.style]}>
          {props.icon && (
            <View style={styles.selectIcon}>
              <Text style={{fontSize: 32}}>{props.icon}</Text>
            </View>
          )}
          <View style={{props}}>
            <Heading style={{marginBottom: 0, fontSize: 20}}>
              {props.children}
            </Heading>
            {props.subtitle ? <Paragraph>{props.subtitle}</Paragraph> : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  selectItem: {
    width: SCREENWIDTH - 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: new DynamicValue(LightColors.textLight, DarkColors.textGray),
    padding: 16,
  },
  selectIcon: {
    width: SCREENWIDTH * 0.2,
    height: SCREENWIDTH * 0.2,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: new DynamicValue(LightColors.stroke, DarkColors.stroke),
    borderWidth: 1,
    borderColor: new DynamicValue(LightColors.textLight, DarkColors.textGray),
    borderRadius: 5,
    display: 'flex',
    marginRight: 16,
  },
  heading_second: {
    fontSize: 20,
    lineHeight: 34,
    fontWeight: '600',
    color: '#0A0615',
  },
});

export default SelectIconText;
