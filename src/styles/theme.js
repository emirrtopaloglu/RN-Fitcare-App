import {StyleSheet, Dimensions} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

const Theme = {
  colors: {
    primary: '#6d28d9',
    primary_light: 'rgba(100, 62, 179, 0.15)',
    primary_dark: '#4A2E8C',
    white: '#FFFFFF',
    black: '#000000',
    textDark: '#0A0615',
    text: '#404B52',
    textGray: '#999FA8',
    textLight: '#E5E9EF',
    background: '#F8FAFC',
    stroke: '#F1F4F8',
    danger: '#F5634A',
    success: '#40DBC1',
  },
  shadow: {
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.0,
    elevation: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
  },
};

export default Theme;
