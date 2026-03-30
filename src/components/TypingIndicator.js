import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: -7, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      )
    );
    Animated.parallel(animations).start();
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.gold, Colors.goldLight]} style={styles.avatar}>
        <Text style={styles.avatarIcon}>✝</Text>
      </LinearGradient>
      <View style={styles.bubble}>
        <View style={styles.dotsRow}>
          {dots.map((dot, i) => (
            <Animated.View key={i} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
          ))}
        </View>
      </View>
      <Text style={styles.label}>David is typing…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarIcon: { fontSize: 14 },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  label: {
    width: '100%',
    marginTop: 5,
    marginLeft: 42,
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.sans,
  },
});
