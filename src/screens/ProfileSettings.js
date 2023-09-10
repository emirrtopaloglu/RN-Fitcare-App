import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  Fragment,
} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Theme from '../styles/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  SCREEN_WIDTH,
} from '@gorhom/bottom-sheet';
import SettingItem from '../components/SettingItem';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {logout, userData} from '../store/auth/userSlice';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Container from '../components/Container';
import Paragraph from '../components/Paragraph';
import Input from '../components/Input';
import Section from '../components/Section';
import {useDarkMode} from 'react-native-dynamic';
import {DarkColors, LightColors} from '../styles/colors';

const ProfileSettings = ({navigation}) => {
  const user = useSelector(state => state?.user.data);
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    type: null,
  });
  const storageRef = storage().ref(
    'images/profile_photos/' + user?.uid + '.jpg',
  );
  const isDarkMode = useDarkMode();
  const bottomSheetModalRef = useRef();
  const snapPoints = useMemo(() => ['25%', '25%'], []);
  const [accountData, setAccountData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    age: user?.age,
    gender: user?.gender,
    height: user?.height,
    weight: user?.weight,
    goalWeight: user?.goalWeight,
    goal: user?.goal,
    trainingLevel: user?.trainingLevel,
  });
  const [tempData, setTempData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    age: user?.age,
    gender: user?.gender,
    height: user?.height,
    weight: user?.weight,
    goalWeight: user?.goalWeight,
    goal: user?.goal,
    trainingLevel: user?.trainingLevel,
  });

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleRemovePhoto = () => {
    setSkeletonLoading(false);
    storageRef
      .delete()
      .then(() => {
        setPhoto(null);
        setSkeletonLoading(true);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile photo removed successfully',
        });
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      });
    handleDismissModalPress();
  };

  const handleChoosePhoto = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async image => {
        setSkeletonLoading(false);
        await storageRef.putFile(image.path);
        const url = await storageRef.getDownloadURL();
        setPhoto(url);
        setSkeletonLoading(true);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile photo updated successfully',
        });
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      });
    handleDismissModalPress();
  };

  const handleTakePhoto = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async image => {
        setSkeletonLoading(false);
        await storageRef.putFile(image.path);
        const url = await storageRef.getDownloadURL();
        setPhoto(url);
        setSkeletonLoading(true);
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      });
    handleDismissModalPress();
  };

  const handleSaveSettings = () => {
    firestore()
      .collection('Users')
      .doc(user?.uid)
      .update(tempData)
      .then(() => {
        dispatch(userData({...user?.data, tempData}));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account settings updated successfully',
        });
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      });
  };

  useEffect(() => {
    storageRef
      .getDownloadURL()
      .then(url => {
        setPhoto(url);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  const deleteAccount = () => {
    Alert.alert(
      'Delete Account',
      "Are you sure you want to delete your account? You can't undo this action.",
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            firestore()
              .collection('Users')
              .doc(user?.uid)
              .delete()
              .then(() => {
                auth()
                  .currentUser.delete()
                  .then(() => {
                    dispatch(logout());
                    Toast.show({
                      type: 'success',
                      text1: 'Success',
                      text2: 'Account deleted successfully',
                    });
                  })
                  .catch(error => {
                    console.log(error);
                    Toast.show({
                      type: 'error',
                      text1: 'Error',
                      text2: "Log in again before retrying this request"
                    });
                  });
              })
              .catch(error => {
                console.log(error);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Something went wrong',
                });
              });
          }
        }
      ],
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setSkeletonLoading(true);
    }, 2000);
  }, []);

  return (
    <BottomSheetModalProvider>
      <Container>
        <Section
          style={[
            {justifyContent: 'center', flexDirection: 'column'},
            Platform.OS == 'android' ? {marginTop: 20} : {},
          ]}>
          <BottomSheetModal
            style={{
              zIndex: 999,
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.background,
            }}
            ref={bottomSheetModalRef}
            backgroundStyle={{
              backgroundColor: isDarkMode
                ? DarkColors.stroke
                : LightColors.background,
              borderWidth: 1,
              borderColor: isDarkMode
                ? DarkColors.textGray
                : LightColors.stroke,
            }}
            index={1}
            snapPoints={snapPoints}>
            <SettingItem title="Take a new photo" onPress={handleTakePhoto} />
            <SettingItem
              title="Choose from gallery"
              onPress={handleChoosePhoto}
            />
            {photo ? (
              <SettingItem
                title="Remove profile photo"
                color={isDarkMode ? DarkColors.danger : LightColors.danger}
                onPress={handleRemovePhoto}
              />
            ) : null}
          </BottomSheetModal>
          <View>
            <ShimmerPlaceholder
              style={{width: 128, height: 128, borderRadius: 100}}
              LinearGradient={LinearGradient}
              visible={skeletonLoading}>
              <Image
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 100,
                  resizeMode: 'cover',
                  overflow: 'hidden',
                }}
                source={
                  photo
                    ? {uri: photo}
                    : require('../assets/images/default_profile.png')
                }
              />
            </ShimmerPlaceholder>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePresentModalPress}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: isDarkMode
                  ? DarkColors.textGray
                  : LightColors.primary,
                borderRadius: 50,
                overflow: 'hidden',
                padding: 3,
              }}>
              <View
                style={{
                  backgroundColor: isDarkMode
                    ? DarkColors.textGray
                    : LightColors.ProfileSettings,
                  padding: 5,
                  borderRadius: 50,
                }}>
                <MaterialIcons
                  name="photo-camera"
                  size={20}
                  color={isDarkMode ? DarkColors.textDark : LightColors.white}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Section>
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
            title="Full Name"
            onPress={() => {
              setModal({type: 'fullName', visible: true});
            }}
            value={accountData.fullName}
          />
          <SettingItem
            title="Email"
            onPress={() => {
              setModal({type: 'email', visible: true});
            }}
            value={accountData.email}
          />
          <SettingItem
            title="Age"
            onPress={() => {
              setModal({type: 'age', visible: true});
            }}
            value={`${accountData.age} years`}
          />
          <SettingItem
            title="Gender"
            onPress={() => {
              setModal({type: 'gender', visible: true});
            }}
            value={accountData.gender}
          />
          <SettingItem
            title="Height"
            onPress={() => {
              setModal({type: 'height', visible: true});
            }}
            value={`${accountData.height} cm`}
          />
          <SettingItem
            title="Weight"
            onPress={() => {
              navigation.navigate('WeightTracking');
            }}
            value={`${accountData.weight} kg`}
          />
          <SettingItem
            title="Weight Goal"
            onPress={() => {
              setModal({type: 'goalWeight', visible: true});
            }}
            value={`${accountData.goalWeight} kg`}
          />
          <SettingItem
            title="Training Goal"
            onPress={() => {
              setModal({type: 'goal', visible: true});
            }}
            value={accountData.goal}
          />
          <SettingItem
            title="Training Level"
            onPress={() => {
              setModal({type: 'trainingLevel', visible: true});
            }}
            value={accountData.trainingLevel}
          />
          <SettingItem
            title="Delete My Account"
            onPress={deleteAccount}
            color={isDarkMode ? DarkColors.danger : LightColors.danger}
            lastItem
          />
        </Section>
        <View />
        <Section style={{flexDirection: 'row'}}>
          <Button title="Save Settings" onPress={handleSaveSettings} />
        </Section>
        <Modal visible={modal.visible} transparent={true}>
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
                width: SCREEN_WIDTH - 60,
              }}>
              {modal.type == 'fullName' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Full Name
                    </Paragraph>
                  </View>
                  <View>
                    <Input
                      style={{
                        width: SCREEN_WIDTH - 100,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? DarkColors.textGray
                          : LightColors.stroke,
                      }}
                      placeholder={'Enter your full name'}
                      value={tempData.fullName}
                      onChangeText={text =>
                        setTempData({...tempData, fullName: text})
                      }
                    />
                  </View>
                </Fragment>
              ) : null}
              {modal.type == 'email' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Email
                    </Paragraph>
                  </View>
                  <View>
                    <Input
                      style={{
                        width: SCREEN_WIDTH - 100,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? DarkColors.textGray
                          : LightColors.stroke,
                      }}
                      placeholder={'Enter your email'}
                      value={tempData.email}
                      onChangeText={text =>
                        setTempData({...tempData, email: text})
                      }
                    />
                  </View>
                </Fragment>
              ) : null}
              {modal.type == 'age' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Age
                    </Paragraph>
                  </View>
                  <View>
                    <Input
                      style={{
                        width: SCREEN_WIDTH - 100,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? DarkColors.textGray
                          : LightColors.stroke,
                      }}
                      placeholder={'Enter your age'}
                      value={tempData.age}
                      onChangeText={text =>
                        setTempData({...tempData, age: text})
                      }
                    />
                  </View>
                </Fragment>
              ) : null}
              {modal.type == 'height' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Height
                    </Paragraph>
                  </View>
                  <View>
                    <Input
                      style={{
                        width: SCREEN_WIDTH - 100,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? DarkColors.textGray
                          : LightColors.stroke,
                      }}
                      placeholder={'Enter your height'}
                      value={tempData.height}
                      onChangeText={text =>
                        setTempData({...tempData, height: text})
                      }
                    />
                  </View>
                </Fragment>
              ) : null}
              {modal.type == 'goalWeight' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Weight Goal
                    </Paragraph>
                  </View>
                  <View>
                    <Input
                      style={{
                        width: SCREEN_WIDTH - 100,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: isDarkMode
                          ? DarkColors.textGray
                          : LightColors.stroke,
                      }}
                      placeholder={'Enter your weight goal'}
                      value={tempData.goalWeight}
                      onChangeText={text =>
                        setTempData({...tempData, goalWeight: text})
                      }
                    />
                  </View>
                </Fragment>
              ) : null}
              {modal.type == 'gender' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Gender
                    </Paragraph>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, gender: 'Man'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.gender == 'Man' ? true : false}
                      onPress={() => {
                        setTempData({...tempData, gender: 'Man'});
                      }}
                    />
                    <Paragraph style={{marginLeft: 10}}>Man</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, gender: 'Woman'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.gender == 'Woman' ? true : false}
                      onPress={() => {
                        setTempData({...tempData, gender: 'Woman'});
                      }}
                    />
                    <Paragraph style={{marginLeft: 10}}>Woman</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, gender: 'Other'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.gender == 'Other' ? true : false}
                      onPress={() => {
                        setTempData({...tempData, gender: 'Other'});
                      }}
                    />
                    <Paragraph style={{marginLeft: 10}}>Other</Paragraph>
                  </TouchableOpacity>
                </Fragment>
              ) : null}
              {modal.type == 'goal' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Training Goal
                    </Paragraph>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, goal: 'Lose Weight'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.goal == 'Lose Weight' ? true : false}
                    />
                    <Paragraph style={{marginLeft: 10}}>Lose Weight</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, goal: 'Keep Fit'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.goal == 'Keep Fit' ? true : false}
                    />
                    <Paragraph style={{marginLeft: 10}}>Keep Fit</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, goal: 'Get Stronger'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.goal == 'Get Stronger' ? true : false}
                    />
                    <Paragraph style={{marginLeft: 10}}>Get Stronger</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, goal: 'Muscle Mass'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={tempData.goal == 'Muscle Mass' ? true : false}
                    />
                    <Paragraph style={{marginLeft: 10}}>Muscle Mass</Paragraph>
                  </TouchableOpacity>
                </Fragment>
              ) : null}
              {modal.type == 'trainingLevel' ? (
                <Fragment>
                  <View>
                    <Paragraph style={{fontWeight: '500', marginBottom: 10}}>
                      Training Level
                    </Paragraph>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, trainingLevel: 'Beginner'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={
                        tempData.trainingLevel == 'Beginner' ? true : false
                      }
                    />
                    <Paragraph style={{marginLeft: 10}}>Beginner</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({
                        ...tempData,
                        trainingLevel: 'Irregular training',
                      });
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={
                        tempData.trainingLevel == 'Irregular training'
                          ? true
                          : false
                      }
                    />
                    <Paragraph style={{marginLeft: 10}}>
                      Irregular training
                    </Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, trainingLevel: 'Medium'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={
                        tempData.trainingLevel == 'Medium' ? true : false
                      }
                    />
                    <Paragraph style={{marginLeft: 10}}>Medium</Paragraph>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setTempData({...tempData, trainingLevel: 'Advanced'});
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Checkbox
                      checked={
                        tempData.trainingLevel == 'Advanced' ? true : false
                      }
                    />
                    <Paragraph style={{marginLeft: 10}}>Advanced</Paragraph>
                  </TouchableOpacity>
                </Fragment>
              ) : null}
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    setTempData({...accountData});
                    setModal({type: null, visible: false});
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
                    setAccountData({...accountData, ...tempData});
                    setModal({type: null, visible: false});
                  }}>
                  <Paragraph
                    style={{
                      fontWeight: '500',
                      color: isDarkMode
                        ? DarkColors.primary
                        : LightColors.primary,
                      marginLeft: 20,
                    }}>
                    OK
                  </Paragraph>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
      <Toast bottomOffset={20} />
    </BottomSheetModalProvider>
  );
};

export default ProfileSettings;
