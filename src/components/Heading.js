import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import {Text} from 'react-native';
import {LightColors, DarkColors} from '../styles/colors';

const Heading = props => {
  const {children, style} = props;
  const styles = useDynamicValue(dynamicStyles);
  return <Text style={[styles.heading, style]}>{children}</Text>;
};

export default Heading;

const dynamicStyles = new DynamicStyleSheet({
  heading: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 16,
    color: new DynamicValue(LightColors.textDark, DarkColors.textDark),
  },
});
