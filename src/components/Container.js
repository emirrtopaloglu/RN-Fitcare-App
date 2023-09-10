import {Dimensions,} from 'react-native';
import {DynamicStyleSheet, DynamicValue, useDynamicValue} from 'react-native-dynamic';
import {SafeAreaView} from 'react-native-safe-area-context';
import { LightColors, DarkColors } from '../styles/colors';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

const Container = props => {
  const {children, style} = props;
  const styles = useDynamicValue(dynamicStyles);
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
};

export default Container;

const dynamicStyles = new DynamicStyleSheet({
  container: {
    width: SCREENWIDTH,
    height: SCREENHEIGHT,
    backgroundColor: new DynamicValue(LightColors.background, DarkColors.background),
  },
});
