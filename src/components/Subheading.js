import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import {Text} from 'react-native';
import {LightColors, DarkColors} from '../styles/colors';

const Subheading = props => {
  const {children, style} = props;
  const styles = useDynamicValue(dynamicStyles);
  return <Text style={[styles.subheading, style]}>{children}</Text>;
};

export default Subheading;

const dynamicStyles = new DynamicStyleSheet({
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    color: new DynamicValue(LightColors.text, DarkColors.text),
  },
});
