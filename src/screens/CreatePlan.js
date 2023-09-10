import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SelectIconText from '../components/SelectIconText';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import Container from '../components/Container';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Heading from '../components/Heading';
import Input from '../components/Input';
import Paragraph from '../components/Paragraph';
import { useDispatch } from 'react-redux';
import { userData } from '../store/auth/userSlice';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;

const CreatePlan = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState({
    goal: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    goalWeight: '',
    trainingLevel: '',
    activities: [],
    // fullName: route.params.fullName,
    // email: route.params.email,
    // uid: route.params.uid,
    reminder: {
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      time: parseInt(new Date().getTime()),
    },
  });

  const isDarkMode = useDarkMode();

  useEffect(() => {
    navigation.setOptions({
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
            name="arrow-left"
            onPress={() => {
              step === 1 ? null : setStep(step - 1);
            }}
            color={isDarkMode ? DarkColors.text : LightColors.text}
            size={24}
          />
        );
      },
      headerTitle: `Step ${step} of 8`,
      headerRight: () => {
        return (
          <IconButton
            name="arrow-right"
            onPress={() => {
              step === 8 ? onComplete() : setStep(step + 1);
            }}
            color={isDarkMode ? DarkColors.text : LightColors.text}
            size={24}
          />
        );
      },
    });
  }, [step]);

  const onComplete = () => {
    setLoading(true);
    firestore()
      .collection('Users')
      .doc(userPlan.uid)
      .set(userPlan)
      .then(() => {
        setLoading(false);
        dispatch(userData(userPlan))
        navigation.navigate('Home');
      });
  };

  return (
    <Container>
      <Loader loading={loading} title="We prepare your plan..." />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {step === 1 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>Choose Gender</Heading>
            </View>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, gender: 'Woman'});
              }}
              icon="🙍‍♀️"
              style={
                userPlan.gender === 'Woman'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Woman
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, gender: 'Man'});
              }}
              icon="🙍‍♂️"
              style={
                userPlan.gender === 'Man'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Man
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, gender: 'Other'});
              }}
              icon="😊"
              style={
                userPlan.gender === 'Other'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Other
            </SelectIconText>
          </View>
        )}
        {step === 2 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>Choose Main Goal</Heading>
            </View>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, goal: 'Lose Weight'});
              }}
              icon="⚖️"
              style={
                userPlan.goal === 'Lose Weight'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Lose Weight
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, goal: 'Keep Fit'});
              }}
              icon="🍀"
              style={
                userPlan.goal === 'Keep Fit'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Keep Fit
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, goal: 'Get Stronger'});
              }}
              icon="💪"
              style={
                userPlan.goal === 'Get Stronger'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Get Stronger
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, goal: 'Gain Muscle Mass'});
              }}
              icon="🏋️‍♂️"
              style={
                userPlan.goal === 'Gain Muscle Mass'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Gain Muscle Mass
            </SelectIconText>
          </View>
        )}
        {step === 3 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>Select Age</Heading>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Input
                style={{width: 100, textAlign: 'center', fontSize: 20}}
                placeholder="60"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="number-pad"
                onChangeText={text => {
                  setUserPlan({...userPlan, age: text});
                }}
              />
            </View>
          </View>
        )}
        {step === 4 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>Select Height</Heading>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Input
                style={{
                  width: 100,
                  textAlign: 'center',
                  fontSize: 20,
                  marginRight: 10,
                }}
                placeholder="175"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="number-pad"
                onChangeText={text => {
                  setUserPlan({...userPlan, height: text});
                }}
              />
              <Paragraph style={{fontSize: 24}}>cm</Paragraph>
            </View>
          </View>
        )}
        {step === 5 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>Select Weight</Heading>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Input
                style={{
                  width: 100,
                  textAlign: 'center',
                  fontSize: 20,
                  marginRight: 10,
                }}
                placeholder="70"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="number-pad"
                onChangeText={text => {
                  setUserPlan({...userPlan, weight: text});
                }}
              />
              <Paragraph style={{fontSize: 24}}>kg</Paragraph>
            </View>
          </View>
        )}
        {step === 6 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>
                Select Goal Weight
              </Heading>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Input
                style={{
                  width: 100,
                  textAlign: 'center',
                  fontSize: 20,
                  marginRight: 10,
                }}
                placeholder="60"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="number-pad"
                onChangeText={text => {
                  setUserPlan({...userPlan, goalWeight: text});
                }}
              />
              <Paragraph style={{fontSize: 24}}>kg</Paragraph>
            </View>
          </View>
        )}
        {step === 7 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>
                Choose Your Training Level
              </Heading>
            </View>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, trainingLevel: 'Beginner'});
              }}
              subtitle="I want to start training"
              style={
                userPlan.trainingLevel === 'Beginner'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Beginner
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, trainingLevel: 'Irregular training'});
              }}
              subtitle="I train 1-2 times a week"
              style={
                userPlan.trainingLevel === 'Irregular training'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Irregular training
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, trainingLevel: 'Medium'});
              }}
              subtitle="I train 3-5 times a week"
              style={
                userPlan.trainingLevel === 'Medium'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Medium
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                setUserPlan({...userPlan, trainingLevel: 'Advanced'});
              }}
              subtitle="I train more than 5 times a week"
              style={
                userPlan.trainingLevel === 'Advanced'
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Advanced
            </SelectIconText>
          </View>
        )}
        {step === 8 && (
          <View>
            <View>
              <Heading style={{textAlign: 'center'}}>
                Choose activities that interest
              </Heading>
            </View>
            <SelectIconText
              onPress={() => {
                userPlan.activities.includes('Cardio')
                  ? setUserPlan({
                      ...userPlan,
                      activities: userPlan.activities.filter(
                        item => item !== 'Cardio',
                      ),
                    })
                  : setUserPlan({
                      ...userPlan,
                      activities: [...userPlan.activities, 'Cardio'],
                    });
              }}
              icon="🏃‍♂️"
              style={
                userPlan.activities.includes('Cardio')
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Cardio
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                userPlan.activities.includes('Power Lifting')
                  ? setUserPlan({
                      ...userPlan,
                      activities: userPlan.activities.filter(
                        item => item !== 'Power Lifting',
                      ),
                    })
                  : setUserPlan({
                      ...userPlan,
                      activities: [...userPlan.activities, 'Power Lifting'],
                    });
              }}
              icon="🏋️‍♂️"
              style={
                userPlan.activities.includes('Power Lifting')
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Power Lifting
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                userPlan.activities.includes('Stretch')
                  ? setUserPlan({
                      ...userPlan,
                      activities: userPlan.activities.filter(
                        item => item !== 'Stretch',
                      ),
                    })
                  : setUserPlan({
                      ...userPlan,
                      activities: [...userPlan.activities, 'Stretch'],
                    });
              }}
              icon="🤸‍♀️"
              style={
                userPlan.activities.includes('Stretch')
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Stretch
            </SelectIconText>
            <SelectIconText
              onPress={() => {
                userPlan.activities.includes('Yoga')
                  ? setUserPlan({
                      ...userPlan,
                      activities: userPlan.activities.filter(
                        item => item !== 'Yoga',
                      ),
                    })
                  : setUserPlan({
                      ...userPlan,
                      activities: [...userPlan.activities, 'Yoga'],
                    });
              }}
              icon="🧘‍♀️"
              style={
                userPlan.activities.includes('Yoga')
                  ? {
                      borderColor: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      backgroundColor: isDarkMode
                        ? DarkColors.primary_light
                        : LightColors.primary_light,
                    }
                  : null
              }>
              Yoga
            </SelectIconText>
          </View>
        )}
      </ScrollView>
      <View style={{width: SCREENWIDTH - 40, marginHorizontal: 20}}>
        <Button
          title={step === 8 ? 'Complete Plan' : 'Next'}
          onPressOut={() => {
            step === 8 ? onComplete() : setStep(step + 1);
          }}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREENWIDTH,
    height: SCREENHEIGHT,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 24,
    color: '#0A0615',
  },
  heading_second: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 34,
    fontWeight: '600',
    color: '#0A0615',
  },
  input: {
    width: SCREENWIDTH - 40,
    height: 50,
    backgroundColor: '#F1F4F8',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});

export default CreatePlan;
