import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import Container from '../components/Container';
import Heading from '../components/Heading';
import Input from '../components/Input';
import Paragraph from '../components/Paragraph';
import Section from '../components/Section';
import Subheading from '../components/Subheading';
import WorkoutCard from '../components/WorkoutCard';
import WorkoutCardHorizontal from '../components/WorkoutCardHorizontal';
import {DarkColors, LightColors} from '../styles/colors';
import Theme from '../styles/theme';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-3671742292502512/6278980653';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3671742292502512/3229025924';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const Home = ({route, navigation}) => {
  const [search, setSearch] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const user = useSelector(state => state?.user.data);
  const isDarkMode = useDarkMode();

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
    firestore()
      .collection('Workouts')
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          const id = doc.id;
          const data = {
            id: id,
            ...doc.data(),
          };
          setWorkouts(prev => [...prev, data]);
        });
      });
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

  if (search.length > 0) {
    return (
      <Container style={{paddingBottom: 30}}>
        <Section style={[Section, {marginTop: 24}]}>
          <Heading style={{marginBottom: 0}}>Hi, {user?.fullName}</Heading>
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
          />
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
          />
        </Section>
      </Container>
    );
  }

  return (
    <Container style={{paddingBottom: 30}}>
      <Section style={[Section, {marginTop: 24}]}>
        <Heading style={{marginBottom: 0}}>Hi, {user?.fullName}</Heading>
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
        />
      </Section>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      <ScrollView
        contentContainerStyle={
          Platform.OS === 'ios'
            ? {paddingBottom: 16, marginTop: 16}
            : {paddingBottom: 48, marginTop: 16}
        }>
        {/* <Section>
          <Subheading>Categories</Subheading>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              navigation.navigate('Categories');
            }}>
            <Paragraph style={{marginRight: 3, fontSize: 14}}>
              View All
            </Paragraph>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={Theme.colors.textGray}
            />
          </TouchableOpacity>
        </Section>
        <Section>
          <CategoryIcon icon="🏃‍♂️" title="Cardio" onPress={() => {}} />
          <CategoryIcon icon="🏋️‍♂️" title="Strength" onPress={() => {}} />
          <CategoryIcon icon="🧘‍♂️" title="Yoga" onPress={() => {}} />
          <CategoryIcon icon="🤸‍♂️" title="Flexibility" onPress={() => {}} />
        </Section> */}
        <Section>
          <ImageBackground
            style={{
              width: '100%',
              borderRadius: 8,
              overflow: 'hidden',
            }}
            source={{uri: workouts[0]?.image}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('WorkoutDetails', {data: workouts[0]})
              }>
              <View style={Theme.overlay} />
              <View style={{padding: 24, width: '100%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 24,
                    fontWeight: '600',
                    marginBottom: 16,
                    width: '70%',
                  }}>
                  {workouts[0]?.title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 16, width: '70%'}}
                    numberOfLines={2}>
                    {workouts[0]?.description}
                  </Text>
                  <MaterialIcons name="play-arrow" size={24} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </Section>
        <Section>
          <Subheading>Popular Workouts</Subheading>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              navigation.navigate('Training');
            }}>
            <Text style={{color: Theme.colors.textGray, marginRight: 3}}>
              View All
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={Theme.colors.textGray}
            />
          </TouchableOpacity>
        </Section>
        <ScrollView horizontal={true}>
          <Section>
            {workouts.map((workout, id) => {
              return (
                <WorkoutCard
                  key={id}
                  title={workout.title}
                  image={workout.image}
                  duration={workout.duration}
                  category={workout.categories[0]}
                  onPress={() =>
                    navigation.navigate('WorkoutDetails', {
                      screen: 'Workout',
                      data: workout,
                    })
                  }
                />
              );
            })}
          </Section>
        </ScrollView>
        <Section>
          <Subheading>All Trainings</Subheading>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              navigation.navigate('Training');
            }}>
            <Text style={{color: Theme.colors.textGray, marginRight: 3}}>
              View All
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={Theme.colors.textGray}
            />
          </TouchableOpacity>
        </Section>
        <Section style={{flexDirection: 'column'}}>
          {workouts.map((workout, id) => {
            return (
              <WorkoutCardHorizontal
                key={id}
                title={workout.title}
                image={workout.image}
                duration={workout.duration}
                category={workout.categories[0]}
                onPress={() =>
                  navigation.navigate('WorkoutDetails', {
                    screen: 'Workout',
                    data: workout,
                  })
                }
              />
            );
          })}
        </Section>
      </ScrollView>
    </Container>
  );
};

export default Home;
