import {
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {DynamicValue, useDynamicValue} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Theme from '../styles/theme';

const SCREENWIDTH = Dimensions.get('window').width;

const CategoryIcon = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      style={[
        Theme.shadow,
        {
          width: SCREENWIDTH * 0.2,
          height: SCREENWIDTH * 0.2,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          borderRadius: 8,
          backgroundColor: useDynamicValue(
            LightColors.white,
            DarkColors.stroke,
          ),
        },
        props.style,
      ]}>
      <View>
        <Text style={{fontSize: 24, textAlign: 'center'}}>{props.icon}</Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 24,
            textAlign: 'center',
            fontWeight: '500',
            color: useDynamicValue(LightColors.text, DarkColors.text),
          }}>
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryIcon;
