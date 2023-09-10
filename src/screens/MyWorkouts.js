import {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Theme from '../styles/theme';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {DarkColors, LightColors} from '../styles/colors';
import {useDarkMode} from 'react-native-dynamic';
import Container from '../components/Container';
import Paragraph from '../components/Paragraph';
import Section from '../components/Section';

const MyWorkouts = () => {
  const uid = useSelector(state => state?.user.uid);
  const [workouts, setWorkouts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const isDarkMode = useDarkMode();

  const renderItem = ({item, index}) => {
    const workout = item;

    return (
      <View
        style={[
          Theme.shadow,
          {
            padding: 10,
            backgroundColor: isDarkMode ? DarkColors.stroke : LightColors.white,
            marginBottom: 16,
            borderRadius: 8,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setExpandedId(expandedId === index ? null : index);
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 0.2}}>
              <Image
                source={{uri: workout.image}}
                style={{width: 50, height: 50, borderRadius: 8}}
              />
            </View>
            <View style={{flex: 0.75}}>
              <Paragraph style={{fontWeight: '600'}}>{workout.title}</Paragraph>
              <Paragraph style={{fontSize: 12}}>
                {new Date(item.timestamp.seconds * 1000).toLocaleDateString(
                  'TR-tr',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )}
              </Paragraph>
            </View>
            <View style={{flex: 0.07}}>
              <MaterialIcon
                name="keyboard-arrow-down"
                color={isDarkMode ? DarkColors.textGray : LightColors.textGray}
                size={24}
              />
            </View>
          </View>
        </TouchableOpacity>
        {
          // If the item is expanded, show the details
          expandedId === index ? (
            <View
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderColor: isDarkMode
                  ? DarkColors.stroke
                  : LightColors.stroke,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Paragraph style={{fontWeight: '600', fontSize: 14}}>
                  🔥 Calories Burned
                </Paragraph>
                <Paragraph style={{fontSize: 14}}>
                  {item.caloriesBurned} kcal
                </Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Paragraph style={{fontWeight: '600', fontSize: 14}}>
                  🕒 Time
                </Paragraph>
                <Paragraph style={{fontSize: 14}}>
                  {item.time <= 1
                    ? `${item.time} minute`
                    : `${item.time} minutes`}
                </Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Paragraph style={{fontWeight: '600', fontSize: 14}}>
                  💪 Like
                </Paragraph>
                <Paragraph style={{fontSize: 14}}>
                  {item.time <= 1
                    ? `${item.time} minute`
                    : `${item.time} minutes`}
                </Paragraph>
              </View>
            </View>
          ) : null
        }
      </View>
    );
  };

  useEffect(() => {
    setWorkouts([]); // Clear workouts

    firestore()
      .collection('CompletedWorkouts')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          setWorkouts(prev => [...prev, documentSnapshot.data()]);
        });
        setWorkouts(prev =>
          prev.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds),
        );
      });

    return () => {
      setWorkouts([]); // Clear workouts
    };
  }, []);

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
      <Section>
        <FlatList data={workouts} renderItem={renderItem} />
      </Section>
    </Container>
  );
};

export default MyWorkouts;
