import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = { navigation: NativeStackNavigationProp<any> };

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dotAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence(
        dotAnims.map((anim, i) =>
          Animated.sequence([
            Animated.delay(i * 200),
            Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
          ])
        )
      )
    );
    loop.start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>SB</Text>
        </View>
        <Text style={styles.appName}>SkillBridge</Text>
        <Text style={styles.tagline}>From Confusion to Dream Career</Text>
      </Animated.View>

      <View style={styles.dotsContainer}>
        {dotAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center' },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  appName: {
    color: Colors.text,
    fontSize: FontSizes.display,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: FontSizes.body,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: Spacing.xxl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    marginHorizontal: 6,
  },
});
