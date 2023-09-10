import {DynamicStyleSheet, useDynamicValue} from 'react-native-dynamic';
import {View, StyleSheet} from 'react-native';

const Section = props => {
  const {children, style} = props;
  return <View style={[styles.section, style]}>{children}</View>;
};

export default Section;

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
