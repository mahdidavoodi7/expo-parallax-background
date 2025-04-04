import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gyroscope, GyroscopeMeasurement } from 'expo-sensors';

const { width, height } = Dimensions.get('window');

const image1 = require('./assets/parallax/1.png');
const image2 = require('./assets/parallax/2.png');
const image3 = require('./assets/parallax/3.png');
const image4 = require('./assets/parallax/4.png');
const image5 = require('./assets/parallax/5.png');
const image6 = require('./assets/parallax/6.png');
const image7 = require('./assets/parallax/7.png');
const image8 = require('./assets/parallax/8.png');

const images = [image1, image2, image3, image4, image5, image6, image7, image8];
const multipliers = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1, 1.15];

const Parallax: React.FC = () => {
  // Shared values for the base translations from gyroscope data.
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Set the gyroscope update interval (roughly 60fps)
    Gyroscope.setUpdateInterval(16);

    const subscription = Gyroscope.addListener((data: GyroscopeMeasurement) => {
      // Update the shared values using withTiming for a smooth transition.
      translateX.value = withTiming(data.x * 120);
      translateY.value = withTiming(data.y * 120);
    });

    // Clean up the subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [translateX, translateY]);

  return (
    <View style={styles.container}>
      {images.map((img, index) => {
        // Create an animated style for each image by scaling the shared translation values
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: translateX.value * multipliers[index] },
            { translateY: translateY.value * multipliers[index] },
            { scale: 1.15 }
          ],
        }));

        return (
          <Animated.Image
            key={index}
            source={img}
            style={[styles.image, animatedStyle, { zIndex: index }]}
            resizeMode="cover"
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Position all images absolutely so they overlap.
  image: {
    position: 'absolute',
    width,
    height,
  },
});

export default Parallax;