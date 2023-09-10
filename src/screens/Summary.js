import {useEffect, useState} from 'react';
import {View, Text, Image, Alert, Share} from 'react-native';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Container from '../components/Container';
import Section from '../components/Section';
import Subheading from '../components/Subheading';
import Paragraph from '../components/Paragraph';
import Heading from '../components/Heading';
import prettyFormat from 'pretty-format';

import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3671742292502512/6278980653';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const Summary = ({navigation, route}) => {
  const {id, time} = route.params;
  const [loaded, setLoaded] = useState(false);
  const user = useSelector(state => state?.user.data);
  const isDarkMode = useDarkMode();
  const caloriesBurned = (
    ((3.8 * 3.5 * user.weight) / 200) *
    (time == 0 ? 1 : time)
  ).toFixed(0);
  const [likeDislike, setLikeDislike] = useState('');
  const [workoutData, setWorkoutData] = useState({});

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        interstitial.show();
      },
    );

    interstitial.load();

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('id', prettyFormat(id));
    console.log('time', prettyFormat(time));

    firestore()
      .collection('Workouts')
      .doc(id)
      .get()
      .then(doc => {
        console.log(prettyFormat(doc.data()));
        setWorkoutData(doc.data());
      });
  }, []);

  const saveWorkout = () => {
    const completedWorkouts = firestore().collection('CompletedWorkouts');
    completedWorkouts
      .add({
        uid: auth().currentUser.uid,
        workoutId: id,
        time: time,
        caloriesBurned: caloriesBurned,
        timestamp: firestore.FieldValue.serverTimestamp(),
        image: workoutData.image,
        title: workoutData.title,
      })
      .then(() => {
        Alert.alert(
          'Workout Saved',
          'Your workout has been saved to your profile.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ],
        );
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Workout Not Saved',
          'There was an error saving your workout. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
        );
      });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Summary',
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
            onPress={() => navigation.navigate('Home')}
            name="arrow-left"
            size={24}
            color={isDarkMode ? DarkColors.text : LightColors.text}
          />
        );
      },
      headerRight: () => {
        return (
          <IconButton
            onPress={() => handleShare()}
            name="share-variant"
            size={24}
            color={isDarkMode ? DarkColors.text : LightColors.text}
          />
        );
      },
      headerTitleAlign: 'center',
    });
  }, []);

  const handleShare = async () => {
    try {
      const shareResult = await Share.share({
        message: 'I just finished a workout on Fitcare. Check it out!',
      });
      if (shareResult.action === Share.sharedAction) {
        if (shareResult.activityType) {
          Alert.alert('Workout Shared', 'Your workout has been shared.', [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ]);
        } else {
          Alert.alert('Workout Shared', 'Your workout has been shared.', [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ]);
        }
      } else if (shareResult.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      console.log('Share error: ', error);
      Alert.alert(
        "Can't share",
        'Something went wrong. Please try again later.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
        ],
      );
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to exit without saving the workout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'destructive',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Home'),
          style: 'default',
        },
      ],
    );
  };

  const handleLikeDislike = e => {
    if (e === 'like') {
      setLikeDislike('like');
      firestore()
        .collection('Workouts')
        .doc(id)
        .update({
          likes: workoutData.likes + 1,
        })
        .then(() => {
          console.log('Workout liked');
        });
    } else {
      setLikeDislike('dislike');
      firestore()
        .collection('Workouts')
        .doc(id)
        .update({
          dislikes: workoutData.dislikes + 1,
        })
        .then(() => {
          console.log('Workout disliked');
        });
    }
  };

  return (
    <Container
      style={
        Platform.OS === 'android'
          ? {paddingTop: 20, paddingBottom: 60}
          : {
              paddingTop: -40,
              paddingBottom: 60,
            }
      }>
      <View style={{flex: 2}}>
        <Section style={{marginVertical: 24}}>
          <Heading style={{marginBottom: 0}}>Exercise Completed</Heading>
        </Section>
        <Section
          style={{
            flexDirection: 'row',
            backgroundColor: isDarkMode ? DarkColors.stroke : LightColors.white,
            padding: 16,
            borderRadius: 8,
          }}>
          <Image
            source={{uri: workoutData.image}}
            style={{
              height: 75,
              width: '25%',
              borderRadius: 8,
              resizeMode: 'cover',
              marginRight: 16,
            }}
          />
          <View style={{width: '70%'}}>
            <Paragraph style={{fontWeight: '600'}} numberOfLines={1}>
              {workoutData.title}
            </Paragraph>
            <Paragraph numberOfLines={1}>{workoutData.level}</Paragraph>
          </View>
        </Section>
        <Section>
          <Subheading>Activity Result</Subheading>
        </Section>
        <Section
          style={{
            flexDirection: 'row',
            backgroundColor: isDarkMode ? DarkColors.stroke : LightColors.white,
            padding: 16,
            borderRadius: 8,
          }}>
          <View style={{width: '50%'}}>
            <Paragraph style={{fontWeight: '600'}}>{time} min</Paragraph>
            <Paragraph>Total Time</Paragraph>
          </View>
          <View style={{width: '50%'}}>
            <Paragraph style={{fontWeight: '600'}}>
              {caloriesBurned} kcal
            </Paragraph>
            <Paragraph>Calories Burned</Paragraph>
          </View>
        </Section>
      </View>
      <Section style={{flexDirection: 'column'}}>
        <Paragraph style={{marginBottom: 20, fontSize: 18}}>
          Do you like exercise?
        </Paragraph>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 40,
          }}>
          <IconButton
            name={likeDislike === 'like' ? 'thumb-up' : 'thumb-up-outline'}
            size={48}
            style={{marginHorizontal: 10}}
            color={
              likeDislike === 'like'
                ? isDarkMode
                  ? DarkColors.success
                  : LightColors.success
                : isDarkMode
                ? DarkColors.text
                : LightColors.text
            }
            onPress={() => {
              handleLikeDislike('like');
            }}
          />
          <IconButton
            name={
              likeDislike === 'dislike' ? 'thumb-down' : 'thumb-down-outline'
            }
            size={48}
            style={{marginHorizontal: 10}}
            color={
              likeDislike === 'dislike'
                ? isDarkMode
                  ? DarkColors.danger
                  : LightColors.danger
                : isDarkMode
                ? DarkColors.text
                : LightColors.text
            }
            onPress={() => {
              handleLikeDislike('dislike');
            }}
          />
        </View>
      </Section>
      <View style={{flex: 1}}>
        <Section>
          <Button title="Save Workout" onPress={saveWorkout} />
        </Section>
      </View>
    </Container>
  );
};

export default Summary;
