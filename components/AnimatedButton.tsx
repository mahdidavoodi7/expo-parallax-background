import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

interface AnimatedButtonProps {
  active: boolean;
  label: string;
  color: string;
  onPress: () => void;
  defaultImage: ImageSourcePropType;
  activeImage: ImageSourcePropType;
}

const MIN_WIDTH = 50
const MAX_WIDTH = 144

const INNER_BOX_PADDING_LEFT = 16;
const IMAGE_SIZE = 18;
const TEXT_PADDING = 6;
const TEXT_TRANSLATE_X = 12;

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ active, onPress, label, defaultImage, activeImage, color }) => {
  const [textWidth, setTextWidth] = useState(0)

  const width = useSharedValue(active ? MAX_WIDTH : MIN_WIDTH);
  const padding = useSharedValue(0);
  const defaultImageOpacity = useSharedValue(active ? 0 : 1);
  const activeImageOpacity = useSharedValue(active ? 1 : 0);
  const boxPadding = useSharedValue(active ? ((MAX_WIDTH - (textWidth + IMAGE_SIZE + TEXT_PADDING)) / 2) - INNER_BOX_PADDING_LEFT : 0);

  useEffect(() => {
    if (textWidth) {
      width.value = withTiming(active ? MAX_WIDTH : MIN_WIDTH, { duration: 300 });
      padding.value = withTiming(active ? -TEXT_TRANSLATE_X : 0, { duration: 300 });
      defaultImageOpacity.value = withTiming(active ? 0 : 1, { duration: 300 });
      activeImageOpacity.value = withTiming(active ? 1 : 0, { duration: 300 });
      // we calculate the padding from left to make the image and text stay in the center after animation
      boxPadding.value = withTiming(active ? ((MAX_WIDTH - (textWidth + IMAGE_SIZE + TEXT_PADDING)) / 2) - INNER_BOX_PADDING_LEFT : 0)
    }
  }, [active, textWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    backgroundColor: interpolateColor(width.value, [MIN_WIDTH, MAX_WIDTH], ['#E9E9E9', color]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: padding.value }],
  }));
  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: boxPadding.value }],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({ opacity: defaultImageOpacity.value }));
  const animatedImageStyle2 = useAnimatedStyle(() => ({ opacity: activeImageOpacity.value }));

  return (
    <Pressable onPressIn={onPress}>
      <Animated.View style={[styles.animatedBox, animatedStyle]}>
        <Animated.View style={[styles.innerBox, animatedBoxStyle]}>
          <View style={styles.imageContainer}>
            <Animated.Image
              source={defaultImage}
              style={[styles.image, animatedImageStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={activeImage}
              style={[styles.image, animatedImageStyle2]}
              resizeMode="contain"
            />
          </View>
          <Animated.Text
            numberOfLines={1}
            style={[styles.text, animatedTextStyle]}
            onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  animatedBox: {
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  innerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    paddingLeft: INNER_BOX_PADDING_LEFT,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'absolute',
  },
  text: {
    flex: 1,
    overflow: 'hidden',
    position: 'absolute',
    color: 'white',
    fontWeight: '500',
    left: INNER_BOX_PADDING_LEFT + IMAGE_SIZE + TEXT_PADDING + TEXT_TRANSLATE_X,
  },
});

export default AnimatedButton;
