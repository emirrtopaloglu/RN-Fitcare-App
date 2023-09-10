import {useState, useEffect} from 'react';
import IconButton from './src/components/IconButton';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/analytics';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Signup from './src/screens/Signup';
import Login from './src/screens/Login';
import ForgotPassword from './src/screens/ForgotPassword';
import CreatePlan from './src/screens/CreatePlan';
import WorkoutDetails from './src/screens/WorkoutDetails';
import StartTraining from './src/screens/StartTraining';
import Summary from './src/screens/Summary';
import ProfileSettings from './src/screens/ProfileSettings';
import Categories from './src/screens/Categories';
import MyWorkouts from './src/screens/MyWorkouts';
import CreateWorkout from './src/screens/CreateWorkout';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {getUser, userData} from './src/store/auth/userSlice';
import 'react-native-gesture-handler';
import Root from './src/screens/Root';
import WeightTracking from './src/screens/WeightTracking';
import WorkoutReminders from './src/screens/WorkoutReminders';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from './src/styles/colors';
import {Typography, Colors, ThemeManager} from 'react-native-ui-lib';
import UIConfig from 'react-native-ui-lib/config';
import {Dimensions} from 'react-native';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const isDarkMode = useDarkMode();

  // UI Config
  UIConfig.setConfig({appScheme: 'default'});

  // Colors Scheme
  Colors.loadSchemes({
    light: {
      primaryColor: '#6D28D9',
      textColor: '#0A0615',
      textLightColor: '#404B52',
      bgColor: '#F8FAFC',
      strokeColor: '#F1F4F8',
    },
    dark: {
      primaryColor: '#6D28D9',
      textColor: '#FFFFFF',
      textLightColor: '#E5E9EF',
      bgColor: '#222332',
      strokeColor: '#2D3450',
    },
  });

  // Typography Scheme
  Typography.loadTypographies({
    h1: {fontSize: 28, fontWeight: '700', lineHeight: 34},
    p: {fontSize: 14, fontWeight: '300', lineHeight: 24},
  });

  // Theme Manager
  ThemeManager.setComponentTheme('Button', {
    labelStyle: {
      fontSize: 16,
      fontWeight: '600',
    },
    backgroundColor: Colors.primaryColor,
    color: '#fff',
  });

  ThemeManager.setComponentTheme('Incubator.TextField', {
    color: Colors.textColor,
    fieldStyle: {
      backgroundColor: Colors.strokeColor,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: Colors.rgba(Colors.textLightColor, 0.1),
      shadowColor: Colors.rgba(Colors.textLightColor, 0.5),
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      elevation: 1,
    },
    placeholderTextColor: Colors.rgba(Colors.textLightColor, 0.5),
  });

  const Stack = createNativeStackNavigator();

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  const setUserData = async () => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(snapshot => {
        store.dispatch(userData(snapshot.data()));
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (auth().currentUser) {
      store.dispatch(getUser(auth().currentUser.uid));
      setUserData();
    }
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="WelcomeScreen">
            <Stack.Screen
              name="WelcomeScreen"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={({navigation}) => ({
                headerTitle: '',
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: isDarkMode
                    ? DarkColors.background
                    : LightColors.background,
                },
                headerLeft: () => {
                  return (
                    <IconButton
                      onPress={() => navigation.goBack()}
                      name="arrow-left"
                      size={24}
                      color={isDarkMode ? DarkColors.text : LightColors.text}
                    />
                  );
                },
              })}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={({navigation}) => ({
                headerTitle: '',
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: isDarkMode
                    ? DarkColors.background
                    : LightColors.background,
                },
                headerLeft: () => {
                  return (
                    <IconButton
                      onPress={() => navigation.goBack()}
                      name="arrow-left"
                      size={24}
                      color={isDarkMode ? DarkColors.text : LightColors.text}
                    />
                  );
                },
              })}
            />
            <Stack.Screen name="CreatePlan" component={CreatePlan} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Root"
            component={Root}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileSettings"
            component={ProfileSettings}
            options={({navigation}) => ({
              headerTitle: 'Account',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                color: isDarkMode ? DarkColors.text : LightColors.text,
              },
              headerStyle: {
                backgroundColor: isDarkMode
                  ? DarkColors.background
                  : LightColors.background,
              },
              headerLeft: () => {
                return (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? DarkColors.text : LightColors.text}
                  />
                );
              },
            })}
          />
          <Stack.Screen
            name="WorkoutDetails"
            component={WorkoutDetails}
            options={({route, navigation}) => ({
              headerTitle: route.params.data.title,
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: isDarkMode
                  ? DarkColors.background
                  : LightColors.background,
              },
              headerTitleStyle: {
                color: isDarkMode ? DarkColors.text : LightColors.text,
              },
              headerLeft: () => {
                return (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? DarkColors.text : LightColors.text}
                  />
                );
              },
              // headerRight: () => {
              //   return (
              //     <IconButton
              //       onPress={() => navigation.goBack()}
              //       name="heart-outline"
              //       size={24}
              //       color={isDarkMode ? DarkColors.text : LightColors.text}
              //     />
              //   );
              // },
            })}
          />
          <Stack.Screen name="StartTraining" component={StartTraining} />
          <Stack.Screen name="Summary" component={Summary} />
          <Stack.Screen name="CreatePlan" component={CreatePlan} />
          <Stack.Screen name="WeightTracking" component={WeightTracking} />
          <Stack.Screen
            name="CreateWorkout"
            component={CreateWorkout}
            options={({route, navigation}) => ({
              headerTitle: 'Create Workout',
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerTitleStyle: {
                color: isDarkMode ? DarkColors.text : LightColors.text,
              },
              headerStyle: {
                backgroundColor: isDarkMode
                  ? DarkColors.background
                  : LightColors.white,
              },
              headerTitleAlign: 'center',
              headerLeft: () => {
                return (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? DarkColors.text : LightColors.text}
                  />
                );
              },
            })}
          />
          <Stack.Screen
            name="MyWorkouts"
            component={MyWorkouts}
            options={({route, navigation}) => ({
              headerTitle: 'My Workouts',
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerTitleStyle: {
                color: isDarkMode ? DarkColors.text : LightColors.text,
              },
              headerStyle: {
                backgroundColor: isDarkMode
                  ? DarkColors.background
                  : LightColors.background,
              },
              headerLeft: () => {
                return (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? DarkColors.text : LightColors.text}
                  />
                );
              },
            })}
          />
          <Stack.Screen
            name="WorkoutReminders"
            component={WorkoutReminders}
            options={({route, navigation}) => ({
              headerTitle: 'Workout Reminders',
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerTitleStyle: {
                color: isDarkMode ? DarkColors.text : LightColors.text,
              },
              headerStyle: {
                backgroundColor: isDarkMode
                  ? DarkColors.background
                  : LightColors.background,
              },
              headerTitleAlign: 'center',
              headerLeft: () => {
                return (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? DarkColors.text : LightColors.text}
                  />
                );
              },
            })}
          />
          <Stack.Screen
            name="Categories"
            component={Categories}
            options={({route, navigation}) => ({
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              headerTitleStyle: {
                color: isDarkMode ? DarkColors.text : LightColors.text,
              },
              headerStyle: {
                backgroundColor: isDarkMode
                  ? DarkColors.background
                  : LightColors.background,
              },
              headerLeft: () => {
                return (
                  <IconButton
                    onPress={() => navigation.goBack()}
                    name="arrow-left"
                    size={24}
                    color={isDarkMode ? DarkColors.text : LightColors.text}
                  />
                );
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
