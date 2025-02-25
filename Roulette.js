import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, PanResponder, Easing, ImageBackground, Image } from 'react-native';
import RouletteItem from './RouletteItem'
import styles from './styles';

class Roulette extends Component {

  constructor(props) {
    super(props);
    this.state = {
      _animatedValue: new Animated.Value(0),
      activeItem: 0
    };

    this.step = props.step || (2 * Math.PI) / props.options.length;

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderRelease: () => {
        // const { enableUserRotate, onRotate, onRotateChange, duration, easing } = this.props;

        // if (enableUserRotate) {
        //   const { options, turns } = this.props;
        //   const { activeItem } = this.state;
        //   let random = Math.floor(Math.random() * options.length) 
        //   + (options.length*turns);                    
        //   // const nextItem = random;
        //   // const nextItem = 0 + (6 * 3)
        //   const nextItem = 0 + options.length * 3

        //   this.state._animatedValue.setValue(activeItem);
        //   let animation = Animated.timing(this.state._animatedValue, { toValue: nextItem, easing, duration, useNativeDriver: true })          
        //   onRotateChange("start");
        //   animation.start(()=>{
        //     onRotateChange("stop");
        //   });
          
        //   let newActiveItem = nextItem > options.length ? (nextItem % options.length)  : nextItem;
        //   if(newActiveItem == 0){
        //     newActiveItem = options.length
        //   }
        //   this.setState({ activeItem: newActiveItem }, () => onRotate(options[options.length - newActiveItem]));
        // }
      }
    });
  }


  play = (index) => {
    const { enableUserRotate, onRotate, onRotateChange, duration, easing } = this.props;

    const { options, turns } = this.props;
    const { activeItem } = this.state;
    let random = Math.floor(Math.random() * options.length) 
    + (options.length*turns);                    
    // const nextItem = random;
    // const nextItem = 0 + (6 * 3)
    // const nextItem = index + options.length * 3
    let targetIndex = 8 - index
    const nextItem = targetIndex + 8 * 6;
    
    this.state._animatedValue.setValue(activeItem);
    let animation = Animated.timing(this.state._animatedValue, { toValue: nextItem, easing, duration, useNativeDriver: true })          
    onRotateChange("start");
    animation.start(()=>{
      onRotateChange("stop");
    });
    
    let newActiveItem = nextItem > options.length ? (nextItem % options.length)  : nextItem;
    if(newActiveItem == 0){
      newActiveItem = options.length
    }
    this.setState({ activeItem: newActiveItem }, () => onRotate(options[options.length - newActiveItem]));
  }

  render() {
    const { options, radius, distance, customStyle, rouletteRotate, background, marker,centerImage, markerWidth,markerTop,centerWidth,centerTop,markerStyle, centerStyle, rotateEachElement } = this.props;

    const interpolatedRotateAnimation = this.state._animatedValue.interpolate({
      inputRange: [0, options.length],
      outputRange: [`${rouletteRotate}deg`, `${360 + rouletteRotate}deg`]
    });

    const displayOptions = options && options.length > 0 && options[0] && React.isValidElement(options[0]);

    return (
      <View
        style={{
          // backgroundColor: "aqua"
        }}
      >
        
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            styles.container,
            { width: radius, height: radius, borderRadius: radius / 2 },
            { transform: [{ rotate: interpolatedRotateAnimation }] },
            customStyle
          ]}
        >
          <ImageBackground width={radius} height={radius} style={{width:"100%", height: "100%", zIndex:100}} source={background}>
          {displayOptions && Children.map(options, (child, index) =>
              <RouletteItem
                item={child}
                index={index}
                radius={radius}
                step={this.step}
                distance={distance}
                rouletteRotate={ rotateEachElement(index) }
              />
          )}
          </ImageBackground>
          
        </Animated.View>
        <Image source={marker} 
// resizeMode="contain" 
style={[styles.marker,{zIndex:9999,
                       
//                      top: markerTop, 
                       width:markerWidth, left: (radius/2) -(markerWidth/2)}, markerStyle ]}/>
        
        {centerImage &&
          <Image source={centerImage} resizeMode="contain" style={[styles.marker,{zIndex:9999,top: centerTop, width:centerWidth, left: (radius/2) -(centerWidth/2) },centerStyle ]}/>
        }
      </View>
    );
  }
}

Roulette.propTypes = {
  step: PropTypes.number,
  radius: PropTypes.number,
  distance: PropTypes.number,
  rouletteRotate: PropTypes.number,
  enableUserRotate: PropTypes.bool,
  onRotate: PropTypes.func,
  onRotateChange: PropTypes.func,  
  rotateEachElement: PropTypes.func,
  customStyle: PropTypes.any,
  background: PropTypes.any,
  turns: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.any
};

Roulette.defaultProps = {
  radius: 300,
  distance: 100,
  rouletteRotate: 0,
  enableUserRotate: false,
  background: null,
  turns: 4,
  rotateEachElement: (index) => 0,
  onRotate: () => {},
  onRotateChange: () => {},
  duration: 3500,
  easing: Easing.inOut(Easing.ease),
  markerTop: 0,
  markerWidth:20,
  centerWidth:20,
  centerTop: 0,
  centerImage: null,
  markerStyle: {}
};

export default Roulette;
