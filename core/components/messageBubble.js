import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Linking,
  TouchableHighlight
} from 'react-native'

//3 types of message bubble sender, senderWtitle(has a link and is clickable), action
class MessageBubble extends Component {
  propTypes: {
    message_type: React.propTypes.string,
    msg: React.propTypes.string,
    url: React.propTypes.string,
  }

  setBubbleStyle(type: string) {
    switch (type) {
      case "sender":
        return styles.sender;

      case "sender_title":
        return styles.senderWtitle;

      case "action":
        return styles.action;

      default:
        return styles.sender;

    }
  }

  setBubbleContainer(type: string) {
    switch (type) {
      case "sender":
      case "sender_title":
        return styles.senderContainer;
        break;

      case "action":
        return styles.actionContainer;
        break;

      default:
        return styles.sender;
        break;

    }
  }

  messageSelected (url: string, type: string) {
    if(type === "sender_title") {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Don\'t know how to open URI: ' + url);
        }
      });
    }
  }

  render () {
    return(
      <View style={this.setBubbleContainer(this.props.message_type)}>
      <TouchableHighlight
        style={this.setBubbleStyle(this.props.message_type)}
        onPress={() => this.messageSelected(this.props.url, this.props.message_type)} underlayColor='#f5f5f5'>
        <View>
          <Text style={{color: 'black', fontSize: 15}}>{this.props.msg}</Text>
        </View>
      </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  senderContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 16,
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 14,
  },
  sender: {
    backgroundColor: 'white',
    padding: 14,
    paddingLeft:18,
    paddingRight:18,
    margin:4,
    borderRadius: 18,
    marginRight: 42,
    borderBottomLeftRadius: 2
  },
  senderWtitle: {
    backgroundColor: 'white',
    padding: 14,
    paddingLeft:18,
    paddingRight:18,
    margin:4,
    marginRight: 42,
    borderRadius: 18,
    borderBottomLeftRadius: 2
  },
  action: {
    backgroundColor: 'gainsboro',
    padding: 14,
    paddingLeft:18,
    paddingRight:18,
    margin:4,
    borderRadius: 18,
    borderBottomRightRadius: 2,
  }
});

module.exports = MessageBubble
