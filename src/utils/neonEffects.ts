import { Animated, Easing } from 'react-native';

export function createPulseAnimation(duration: number = 2000): Animated.Value {
  const pulseValue = new Animated.Value(0.5);

  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(pulseValue, {
        toValue: 0.5,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ])
  ).start();

  return pulseValue;
}

export function createSpringAnimation(initialValue: number = 0): {
  value: Animated.Value;
  spring: (toValue: number) => void;
} {
  const value = new Animated.Value(initialValue);

  const spring = (toValue: number) => {
    Animated.spring(value, {
      toValue,
      useNativeDriver: false,
      speed: 12,
      bounciness: 10,
    }).start();
  };

  return { value, spring };
}

export function createSlideInAnimation(initialX: number = 100): {
  value: Animated.Value;
  animate: () => void;
} {
  const value = new Animated.Value(initialX);

  const animate = () => {
    Animated.timing(value, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  return { value, animate };
}

export function createFadeInAnimation(initialOpacity: number = 0): {
  value: Animated.Value;
  animate: () => void;
} {
  const value = new Animated.Value(initialOpacity);

  const animate = () => {
    Animated.timing(value, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  return { value, animate };
}

export function createStaggerAnimation(itemCount: number, duration: number = 300): Animated.Value[] {
  return Array.from({ length: itemCount }).map((_, index) => {
    const value = new Animated.Value(0);
    Animated.timing(value, {
      toValue: 1,
      delay: index * (duration / itemCount),
      duration,
      useNativeDriver: false,
    }).start();
    return value;
  });
}
