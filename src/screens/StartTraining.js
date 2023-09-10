import {View, Text, Image} from 'react-native';
import Theme from '../styles/theme';
import React, {useState, useEffect} from 'react';
import Button from '../components/Button';
import {useStopwatch, useTimer} from 'react-timer-hook';
import IconButton from '../components/IconButton';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Paragraph from '../components/Paragraph';
import Subheading from '../components/Subheading';
import Heading from '../components/Heading';
import Container from '../components/Container';
import Section from '../components/Section';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3671742292502512/3229025924';

const StartTraining = ({navigation, route}) => {
  const isDarkMode = useDarkMode();
  const {id, data, thumbnail} = route.params;
  const [exercise, setExercise] = useState(0);
  const [restVisible, setRestVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const {seconds, minutes, start, pause, isRunning} = useStopwatch({
    autoStart: false,
  });
  const {
    seconds: exerciseSecond,
    minutes: exerciseMinute,
    start: exerciseStart,
    pause: exercisePause,
    restart: exerciseRestart,
    isRunning: exerciseIsRunning,
  } = useTimer({
    expiryTimestamp: new Date().setSeconds(
      new Date().getSeconds() + (data[0].time ? data[0].time : 0),
    ),
    autoStart: false,
    onExpire: () => {
      if (data.length - 1 == exercise && data[exercise].time) {
        finishTraining();
      } else {
        setRestVisible(true);
        restStart();
      }
    },
  });
  const {
    seconds: restSecond,
    minutes: restMinute,
    start: restStart,
    pause: restPause,
    restart: restRestart,
    isRunning: restIsRunning,
  } = useTimer({
    expiryTimestamp: new Date().setSeconds(new Date().getSeconds() + 20),
    autoStart: false,
    onExpire: () => {
      setRestVisible(false);
      setExercise(exercise + 1);
      restRestart(new Date().setSeconds(new Date().getSeconds() + 20), false);
    },
  });

  // Set Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: isDarkMode
          ? DarkColors.background
          : LightColors.background,
      },
      headerLeft: () => {
        return (
          <Paragraph style={{fontSize: 16, fontWeight: '600'}}>
            Exercise {exercise + 1}/{data.length}
          </Paragraph>
        );
      },
      headerRight: () => {
        return (
          <Subheading style={{fontSize: 24, fontWeight: '600'}}>
            {minutes.toString().padStart(2, '0') +
              ':' +
              seconds.toString().padStart(2, '0')}
          </Subheading>
        );
      },
    });
  }, [seconds, exercise]);

  // if exercise changed, restart timer
  useEffect(() => {
    if (data[exercise].time) {
      let time = new Date();
      time.setSeconds(time.getSeconds() + data[exercise].time);
      exerciseRestart(time, false);
    }
  }, [exercise]);

  const handleExerciseStart = () => {
    if (data.length - 1 == exercise && data[exercise].reps) {
      finishTraining();
    } else {
      if (data[exercise].time && !exerciseIsRunning) {
        exerciseStart();
      } else if (data[exercise].time && exerciseIsRunning) {
        exercisePause();
      } else {
        setRestVisible(true);
        restStart();
      }
    }
  };

  const finishTraining = () => {
    pause();
    navigation.navigate('Summary', {
      id: id,
      time: minutes,
    });
  };

  return (
    <Container style={{flex: 1}}>
      {restVisible ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: isDarkMode
              ? DarkColors.background
              : LightColors.background,
            flexDirection: 'column',
            left: 0,
            width: '100%',
            height: '95%',
            zIndex: 1,
          }}>
          <Section
            style={[
              Section,
              {
                flex: 6,
                flexDirection: 'column',
                justifyContent: 'center',
              },
            ]}>
            <Subheading style={{marginBottom: 20, textAlign: 'center'}}>
              Rest Time
            </Subheading>
            <Text
              style={{
                fontSize: 48,
                fontWeight: '700',
                color: isDarkMode ? DarkColors.textDark : LightColors.textDark,
                marginBottom: 20,
                textAlign: 'center',
              }}>
              {restMinute.toString().padStart(2, '0') +
                ':' +
                restSecond.toString().padStart(2, '0')}
            </Text>
            <Button
              title={'Skip'}
              onPress={() => {
                setExercise(exercise + 1);
                restRestart(
                  new Date().setSeconds(new Date().getSeconds() + 20),
                  false,
                );
                setRestVisible(false);
              }}
            />
          </Section>
          {exercise + 1 < data.length ? (
            <Section
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                borderTopWidth: 1,
                borderTopColor: isDarkMode
                  ? DarkColors.stroke
                  : LightColors.stroke,
              }}>
              <View style={{width: '70%'}}>
                <Paragraph numberOfLines={1}>
                  Exercise {`${exercise + 2}/${data.length}`}
                </Paragraph>
                <Paragraph style={{fontWeight: '700', marginBottom: 0}}>
                  {data[exercise + 1].title}
                </Paragraph>
                <Paragraph numberOfLines={1}>
                  {data[exercise + 1].time
                    ? `${data[exercise + 1].time} seconds`
                    : `${data[exercise + 1].reps}`}
                </Paragraph>
              </View>
              <Image
                source={{uri: thumbnail}}
                style={{
                  width: 75,
                  height: 75,
                  maxHeight: '100%',
                  marginLeft: 16,
                  borderRadius: 8,
                }}
              />
            </Section>
          ) : null}
        </View>
      ) : null}
      <Section
        style={{
          borderWidth: 1,
          borderColor: isDarkMode ? DarkColors.stroke : LightColors.stroke,
          backgroundColor: '#fff',
          borderRadius: 8,
          flex: 3,
          marginTop: 16,
        }}>
        <Image
          source={{uri: data[exercise].move}}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </Section>
      <Section style={{flexDirection: 'column', flex: 1}}>
        <Heading style={{width: '100%', textAlign: 'center'}}>
          {data[exercise].title}
        </Heading>
        {data[exercise].time ? (
          <Text
            style={{
              fontSize: 48,
              fontWeight: '700',
              color: isDarkMode ? DarkColors.primary : LightColors.primary,
            }}>
            {exerciseMinute.toString().padStart(2, '0') +
              ':' +
              exerciseSecond.toString().padStart(2, '0')}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 48,
              fontWeight: '700',
              color: isDarkMode ? DarkColors.primary : LightColors.primary,
            }}>
            {data[exercise].reps}
          </Text>
        )}
      </Section>
      <Section style={{flex: 1, justifyContent: 'space-around'}}>
        {isRunning ? (
          <>
            <IconButton
              name="chevron-left"
              size={36}
              color={
                isRunning && exercise > 0
                  ? isDarkMode
                    ? DarkColors.textDark
                    : LightColors.textDark
                  : isDarkMode
                  ? DarkColors.text
                  : LightColors.textGray
              }
              onPress={
                isRunning && exercise > 0
                  ? () => setExercise(exercise - 1)
                  : null
              }
              underlayColor={
                isRunning && exercise > 0
                  ? isDarkMode
                    ? DarkColors.stroke
                    : LightColors.stroke
                  : 'transparent'
              }
            />
            <IconButton
              name={
                data[exercise].time
                  ? exerciseIsRunning
                    ? 'pause'
                    : 'play'
                  : 'check'
              }
              size={36}
              style={{
                backgroundColor: isDarkMode
                  ? DarkColors.primary
                  : LightColors.primary,
              }}
              color={Theme.colors.white}
              onPress={() => {
                handleExerciseStart();
              }}
              underlayColor={
                isDarkMode ? DarkColors.primary_dark : LightColors.primary_dark
              }
            />
            <IconButton
              name="chevron-right"
              size={36}
              color={
                exercise < data.length - 1
                  ? isDarkMode
                    ? DarkColors.textDark
                    : LightColors.textDark
                  : isDarkMode
                  ? DarkColors.text
                  : LightColors.textGray
              }
              onPress={
                exercise < data.length - 1
                  ? () => {
                      setRestVisible(true);
                      restStart();
                    }
                  : null
              }
              underlayColor={
                exercise < data.length - 1
                  ? isDarkMode
                    ? DarkColors.stroke
                    : LightColors.stroke
                  : 'transparent'
              }
            />
          </>
        ) : (
          <Button title="Start" onPress={() => start()} />
        )}
      </Section>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </Container>
  );
};

export default StartTraining;
