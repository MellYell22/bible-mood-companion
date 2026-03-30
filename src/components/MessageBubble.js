import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.row,
        isUser ? styles.rowUser : styles.rowDavid,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      {!isUser && (
        <LinearGradient
          colors={[Colors.gold, Colors.goldLight]}
          style={styles.avatar}
        >
          <Text style={styles.avatarIcon}>✝</Text>
        </LinearGradient>
      )}

      {isUser ? (
        <LinearGradient
          colors={[Colors.userBubbleStart, Colors.userBubbleEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.bubbleUser]}
        >
          <Text style={styles.bubbleText}>{message.content}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleDavid]}>
          <Text style={styles.bubbleText}>{message.content}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  rowUser: {
    flexDirection: 'row-reverse',
  },
  rowDavid: {
    flexDirection: 'row',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarIcon: {
    fontSize: 14,
  },
  bubble: {
    maxWidth: '76%',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  bubbleUser: {
    borderRadius: 20,
    borderBottomRightRadius: 5,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  bubbleDavid: {
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    backgroundColor: Colors.davidBubble,
    borderWidth: 1,
    borderColor: Colors.davidBubbleBorder,
  },
  bubbleText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    lineHeight: 24,
    fontFamily: Typography.serif,
  },
});
