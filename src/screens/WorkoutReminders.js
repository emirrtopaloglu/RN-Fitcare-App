import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import Theme from '../styles/theme';
import {useEffect, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import RNCalendarEvents from 'react-native-calendar-events';
import Container from '../components/Container';
import Section from '../components/Section';
import Subheading from '../components/Subheading';

const WorkoutReminders = ({navigation}) => {
  const uid = useSelector(state => state?.user.uid);
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setSelectedDays(documentSnapshot.data().reminder.days);
          setDate(new Date(documentSnapshot.data().reminder.time));
        }
      });
  }, []);

  useEffect(() => {
    RNCalendarEvents.requestPermissions()
      .then(res => {
        console.log('Premission Response', res);
      })
      .catch(error => {
        console.log('Premission Error', error);
      });
  }, []);

  const clearEvents = () => {
    RNCalendarEvents.fetchAllEvents(
      new Date(2022, 11, 11).toISOString(),
      new Date(2030, 11, 31).toISOString(),
      ['title', 'location', 'notes', 'startDate', 'endDate'],
    ).then(events => {
      // filter Fitcare Daily Reminder
      const filteredEvents = events.filter(event => {
        return event.title === 'Fitcare Daily Reminder';
      });
      // delete all Fitcare Daily Reminder
      filteredEvents.forEach(event => {
        console.log(event.id);
        RNCalendarEvents.removeEvent(event.id, {futureEvents: true});
      });
    });
  };

  const createEvent = () => {
    clearEvents();
    const days = Object.keys(selectedDays).filter(key => selectedDays[key]);
    days.forEach(day => {
      const index = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ].indexOf(day);

      // Create a date object for the day of the week
      const date = new Date();
      date.setDate(date.getDate() + ((index + 7 - date.getDay()) % 7));

      const eventConfig = {
        title: 'Fitcare Daily Reminder',
        startDate: date.toISOString(),
        endDate: new Date(date.getTime() + 1000 * 60 * 60).toISOString(),
        recurrence: 'weekly',
        recurrenceRule: {
          frequency: 'weekly',
        },
        alarms: [
          {
            date: -15,
          },
        ],
      };
      RNCalendarEvents.saveEvent('Fitcare Daily Reminder', eventConfig)
        .then(id => {
          console.log('Event Created', id);
        })
        .catch(error => {
          console.log('Event Error', error);
        });
    });
    Alert.alert('Event Created', 'Your workout reminder has been created', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Profile');
        },
      },
    ]);
  };

  const handleCreateReminder = () => {
    firestore()
      .collection('Users')
      .doc(uid)
      .update({
        reminder: {
          days: selectedDays,
          time: new Date(date).getTime(),
        },
      })
      .then(() => {
        createEvent();
      });
  };

  return (
    <Container>
      <Section
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Subheading style={{textAlign: 'center', marginBottom: 24}}>
          Select the days you want to training
        </Subheading>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            marginBottom: 40,
          }}>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.monday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({...selectedDays, monday: !selectedDays.monday});
            }}>
            <Text
              style={{
                color: selectedDays.monday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              M
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.tuesday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({
                ...selectedDays,
                tuesday: !selectedDays.tuesday,
              });
            }}>
            <Text
              style={{
                color: selectedDays.tuesday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              T
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.wednesday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({
                ...selectedDays,
                wednesday: !selectedDays.wednesday,
              });
            }}>
            <Text
              style={{
                color: selectedDays.wednesday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              W
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.thursday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({
                ...selectedDays,
                thursday: !selectedDays.thursday,
              });
            }}>
            <Text
              style={{
                color: selectedDays.thursday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              T
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.friday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({
                ...selectedDays,
                friday: !selectedDays.friday,
              });
            }}>
            <Text
              style={{
                color: selectedDays.friday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              F
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.saturday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({
                ...selectedDays,
                saturday: !selectedDays.saturday,
              });
            }}>
            <Text
              style={{
                color: selectedDays.saturday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              S
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.checkbox,
              selectedDays.sunday ? styles.checkboxSelected : null,
            ]}
            onPress={() => {
              setSelectedDays({
                ...selectedDays,
                sunday: !selectedDays.sunday,
              });
            }}>
            <Text
              style={{
                color: selectedDays.sunday
                  ? Theme.colors.white
                  : Theme.colors.primary,
                fontWeight: '600',
              }}>
              S
            </Text>
          </Pressable>
        </View>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          onChange={onChange}
          mode="time"
          display="spinner"
          style={{marginBottom: 24}}
        />
        <Button title="Create a reminder" onPress={handleCreateReminder} />
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    backgroundColor: Theme.colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.stroke,
  },
  checkboxSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
});

export default WorkoutReminders;
