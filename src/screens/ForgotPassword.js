import auth from '@react-native-firebase/auth';
import {useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import {
  Button,
  Colors,
  Incubator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import {useDispatch} from 'react-redux';

const SCREENWIDTH = Dimensions.get('window').width;

const ForgotPassword = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);

  const onSubmit = async () => {
    setLoadingModal(true);
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Email Sent',
        'Please check your email to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoadingModal(false);
  };

  return (
    <View flex center useSafeArea backgroundColor={Colors.bgColor}>
      <Text h1>🔒</Text>
      <Text h1 textColor marginB-5 marginH-30>
        Forgot Password
      </Text>
      <Text p center marginB-20 marginH-30>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>
      <View style={{width: Dimensions.get('window').width - 30}}>
        <Incubator.TextField
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
          autoCorrect={false}
          marginB-15
        />
        <Button
          label="Send Email"
          disabled={loadingModal}
          onPress={onSubmit}
          enableShadow
        />
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

export default ForgotPassword;
