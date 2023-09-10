import {Dimensions, TextInput} from 'react-native';
import {
  DynamicStyleSheet,
  DynamicValue,
  useDarkMode,
  useDynamicValue,
} from 'react-native-dynamic';
import {LightColors, DarkColors} from '../styles/colors';

const SCREENWIDTH = Dimensions.get('window').width;

const Input = props => {
  const {
    style,
    placeholder,
    autoCorrect,
    autoCapitalize,
    autoComplete,
    onChangeText,
    secureTextEntry,
    value,
  } = props;
  const isDarkMode = useDarkMode();
  const styles = useDynamicValue(dynamicStyles);
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? DarkColors.text : LightColors.textGray}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      value={value}
    />
  );
};

export default Input;

const dynamicStyles = new DynamicStyleSheet({
  input: {
    width: SCREENWIDTH - 40,
    height: 50,
    backgroundColor: new DynamicValue(LightColors.stroke, DarkColors.stroke),
    borderRadius: 10,
    paddingHorizontal: 20,
    color: new DynamicValue(LightColors.text, DarkColors.text),
    borderWidth: 1,
    borderColor: new DynamicValue(LightColors.textLight, DarkColors.stroke)
  },
});
