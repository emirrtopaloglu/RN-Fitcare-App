import {useState, useRef, useEffect} from 'react';
import {StyleSheet, Dimensions, Alert, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {userData} from '../store/auth/userSlice';
import {useDispatch} from 'react-redux';
import {
  View,
  Colors,
  Text,
  Incubator,
  Button,
  Checkbox,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Google from '../assets/images/svg/Google';
import Icon from 'react-native-vector-icons/FontAwesome';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '601462898727-ur7tp8v5ro91qp9r94uvpr3tug9in35k.apps.googleusercontent.com',
});

const Signup = ({navigation}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    uid: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
    const acr = auth()
      .signInWithCredential(appleCredential)
      .then(response => {
        console.log(response);
        saveData(
          response.user.uid,
          response.user.email,
          response.user.displayName,
        );
      });
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
    return auth()
      .signInWithCredential(googleCredential)
      .then(response => {
        saveData(
          response.user.uid,
          response.user.email,
          response.user.displayName,
        );
      });
  };

  // ** Save Data to Firebase
  const saveData = async (uid, email, name) => {
    const user = {
      uid: uid,
      fullName: name ? name : signupData.fullName,
      email: email ? email : signupData.email ? signupData.email : '',
      accountInfoStatus: false,
    };

    await firestore()
      .collection('TempUsers')
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          return false;
        }
      });

    await firestore()
      .collection('TempUsers')
      .doc(uid)
      .set(user)
      .then(response => {
        console.log(response);
        console.log('User added to database');
        dispatch(userData(user));
      });
  };

  const onSignup = async () => {
    const {fullName, email, password, confirmPassword} = signupData;
    if (
      fullName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      Alert.alert('Sign Up Error', 'Please fill out all fields to sign up.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ]);
    } else if (signupData.password !== signupData.confirmPassword) {
      Alert.alert('Sign Up Error', 'Passwords do not match.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ]);
    } else if (password.length < 8) {
      Alert.alert('Sign Up Error', 'Password must be at least 8 characters.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ]);
    } else if (email.indexOf('@') === -1) {
      Alert.alert('Sign Up Error', 'Please enter a valid email address.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ]);
    } else if (checked === false) {
      Alert.alert('Sign Up Error', 'Please agree to the privacy policy.', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ]);
    } else {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          saveData(response.user.uid);
        })
        .catch(error => {
          Alert.alert('Sign Up Error', error.message, [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
              style: 'cancel',
            },
          ]);
        });
    }
  };

  return (
    <View flex center useSafeArea backgroundColor={Colors.bgColor}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <Text h1 textColor marginB-5 marginH-30>
          Join to Fitcare 💪
        </Text>
        <Text p center marginB-20 marginH-30>
          Create an account to get started.
        </Text>
        <View style={{width: Dimensions.get('window').width - 30}}>
          <Incubator.TextField
            placeholder="Full Name"
            onChangeText={text => {
              setSignupData({...signupData, fullName: text});
            }}
            value={signupData.fullName}
            marginB-15
            autoCapitalize="words"
            autoCorrect={false}
            autoCompleteType="name"
          />
          <Incubator.TextField
            placeholder="Email"
            onChangeText={text => {
              setSignupData({...signupData, email: text});
            }}
            value={signupData.email}
            marginB-15
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <Incubator.TextField
            placeholder="Password"
            onChangeText={text => {
              setSignupData({...signupData, password: text});
            }}
            value={signupData.password}
            marginB-15
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            secureTextEntry
          />
          <Incubator.TextField
            placeholder="Confirm Password"
            onChangeText={text => {
              setSignupData({...signupData, confirmPassword: text});
            }}
            value={signupData.confirmPassword}
            marginB-15
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            secureTextEntry
          />
          <Checkbox
            value={checked}
            onValueChange={value => setChecked(value)}
            label={'By continuing you accept our Privacy Policy'}
            containerStyle={{marginBottom: 15}}
            labelStyle={{color: Colors.textLightColor}}
            size={20}
            borderRadius={100}
          />
          <Button
            label="Sign Up"
            disabled={loading}
            onPress={onSignup}
            enableShadow
            marginB-20
          />
        </View>
        <View marginT-10 marginV-30>
          <Text p textLightColor center>
            or sign up with
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
            Already have an account?
          </Text>
          <TouchableOpacity
            marginL-5
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}>
            <Text style={{lineHeight: 24}} primaryColor>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Signup;
