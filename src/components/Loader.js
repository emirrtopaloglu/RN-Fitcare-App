import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator, Text, Dimensions} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;

const Loader = props => {
  const {loading, title, ...attributes} = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('Close Modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {
            title && <Text style={styles.title}>{title}</Text>
          }
          <ActivityIndicator animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: SCREENWIDTH / 2,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    textAlign: 'center',
    lineHeight: 20
  }
});

export default Loader;
