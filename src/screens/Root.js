import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Training from './Training';
import Activity from './Activity';
import Profile from './Profile';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';

const Root = () => {
  const Tab = createBottomTabNavigator();
  const isDarkMode = useDarkMode();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDarkMode
            ? DarkColors.background
            : LightColors.white,
          borderTopColor: isDarkMode ? DarkColors.stroke : LightColors.stroke,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: isDarkMode
          ? DarkColors.primary
          : LightColors.primary,
        tabBarInactiveTintColor: isDarkMode
          ? DarkColors.text
          : LightColors.text,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Ionicons
                name="home"
                size={24}
                color={isDarkMode ? DarkColors.primary : LightColors.primary}
              />
            ) : (
              <Ionicons
                name="home-outline"
                size={24}
                color={isDarkMode ? DarkColors.text : LightColors.textGray}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Training"
        component={Training}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Ionicons
                name="md-barbell"
                size={24}
                color={isDarkMode ? DarkColors.primary : LightColors.primary}
              />
            ) : (
              <Ionicons
                name="md-barbell"
                size={24}
                color={isDarkMode ? DarkColors.text : LightColors.textGray}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Ionicons
                name="fitness-sharp"
                size={24}
                color={isDarkMode ? DarkColors.primary : LightColors.primary}
              />
            ) : (
              <Ionicons
                name="fitness-outline"
                size={24}
                color={isDarkMode ? DarkColors.text : LightColors.textGray}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Ionicons
                name="person"
                size={24}
                color={isDarkMode ? DarkColors.primary : LightColors.primary}
              />
            ) : (
              <Ionicons
                name="person-outline"
                size={24}
                color={isDarkMode ? DarkColors.text : LightColors.textGray}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Root;
