import {
  SafeAreaView,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  Platform,
} from 'react-native';
import Theme from '../styles/theme';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../store/auth/userSlice';
import SettingItem from '../components/SettingItem';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import storage from '@react-native-firebase/storage';
import Container from '../components/Container';
import Heading from '../components/Heading';
import Subheading from '../components/Subheading';
import Paragraph from '../components/Paragraph';
import Section from '../components/Section';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';

const SCREENWIDTH = Dimensions.get('window').width;

const Profile = ({navigation}) => {
  const user = useSelector(state => state?.user.data);
  const storageRef = storage().ref(
    'images/profile_photos/' + user?.uid + '.jpg',
  );
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const [skeletonLoading, setSkeletonLoading] = useState(false);

  const isDarkMode = useDarkMode();

  const handleSignout = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(logout());
      });
  };

  useEffect(() => {
    storageRef
      .getDownloadURL()
      .then(url => {
        setPhoto(url);
        setSkeletonLoading(!skeletonLoading);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <Container>
      <Section style={{marginTop: 24}}>
        <Heading style={{marginBottom: 0}}>Profile</Heading>
      </Section>
      <Section style={{justifyContent: 'center', flexDirection: 'column'}}>
        <ShimmerPlaceholder
          style={{width: 128, height: 128, borderRadius: 128, marginBottom: 10}}
          LinearGradient={LinearGradient}
          visible={skeletonLoading}>
          <Image
            style={{
              width: 128,
              height: 128,
              borderRadius: 128,
              resizeMode: 'cover',
              marginBottom: 10,
              overflow: 'hidden',
            }}
            source={
              photo
                ? {uri: photo}
                : require('../assets/images/default_profile.png')
            }
          />
        </ShimmerPlaceholder>
        <Heading style={{marginBottom: 0}}>{user?.fullName}</Heading>
      </Section>
      <Section>
        <TouchableHighlight
          underlayColor={
            isDarkMode ? DarkColors.background : LightColors.background
          }
          onPress={() => navigation.navigate('WeightTracking')}
          style={[
            Theme.shadow,
            {
              width: SCREENWIDTH * 0.28,
              height: 80,
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.white,
              borderRadius: 8,
              justifyContent: 'center',
            },
          ]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24, marginBottom: 5}}>⚖️</Text>
            <Paragraph style={{fontWeight: '600'}}>{user?.weight} kg</Paragraph>
          </View>
        </TouchableHighlight>
        <View
          style={[
            Theme.shadow,
            {
              width: SCREENWIDTH * 0.28,
              height: 80,
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.white,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Text style={{fontSize: 24, marginBottom: 5}}>🧍‍♀️</Text>
          <Paragraph style={{fontWeight: '600'}}>{user?.height} cm</Paragraph>
        </View>
        <View
          style={[
            Theme.shadow,
            {
              width: SCREENWIDTH * 0.28,
              height: 80,
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.white,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Text style={{fontSize: 24, marginBottom: 5}}>🎂</Text>
          <Paragraph style={{fontWeight: '600'}}>{user?.age} years</Paragraph>
        </View>
      </Section>
      <ScrollView style={{marginBottom: 80}}>
        <Section
          style={[
            Theme.shadow,
            {
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.white,
              borderRadius: 10,
              flexDirection: 'column',
            },
          ]}>
          <SettingItem
            title="Account"
            onPress={() => navigation.navigate('ProfileSettings')}
            icon
          />
          <SettingItem
            title="My Workouts"
            onPress={() => {
              navigation.navigate('MyWorkouts');
            }}
            icon
          />
          {Platform.OS === 'ios' ? (
            <SettingItem
              title="Workout Reminders"
              onPress={() => {
                navigation.navigate('WorkoutReminders');
              }}
              icon
            />
          ) : null}
          <SettingItem
            title="Logout"
            onPress={() => {
              handleSignout();
            }}
            color={isDarkMode ? DarkColors.danger : LightColors.danger}
            lastItem
          />
        </Section>
        <Text
          style={{
            textAlign: 'center',
            color: isDarkMode ? DarkColors.textGray : LightColors.textGray,
          }}>
          Made with by Emosto
        </Text>
      </ScrollView>
    </Container>
  );
};

export default Profile;
