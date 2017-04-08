import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Platform
} from 'react-native';

import MessageBubbleList from './messageBubbleList'

class Main extends Component {
  render() {
    return(
      <View style={styles.container}>
        <MessageBubbleList/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

module.exports = Main
