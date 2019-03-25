import React, { Component } from 'react';
import {Keyboard, Platform, ScrollView, View, Dimensions } from "react-native";

const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

class KeyboardEscapingView extends Component {
    state = {
        offset: 0,
    };

    bottomSpace = 0;
    scrollRef = null;

    componentWillMount() {
        Keyboard.addListener(keyboardShowEvent, this._keyboardWillShow);
        Keyboard.addListener(keyboardHideEvent, this._keyboardWillHide);
    }

    _keyboardWillShow = event => {
        this.setState({
            offset: event.endCoordinates.height,
        });
    };

    _keyboardWillHide = () => {
        this.setState({
            offset: 0,
        });
    };

    componentWillUnmount() {
        Keyboard.removeListener(keyboardShowEvent, this._keyboardWillShow);
        Keyboard.removeListener(keyboardHideEvent, this._keyboardWillHide);
    }

    render() {
        return (
            <ScrollView
                {...this.props}
                contentContainerStyle={{ ...this.props.style }}
                style={{ ...this.props.style }}
                ref={node => this.scrollRef = node}
                onContentSizeChange={() => this.scrollRef.scrollToEnd({ animated: true })}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.bottomSpace = Dimensions.get('window').height - (layout.y + layout.height);
                }}
            >
                {this.props.children}
                <View style={{ height: (this.state.offset - this.bottomSpace)}}/>
            </ScrollView>
        );
    }
}

class ScrollViewForKeyboard extends Component {

    scrollRef = null;
    scrollY = 0;
    keyboardHeight = 0;


    componentWillMount() {
        Keyboard.addListener(keyboardShowEvent, this._keyboardWillShow);
        Keyboard.addListener(keyboardHideEvent, this._keyboardWillHide);
    }

    _keyboardWillShow = event => {
        // this.setState({
        //     offset: event.endCoordinates.height,
        // });
        this.keyboardHeight = event.endCoordinates.height;
        setTimeout(() => this.scrollRef.scrollTo({x: 0, y: this.scrollY + event.endCoordinates.height, animated: true}), 1);
    };

    _keyboardWillHide = () => {
        setTimeout(() => this.scrollRef.scrollTo({x: 0, y: this.scrollY - this.keyboardHeight, animated: true}), 1);
        // this.setState({
        //     offset: 0,
        // });
    };

    componentWillUnmount() {
        Keyboard.removeListener(keyboardShowEvent, this._keyboardWillShow);
        Keyboard.removeListener(keyboardHideEvent, this._keyboardWillHide);
    }

    render() {
        return (
            <ScrollView
                ref={node => this.scrollRef = node}
                onContentSizeChange={() => this.scrollRef.scrollToEnd({ animated: true })}
                onScroll={event => this.scrollY = event.nativeEvent.contentOffset.y}
                scrollEventThrottle={16}
                {...this.props}
            >
                {this.props.children}
            </ScrollView>
        );
    }
}

export { KeyboardEscapingView, ScrollViewForKeyboard };
