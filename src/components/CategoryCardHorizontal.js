import {View, Text, TouchableOpacity} from 'react-native';
import Theme from '../styles/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDarkMode } from 'react-native-dynamic';
import { DarkColors, LightColors } from '../styles/colors';
import Paragraph from './Paragraph';

const CategoryCardHorizontal = props => {
  const isDarkMode = useDarkMode();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={props.onPress}
      style={[
        Theme.shadow,
        {
          flexDirection: 'row',
          width: '100%',
          backgroundColor: isDarkMode ? DarkColors.stroke : LightColors.white,
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        },
      ]}>
      <View style={{flex: 0.2, marginRight: 16}}>
        <View
          style={[
            Theme.shadow,
            {
              height: 60,
              width: 60,
              borderRadius: 8,
              backgroundColor: isDarkMode ? DarkColors.background : LightColors.white,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '600',
              color: isDarkMode ? DarkColors.text : LightColors.text,
            }}>
            {props.icon}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 0.8,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View>
          <Paragraph style={{fontWeight: '600', color: isDarkMode ? DarkColors.textDark : LightColors.text}}>{props.title}</Paragraph>
          <Text style={{fontSize: 14, color: isDarkMode ? DarkColors.text : LightColors.textGray}}>
            {props.desc}
          </Text>
        </View>
        <View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={Theme.colors.textGray}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCardHorizontal;
