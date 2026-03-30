import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(iconScaleAnim, { toValue: 1, tension: 60, friction: 7, delay: 200, useNativeDriver: true }),
    ]).start();

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] });

  return (
    <LinearGradient
      colors={[Colors.bgDeep, Colors.bgMid, Colors.bgLight]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Top label */}
      <Animated.View style={[styles.topLabel, { opacity: fadeAnim, paddingTop: insets.top + 20 }]}>
        <Text style={styles.topLabelText}>A SAFE SPACE FOR YOUR HEART</Text>
      </Animated.View>

      {/* Center content */}
      <Animated.View style={[styles.center, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Icon */}
        <Animated.View style={{ transform: [{ scale: iconScaleAnim }], alignItems: 'center' }}>
          <Animated.View style={[styles.glowRing, { opacity: glowOpacity }]} />
          <LinearGradient colors={[Colors.gold, Colors.goldLight, Colors.gold]} style={styles.iconCircle}>
            <Text style={styles.iconText}>✝</Text>
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.titleWhite}>Bible Mood</Text>
          <Text style={styles.titleGold}>Companion</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Talk to David — your personal{'\n'}faith-based emotional companion.
        </Text>

        {/* Scripture card */}
        <View style={styles.scriptureCard}>
          <Text style={styles.scriptureText}>
            "Cast all your anxiety on him{'\n'}because he cares for you."
          </Text>
          <Text style={styles.scriptureRef}>1 PETER 5:7</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          activeOpacity={0.85}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={[Colors.purple, Colors.purpleLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Talk to David</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.noAccount}>No account needed · Start now</Text>
      </Animated.View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.footerText}>Created by AA Designs</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  topLabel: { alignItems: 'center' },
  topLabelText: {
    color: 'rgba(201,169,110,0.55)',
    fontSize: Typography.sizes.xs,
    letterSpacing: 3,
    fontFamily: Typography.sans,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  glowRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.gold,
    zIndex: 0,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 1,
  },
  iconText: { fontSize: 44 },
  titleBlock: { alignItems: 'center', gap: 2 },
  titleWhite: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    fontFamily: Typography.serif,
    lineHeight: 46,
  },
  titleGold: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    fontFamily: Typography.serif,
    lineHeight: 46,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Typography.serif,
  },
  scriptureCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    maxWidth: 300,
  },
  scriptureText: {
    color: 'rgba(201,169,110,0.8)',
    fontSize: Typography.sizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Typography.serif,
  },
  scriptureRef: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
    marginTop: 6,
    letterSpacing: 2,
    fontFamily: Typography.sans,
  },
  ctaWrapper: { width: '100%', maxWidth: 300 },
  ctaButton: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaText: {
    color: Colors.white,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.serif,
    letterSpacing: 0.5,
  },
  noAccount: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.sans,
  },
  footer: { alignItems: 'center' },
  footerText: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.sans,
    letterSpacing: 2,
  },
});
