import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import React, {Fragment, useEffect} from 'react';
import IconButton from '../components/IconButton';
import Feather from 'react-native-vector-icons/Feather';
import {useState} from 'react';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import {userData} from '../store/auth/userSlice';
import Container from '../components/Container';
import Paragraph from '../components/Paragraph';
import Section from '../components/Section';
import Input from '../components/Input';
import Theme from '../styles/theme';
import Subheading from '../components/Subheading';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';

const WeightTracking = ({navigation}) => {
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [data, setData] = useState([]);
  const [weights, setWeights] = useState([]);

  const isDarkMode = useDarkMode();

  const WeightTrackItem = props => (
    <Section
      style={[
        {
          backgroundColor: isDarkMode ? DarkColors.stroke : LightColors.white,
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderRadius: 8,
        },
        Theme.shadow,
      ]}>
      <View>
        <Paragraph style={{fontSize: 12, marginBottom: 3}}>
          {props.date}
        </Paragraph>
        <Subheading style={{fontSize: 16}}>{props.weight} kg</Subheading>
      </View>
      <View>
        <Paragraph
          style={{fontSize: 12, alignSelf: 'flex-end', marginBottom: 3}}>
          {props.time}
        </Paragraph>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
          <Subheading
            style={{
              fontSize: 16,
              color:
                props.change === (0).toFixed(1)
                  ? isDarkMode
                    ? DarkColors.text
                    : LightColors.textGray
                  : props.change > 0
                  ? isDarkMode
                    ? DarkColors.danger
                    : LightColors.danger
                  : isDarkMode
                  ? DarkColors.success
                  : LightColors.success,
              marginRight: 8,
            }}>
            {props.change} kg
          </Subheading>
          <Feather
            name={
              props.change === (0).toFixed(1)
                ? 'minus-circle'
                : props.change > 0
                ? 'arrow-up-circle'
                : 'arrow-down-circle'
            }
            size={20}
            color={
              props.change === (0).toFixed(1)
                ? isDarkMode
                  ? DarkColors.text
                  : LightColors.textGray
                : props.change > 0
                ? isDarkMode
                  ? DarkColors.danger
                  : LightColors.danger
                : isDarkMode
                ? DarkColors.success
                : LightColors.success
            }
          />
        </View>
      </View>
    </Section>
  );

  const renderItem = ({item, index}) => {
    const itemDate = new Date(item.date);
    const date = itemDate.getDate() + '/' + (parseInt(itemDate.getMonth()) + 1);
    const time = itemDate.getHours() + ':' + itemDate.getMinutes();
    const change =
      data.length - 1 === index
        ? (0).toFixed(1)
        : (item.weight - data[index + 1].weight).toFixed(1);

    return (
      <WeightTrackItem
        item={item}
        date={date}
        change={change}
        time={time}
        weight={item.weight}
      />
    );
  };

  const saveWeight = async () => {
    const weightData = {
      date: new Date().getTime(),
      weight: newWeight,
      uid: user.uid,
    };

    await firestore()
      .collection('WeightTracking')
      .add(weightData)
      .then(() => {
        setModal(false);
        setNewWeight('');
        setData([weightData, ...data]);
        setWeights(prevState => [
          ...prevState,
          {
            value: parseFloat(newWeight),
            dataPointText: newWeight,
          },
        ]);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Success',
          text2: 'Weight added successfully',
        });
        updateWeight();
      });
  };

  const updateWeight = async () =>
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        weight: newWeight,
      })
      .then(() => {
        dispatch(
          userData({
            ...user.data,
            weight: newWeight,
          }),
        );
      });

  const getData = async () => {
    await firestore()
      .collection('WeightTracking')
      .where('uid', '==', user.uid)
      .orderBy('date', 'desc')
      .get()
      .then(response => {
        response.forEach(doc => {
          setData(prevState => [...prevState, doc.data()]);
          setWeights(prevState => [
            {
              value: parseFloat(doc.data().weight),
              dataPointText: doc.data().weight,
            },
            ...prevState,
          ]);
        });
      });
  };

  useEffect(() => {
    getData();

    return () => {
      setData([]);
      setWeights([]);
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Weight Tracking',
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
      headerRight: () => (
        <IconButton
          name="plus"
          size={24}
          color={isDarkMode ? DarkColors.text : LightColors.text}
          onPress={() => setModal(true)}
        />
      ),
    });
  }, []);

  return (
    <Container>
      <FlatList
        data={data}
        renderItem={renderItem}
        scrollEnabled
        style={{marginTop: Platform.OS === 'ios' ? 0 : 20, marginBottom: 80}}
      />
      <Modal visible={modal} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.white,
              padding: 20,
              borderRadius: 10,
              width: SCREEN_WIDTH - 40,
            }}>
            <Fragment>
              <View>
                <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                  Add New Weight
                </Paragraph>
              </View>
              <View>
                <Input
                  style={{
                    width: SCREEN_WIDTH - 80,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: isDarkMode
                      ? DarkColors.textGray
                      : LightColors.stroke,
                  }}
                  placeholder={'Enter your current weight'}
                  keyboardType={'numeric'}
                  value={newWeight}
                  onChangeText={number => setNewWeight(number)}
                />
              </View>
            </Fragment>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  setModal(false);
                  setNewWeight('');
                }}>
                <Paragraph
                  style={{
                    fontWeight: '500',
                    color: isDarkMode
                      ? DarkColors.primary
                      : LightColors.primary,
                    marginLeft: 20,
                  }}>
                  Cancel
                </Paragraph>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  saveWeight();
                }}>
                <Paragraph
                  style={{
                    fontWeight: '500',
                    color: isDarkMode
                      ? DarkColors.primary
                      : LightColors.primary,
                    marginLeft: 20,
                  }}>
                  Save
                </Paragraph>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default WeightTracking;
