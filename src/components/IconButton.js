import {Pressable, StyleSheet, TouchableHighlight} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DarkColors, LightColors} from '../styles/colors';

const IconButton = props => {
  const isDarkMode = useDarkMode();
  return (
    <TouchableHighlight
      underlayColor={
        props.underlayColor
          ? props.underlayColor
          : isDarkMode
          ? DarkColors.primary_light
          : LightColors.primary_light
      }
      activeOpacity={props.activeOpacity}
      style={[
        styles.iconButton,
        props.style,
        {width: props.size * 1.75, height: props.size * 1.75},
      ]}
      onPress={props.onPress}>
      <Icon name={props.name} size={props.size} color={props.color} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
