import React, { Component } from 'react';
import {
  ListView,
  Text,
  View,
  TouchableHighlight,
  ToastAndroid,
  StyleSheet
} from 'react-native'

import MessageBubble from './messageBubble'
import InvertibleScrollView from './InvertibleScrollView'

const apiConfig = require('../apiConfig.json')

class MessageBubbleList extends Component {

  constructor() {
    super();
    this._data = [];
    this.posts = [];
    this.titleCount = 0;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
    this.state = {
      dataSource: ds.cloneWithRows(this._data)
    };
  }

  componentDidMount () {
    this.getPosts()
  }

  getPosts() {
    this.setState({isRefreshing: true})
    let url = apiConfig.BASE_URL + apiConfig.LATEST

    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      //data is ready time to say hi and show the first articles title
      this._data.push({
        message_type:'sender',
        msg: 'Good morning!',
        url: ''
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._data),
      })
      this.posts = responseJson.posts;
      this.showTitle(this.posts[this.titleCount].title, this.posts[this.titleCount].url);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  showTitle(text: string, link: string) {
    this._data.unshift({
      message_type: 'sender_title',
      msg: text,
      url: link
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data),
    });
  }

  nextSelected() {
    this.titleCount++;
    this._data.unshift({
      message_type:'action',
      msg: 'next',
      url: ''
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data)
    });
    if (typeof this.posts[this.titleCount] != 'undefined') {
      this.showTitle(this.posts[this.titleCount].title, this.posts[this.titleCount].url);
    } else {
      this._data.unshift({
        message_type:'sender',
        msg: 'You\'re all caught up! Check back later.',
        url: ''
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._data)
      });
    }
  }

  tellMeMore() {
    this._data.unshift({
      message_type:'action',
      msg: 'tell me more',
      url: ''
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data)
    });
    this.getParagraphs(this.posts[this.titleCount]);
  }

  getParagraphs(post) {
    for(i = 0; i<post.content.length; i++) {
      if(typeof post.content[i] != 'undefined' && post.content[i].type === "paragraph"){
        this._data.unshift({
          message_type:'sender',
          msg: post.content[i].text.replace(/<(?:.|\n)*?>/gm, ''),
          url: ''
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this._data)
        });
        break;
      }
    }
  }

  renderRow ( rowData: any) {
    return (
      <MessageBubble
        message_type={rowData.message_type}
        msg={rowData.msg}
        url={rowData.url}
      />
    );
  }

  renderHeader() {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.actionButton}>
        <TouchableHighlight onPress={() => this.tellMeMore()} underlayColor='blue'>
          <Text style={styles.text}>tell me more</Text>
        </TouchableHighlight>
        </View>
        <View style={styles.actionButton}>
        <TouchableHighlight onPress={() => this.nextSelected()} underlayColor='blue'>
          <Text style={styles.text}>next</Text>
        </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    return (
      <ListView
        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
        style={styles.listContainer}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderHeader={this.renderHeader.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#f5f5f5',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    paddingTop: 14,
    justifyContent: 'center',
  },
  actionButton: {
    padding: 14,
    paddingLeft:18,
    paddingRight:18,
    marginRight:6,
    marginLeft: 6,
    backgroundColor: '#007ee5',
    borderRadius: 18,
    borderBottomRightRadius: 2,
    elevation:3,
		shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 2,
		shadowOffset: {
			height: 3,
			width: 0
		}
  },
  text: {
    color: 'white',
    fontSize: 15
  }
});

module.exports = MessageBubbleList
