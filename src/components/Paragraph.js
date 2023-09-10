import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
} from 'react-native-dynamic';
import {Text} from 'react-native';
import {LightColors, DarkColors} from '../styles/colors';

const Paragraph = props => {
  const {children, style, numberOfLines} = props;
  const styles = useDynamicValue(dynamicStyles);
  return <Text style={[styles.paragraph, style]} numberOfLines={numberOfLines}>{children}</Text>;
};

export default Paragraph;

const dynamicStyles = new DynamicStyleSheet({
  paragraph: {
    color: new DynamicValue(LightColors.text, DarkColors.text),
    fontSize: 16,
    lineHeight: 24,
  },
});
