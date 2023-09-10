import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Dimensions} from 'react-native';
import {
  Button,
  Colors,
  Image,
  Incubator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import {useDispatch} from 'react-redux';
import {getUser, userData} from '../store/auth/userSlice';
import Google from '../assets/images/svg/Google';
import Icon from 'react-native-vector-icons/FontAwesome';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '601462898727-ur7tp8v5ro91qp9r94uvpr3tug9in35k.apps.googleusercontent.com',
});

const SCREENWIDTH = Dimensions.get('window').width;

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);

  // ** Apple Auth
  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    const acr = auth().signInWithCredential(appleCredential);
  };

  // ** Google Auth
  const onGoogleButtonPress = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const setUserData = async uid => {
    await firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(snapshot => {
        dispatch(userData(snapshot.data()));
      });
  };

  const onLogin = () => {
    setLoadingModal(true);
    if (email === '' || password === '') {
      setLoadingModal(false);
      Alert.alert(
        'Sign In Error',
        'Please enter your email and password to sign in.',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      );
    } else {
      setLoadingModal(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(data => {
          setLoadingModal(false);
          dispatch(getUser(data.user.uid));
          setUserData(data.user.uid);
        })
        .catch(error => {
          setLoadingModal(false);
          alert(error.message);
        });
      setLoadingModal(false);
    }
  };

  return (
    <View flex center useSafeArea backgroundColor={Colors.bgColor}>
      <Text h1 textColor marginB-5 marginH-30>
        Welcome to Fitcare 💪
      </Text>
      <Text p center marginB-20 marginH-30>
        Reach your fitness goals with Fitcare app.
      </Text>
      <View style={{width: Dimensions.get('window').width - 30}}>
        <Incubator.TextField
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          autoCorrect={false}
          marginB-15
        />
        <Incubator.TextField
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          autoCapitalize="none"
          autoCorrect={false}
          validate={['required', 'email', value => value.length > 6]}
          secureTextEntry
          marginB-15
        />
        <Button
          label="Sign In"
          disabled={loadingModal}
          onPress={onLogin}
          enableShadow
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text center primaryColor marginV-20>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>
      <View marginT-10 marginB-30>
        <Text p textLightColor center>
          or sign in with
        </Text>
      </View>
      <View row>
        <TouchableOpacity
          center
          marginL-5
          marginR-5
          activeOpacity={0.8}
          onPress={() => onGoogleButtonPress()}>
          <Google />
        </TouchableOpacity>
        <TouchableOpacity
          center
          marginL-5
          marginR-5
          activeOpacity={0.8}
          onPress={() =>
            onAppleButtonPress().then(() =>
              console.log('Apple sign-in complete!'),
            )
          }>
          <Icon name="apple" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View marginT-20 row style={{position: 'absolute', bottom: 60}}>
        <Text p textLightColor>
          Don't have an account?
        </Text>
        <TouchableOpacity
          marginL-5
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={{lineHeight: 24}} primaryColor>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
