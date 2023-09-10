import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const VerticalStatsBar = props => {
  return (
    <View>
      <View style={styles.verticalStatsBar}>
        <View style={[styles.verticalStatsBarActive, {height: `${props.height}%`}]}></View>
      </View>
      <Text style={styles.verticalStatsBarText}>{props.day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  verticalStatsBar: {
    width: 15,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
  verticalStatsBarActive: {
    backgroundColor: '#643EB3',
    width: 15,
    borderRadius: 8,
    maxHeight: 50
  },
  verticalStatsBarText: {
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 5,
    color: '#404B52',
  },
});

export default VerticalStatsBar;
