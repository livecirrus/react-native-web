/**
 * Copyright (c) 2016-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * @flow
 */

import dismissKeyboard from '../../modules/dismissKeyboard'
import invariant from 'fbjs/lib/invariant'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ScrollResponder from '../../modules/ScrollResponder'
import ScrollViewBase from './ScrollViewBase'
import StyleSheet from '../../apis/StyleSheet'
import StyleSheetPropType from '../../apis/StyleSheet/StyleSheetPropType'
import PointPropType from '../../apis/StyleSheet/PointPropType'
import View from '../View'
import ViewStylePropTypes from '../View/ViewStylePropTypes'

const INNERVIEW = 'InnerScrollView'
const SCROLLVIEW = 'ScrollView'

const ScrollView = React.createClass({
  propTypes: {
    ...View.propTypes,
    children: View.propTypes.children,
    contentContainerStyle: StyleSheetPropType(ViewStylePropTypes),
    horizontal: PropTypes.bool,
    keyboardDismissMode: PropTypes.oneOf([ 'none', 'interactive', 'on-drag' ]),
    onContentSizeChange: PropTypes.func,
    onScroll: PropTypes.func,
    refreshControl: PropTypes.element,
    scrollEnabled: PropTypes.bool,
    scrollEventThrottle: PropTypes.number,
    contentOffset: PointPropType,
    style: StyleSheetPropType(ViewStylePropTypes)
  },

  mixins: [ScrollResponder.Mixin],

  getInitialState() {
    return this.scrollResponderMixinGetInitialState()
  },

  setNativeProps(props: Object) {
    this.refs[SCROLLVIEW].setNativeProps(props)
  },

  componentDidMount() {
    if (this.props.contentOffset) {
      this.scrollTo({x: this.props.contentOffset.x, y: this.props.contentOffset.y})
    }
  },

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder(): Component {
    return this
  },

  getScrollableNode(): any {
    return ReactDOM.findDOMNode(this.refs[SCROLLVIEW])
  },

  getInnerViewNode(): any {
    return ReactDOM.findDOMNode(this.refs[INNERVIEW])
  },

  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   * Syntax:
   *
   * scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
   *
   * Note: The weird argument signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as as alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollTo(
    y?: number | { x?: number, y?: number, animated?: boolean },
    x?: number,
    animated?: boolean
  ) {
    if (typeof y === 'number') {
      console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, animated: true})` instead.')
    } else {
      ({x, y, animated} = y || {})
    }

    this.getScrollResponder().scrollResponderScrollTo({x: x || 0, y: y || 0, animated: animated !== false})
  },

  /**
   * Deprecated, do not use.
   */
  scrollWithoutAnimationTo(y: number = 0, x: number = 0) {
    console.warn('`scrollWithoutAnimationTo` is deprecated. Use `scrollTo` instead')
    this.scrollTo({x, y, animated: false})
  },

  handleScroll(e: Object) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.onScroll && !this.props.scrollEventThrottle) {
        console.log(
          'You specified `onScroll` on a <ScrollView> but not ' +
          '`scrollEventThrottle`. You will only receive one event. ' +
          'Using `16` you get all the events but be aware that it may ' +
          'cause frame drops, use a bigger number if you don\'t need as ' +
          'much precision.'
        )
      }
    }

    if (this.props.keyboardDismissMode === 'on-drag') {
      dismissKeyboard()
    }

    this.scrollResponderHandleScroll(e)
  },

  _handleContentOnLayout(e: Object) {
    const { width, height } = e.nativeEvent.layout
    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height)
  },

  render() {
    const scrollViewStyle = [
      styles.base,
      this.props.horizontal && styles.baseHorizontal
    ]

    const contentContainerStyle = [
      styles.contentContainer,
      this.props.horizontal && styles.contentContainerHorizontal,
      this.props.contentContainerStyle
    ]

    if (process.env.NODE_ENV !== 'production' && this.props.style) {
      const style = StyleSheet.flatten(this.props.style)
      const childLayoutProps = ['alignItems', 'justifyContent'].filter((prop) => style && style[prop] !== undefined)
      invariant(
        childLayoutProps.length === 0,
        'ScrollView child layout (' + JSON.stringify(childLayoutProps) +
          ') must be applied through the contentContainerStyle prop.'
      )
    }

    let contentSizeChangeProps = {}
    if (this.props.onContentSizeChange) {
      contentSizeChangeProps = {
        onLayout: this._handleContentOnLayout
      }
    }

    const contentContainer = (
      <View
        {...contentSizeChangeProps}
        children={this.props.children}
        collapsable={false}
        ref={INNERVIEW}
        style={contentContainerStyle}
      />
    )

    const props = {
      ...this.props,
      style: [scrollViewStyle, this.props.style],
      onTouchStart: this.scrollResponderHandleTouchStart,
      onTouchMove: this.scrollResponderHandleTouchMove,
      onTouchEnd: this.scrollResponderHandleTouchEnd,
      onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
      onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
      onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
      onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
      onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
      onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
      onScroll: this.handleScroll,
      onResponderGrant: this.scrollResponderHandleResponderGrant,
      onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
      onResponderTerminate: this.scrollResponderHandleTerminate,
      onResponderRelease: this.scrollResponderHandleResponderRelease,
      onResponderReject: this.scrollResponderHandleResponderReject
    }

    const ScrollViewClass = ScrollViewBase

    invariant(
      ScrollViewClass !== undefined,
      'ScrollViewClass must not be undefined'
    )

    var refreshControl = this.props.refreshControl
    if (refreshControl) {
      return React.cloneElement(
        refreshControl,
        { style: props.style },
        <ScrollViewClass {...props} ref={SCROLLVIEW} style={styles.base}>
          {contentContainer}
        </ScrollViewClass>
      )
    }

    return (
      <ScrollViewClass {...props} ref={SCROLLVIEW} style={props.style}>
        {contentContainer}
      </ScrollViewClass>
    )
  }
})

const styles = StyleSheet.create({
  base: {
    flex: 1,
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  baseHorizontal: {
    overflowX: 'auto',
    overflowY: 'hidden'
  },
  contentContainer: {
    flex: 1
  },
  contentContainerHorizontal: {
    flexDirection: 'row'
  }
})

module.exports = ScrollView
