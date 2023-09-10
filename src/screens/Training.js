import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import IconButton from '../components/IconButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WorkoutCardHorizontal from '../components/WorkoutCardHorizontal';
import Theme from '../styles/theme';
import Container from '../components/Container';
import Section from '../components/Section';
import Input from '../components/Input';
import Heading from '../components/Heading';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';
import Paragraph from '../components/Paragraph';
import firestore from '@react-native-firebase/firestore';
import {TestIds, BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3671742292502512/3229025924';

const Training = ({navigation}) => {
  const [search, setSearch] = useState('');
  const isDarkMode = useDarkMode();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const list = [];

      await firestore()
        .collection('Workouts')
        .get()
        .then(snapshot => {
          snapshot.docs.map(doc => {
            const id = doc.id;
            const data = {
              id: id,
              ...doc.data(),
            };
            list.push(data);
          });
        });

      setWorkouts(list);
    };
    fetchWorkouts();

    return () => setWorkouts([]);
  }, []);

  const searchRenderItem = ({item, index}) => (
    <WorkoutCardHorizontal
      key={index}
      title={item.title}
      image={item.image}
      duration={item.duration}
      category={item.categories[0]}
      onPress={() =>
        navigation.navigate('WorkoutDetails', {
          screen: 'Workout',
          data: item,
        })
      }
    />
  );

  const searchFilter = (item, index) => {
    if (item.title.toLowerCase().includes(search)) {
      return item;
    }
  };

  return (
    <Container>
      <Section style={{marginTop: 24}}>
        <Heading style={{marginBottom: 0}}>Training</Heading>
        {/* <IconButton
          name="bell-outline"
          size={24}
          style={{
            borderWidth: 1,
            borderColor: isDarkMode ? DarkColors.stroke : LightColors.stroke,
          }}
          color={isDarkMode ? DarkColors.text : LightColors.text}
        /> */}
      </Section>
      <Section style={{marginBottom: 16}}>
        <View style={{position: 'absolute', zIndex: 9, paddingLeft: 15}}>
          <MaterialIcons
            name="search"
            size={24}
            color={isDarkMode ? DarkColors.text : LightColors.text}
          />
        </View>
        <Input
          style={{paddingLeft: 50}}
          placeholder="Search something..."
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={text => setSearch(text)}
          placeholderTextColor={isDarkMode ? DarkColors.text : LightColors.text}
        />
      </Section>
      <Section>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{width: '100%'}}
          onPress={() => {
            navigation.navigate('CreateWorkout');
          }}>
          <ImageBackground
            style={{
              width: '100%',
              borderRadius: 8,
              overflow: 'hidden',
            }}
            source={require('../assets/images/welcomescreen.jpg')}>
            <View style={Theme.overlay} />
            <View
              style={{
                padding: 24,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: '600',
                  width: '70%',
                }}>
                Create Personal Training
              </Text>
              <MaterialIcons name="add" size={24} color="#fff" />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Section>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      {workouts.filter(searchFilter).length === 0 ? (
        <Section style={{marginTop: 16}}>
          <Paragraph>No data found</Paragraph>
        </Section>
      ) : null}
      <Section style={{marginTop: 16}}>
        <FlatList
          data={workouts.filter(searchFilter)}
          renderItem={searchRenderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={[
            Section,
            {justifyContent: 'space-between', flexDirection: 'column'},
          ]}
          style={{marginBottom: 40}}
        />
      </Section>
    </Container>
  );
};

export default Training;
