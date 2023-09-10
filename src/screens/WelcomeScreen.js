import {ImageBackground} from 'react-native';
import {Button, Text, Carousel, View, Card, Colors} from 'react-native-ui-lib';

const WelcomeScreen = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={{flex: 1, width: '100%', height: '100%'}}
        source={require('../assets/images/welcomescreen.jpg')}>
        <Card
          flex
          paddingH-40
          paddingT-30
          paddingB-60
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            backgroundColor: Colors.bgColor,
          }}>
          <Carousel pageControlPosition="under" autoplay loop>
            <View>
              <Text center h1 marginB-10 textColor>
                Welcome to Fitcare
              </Text>
              <Text center p textLightColor>
                Welcome to Fitcare Health & Fitness app! Exercise and achieve a
                healthy lifestyle.
              </Text>
            </View>
            <View>
              <Text center h1 marginB-10 textColor>
                Stay Fit
              </Text>
              <Text center p textLightColor>
                Exercise to stay fit and maintain your form. Be the center of
                attention.
              </Text>
            </View>
            <View>
              <Text center h1 marginB-10 textColor>
                Health Tracking
              </Text>
              <Text center p textLightColor>
                Track your calories, steps, and weights. Protect your health.
              </Text>
            </View>
          </Carousel>
          <Button
            enableShadow
            label="Get Started"
            style={{width: '100%'}}
            onPress={() => {
              navigation.navigate('Login');
            }}
          />
        </Card>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;
