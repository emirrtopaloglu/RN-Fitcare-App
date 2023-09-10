import {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import Theme from '../styles/theme';
import {Calendar} from 'react-native-calendars';
import {
  FitnessDataType,
  FitnessTracker,
  GoogleFitDataType,
  HealthKitDataType,
} from '@kilohealth/rn-fitness-tracker';
import {useSelector} from 'react-redux';
import Section from '../components/Section';
import Container from '../components/Container';
import Heading from '../components/Heading';
import Subheading from '../components/Subheading';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Paragraph from '../components/Paragraph';

const Activity = ({navigation}) => {
  const weight = useSelector(state => state?.user.data.weight);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
  );
  const [authorized, setAuthorized] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);

  const isDarkMode = useDarkMode();

  const permissions = {
    healthReadPermissions: [HealthKitDataType.StepCount],
    googleFitReadPermissions: [GoogleFitDataType.Steps],
  };

  const authorize = async () => {
    await FitnessTracker.authorize(permissions);
    setAuthorized(true);
  };

  const checkIfTrackingIsAvailableUnsafe = async () => {
    try {
      const result = await FitnessTracker.UNSAFE_isTrackingAvailable(
        FitnessDataType.Steps,
      );
      setAuthorized(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    console.log('isTrackingAvailable');
  };

  const getSteps = async () => {
    const stepsToday = await FitnessTracker.getStatisticTodayTotal(
      FitnessDataType.Steps,
    );
    console.log(stepsToday);
    setSteps(stepsToday);
  };

  const getStepsSelectedDate = async () => {
    const stepsWeekDaily = await FitnessTracker.queryDailyTotals(
      FitnessDataType.Steps,
      new Date(
        new Date(selectedDate).setDate(new Date(selectedDate).getDate() - 1),
      ),
      new Date(selectedDate),
    );
    console.log(stepsWeekDaily);
    if (stepsWeekDaily[selectedDate]) {
      setSteps(stepsWeekDaily[selectedDate]);
    } else {
      setSteps(0);
    }
  };

  // Authorize on mount
  useEffect(() => {
    authorize();
    checkIfTrackingIsAvailableUnsafe();
  }, []);

  // If authorized, get steps
  useEffect(() => {
    if (authorized) {
      getSteps();
    }
  }, [authorized]);

  // If date is selected, get steps by date
  useEffect(() => {
    if (authorized) {
      getStepsSelectedDate();
    }
  }, [selectedDate]);

  // If steps are updated, get distance
  useEffect(() => {
    if (authorized) {
      setDistance(steps * 0.000762);
    }
  }, [steps]);

  // If distance is updated, get calories and active minutes
  useEffect(() => {
    if (authorized) {
      setCalories(weight * 3.3 * (distance / 4.8));
      setActiveMinutes((distance * 1000) / 80);
    }
  }, [distance]);

  return (
    <Container>
      <Section style={{marginTop: 24}}>
        <Heading style={{marginBottom: 0}}>Activity</Heading>
      </Section>
      <ScrollView>
        <Section>
          <Calendar
            style={{
              width: Dimensions.get('window').width - 50,
              borderWidth: 1,
              borderColor: isDarkMode ? DarkColors.stroke : LightColors.stroke,
              borderRadius: 8,
            }}
            firstDay={1}
            onDayPress={date => setSelectedDate(date.dateString)}
            markedDates={{
              [today.getFullYear() +
              '-' +
              (today.getMonth() + 1) +
              '-' +
              today.getDate()]: {
                selected: true,
                selectedColor: isDarkMode
                  ? DarkColors.primary_light
                  : LightColors.primary_light,
                selectedTextColor: isDarkMode
                  ? DarkColors.text
                  : LightColors.primary,
              },
              [selectedDate]: {
                selected: true,
                selectedColor: isDarkMode
                  ? DarkColors.primary
                  : LightColors.primary,
              },
            }}
            theme={{
              calendarBackground: isDarkMode
                ? DarkColors.background
                : LightColors.white,
              textSectionTitleColor: isDarkMode
                ? DarkColors.text
                : LightColors.text,
              textSectionTitleDisabledColor: isDarkMode
                ? DarkColors.text
                : LightColors.text,
              dayTextColor: isDarkMode ? DarkColors.text : LightColors.text,
              textDisabledColor: isDarkMode
                ? DarkColors.text
                : LightColors.text,
              dotColor: isDarkMode ? DarkColors.text : LightColors.text,
              arrowColor: isDarkMode ? DarkColors.text : LightColors.text,
              monthTextColor: isDarkMode ? DarkColors.text : LightColors.text,
            }}
          />
        </Section>
        <Section style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* left col */}
            <View style={{width: '48%'}}>
              <View
                style={[
                  Theme.shadow,
                  {
                    backgroundColor: isDarkMode
                      ? DarkColors.stroke
                      : LightColors.white,
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 16,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Paragraph style={{fontSize: 14, fontWeight: '600'}}>
                    Steps
                  </Paragraph>
                  <Text
                    style={{
                      backgroundColor: isDarkMode
                        ? DarkColors.background
                        : LightColors.background,
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 6,
                    }}>
                    🚶🏻‍♂️
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Subheading style={{marginBottom: 0, marginRight: 3}}>
                    {parseInt(steps)}
                  </Subheading>
                  <Text style={{color: Theme.colors.textGray}}>
                    {steps <= 1 ? 'step' : 'steps'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  Theme.shadow,
                  {
                    backgroundColor: isDarkMode
                      ? DarkColors.stroke
                      : LightColors.white,
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 16,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Paragraph style={{fontSize: 14, fontWeight: '600'}}>
                    Active Minutes
                  </Paragraph>
                  <Text
                    style={{
                      backgroundColor: isDarkMode
                        ? DarkColors.background
                        : LightColors.background,
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 6,
                    }}>
                    ⌛️
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Subheading style={{marginBottom: 0, marginRight: 3}}>
                    {parseInt(activeMinutes)}
                  </Subheading>
                  <Text style={{color: Theme.colors.textGray}}>
                    {activeMinutes <= 1 ? 'minute' : 'minutes'}
                  </Text>
                </View>
              </View>
            </View>
            {/* right col */}
            <View style={{width: '48%'}}>
              <View
                style={[
                  Theme.shadow,
                  {
                    backgroundColor: isDarkMode
                      ? DarkColors.stroke
                      : LightColors.white,
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 16,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Paragraph style={{fontSize: 14, fontWeight: '600'}}>
                    Calories
                  </Paragraph>
                  <Text
                    style={{
                      backgroundColor: isDarkMode
                        ? DarkColors.background
                        : LightColors.background,
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 6,
                    }}>
                    🔥
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Subheading style={{marginBottom: 0, marginRight: 3}}>
                    {parseInt(calories)}
                  </Subheading>
                  <Text style={{color: Theme.colors.textGray}}>kcal</Text>
                </View>
              </View>
              <View
                style={[
                  Theme.shadow,
                  {
                    backgroundColor: isDarkMode
                      ? DarkColors.stroke
                      : LightColors.white,
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 16,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Paragraph style={{fontSize: 14, fontWeight: '600'}}>
                    Distance
                  </Paragraph>
                  <Text
                    style={{
                      backgroundColor: isDarkMode
                        ? DarkColors.background
                        : LightColors.background,
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 6,
                    }}>
                    🚗
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Subheading style={{marginBottom: 0, marginRight: 3}}>
                    {distance.toFixed(2)}
                  </Subheading>
                  <Text style={{color: Theme.colors.textGray}}>km</Text>
                </View>
              </View>
            </View>
          </View>
        </Section>
        {Platform.OS === 'ios' ? (
          <Section style={{display: 'flex', justifyContent: 'center'}}>
            <Image source={require('../assets/images/apple_health.png')} />
          </Section>
        ) : null}
      </ScrollView>
    </Container>
  );
};

export default Activity;
