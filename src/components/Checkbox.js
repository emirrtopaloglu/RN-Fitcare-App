import {View, StyleSheet, Text, Pressable} from 'react-native';
import React from 'react';
import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';

const Checkbox = props => {
  const styles = useDynamicValue(dynamicStyles);
  return (
    <View>
      <Pressable
        style={[
          props.style,
          styles.checkbox,
          props.checked ? styles.checkboxChecked : null,
        ]}
        onPress={props.onPress}
      />
    </View>
  );
};

const dynamicStyles = new DynamicStyleSheet({
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: new DynamicValue(LightColors.stroke, DarkColors.textGray),
    borderRadius: 50,
    borderWidth: 2,
    borderColor: new DynamicValue(LightColors.stroke, DarkColors.stroke),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: new DynamicValue(LightColors.primary, DarkColors.primary),
  },
});

export default Checkbox;
