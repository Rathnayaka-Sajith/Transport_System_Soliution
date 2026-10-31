import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';

export default function WelcomeSplashScreen({ onContinue }) {
  // Animation Values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current; // 0% to 100% opacity
  const textTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    // 1. Smooth entrance animation sequence
    Animated.sequence([
      // First, gently pop in the bus emblem with scale & fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      // Then, smoothly fade in the typography from 0% opacity to 100% opacity
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Automatically navigate to login page
    const autoNavTimer = setTimeout(() => {
      if (onContinue) {
        onContinue();
      }
    }, 2600);

    return () => clearTimeout(autoNavTimer);
  }, [onContinue]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006FD8" />

      {/* Tap anywhere to skip straight to login */}
      <TouchableOpacity
        style={styles.touchableBackdrop}
        activeOpacity={1}
        onPress={onContinue}
      >
        {/* Central Identity Section - Perfectly Centered */}
        <View style={styles.centralContainer}>
          {/* Animated Bus Icon Emblem */}
          <Animated.View
            style={[
              styles.iconEmblem,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require('../../assets/bus-logo.png')}
              style={styles.busLogoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Animated Brand Typography (0% to 100% opacity) */}
          <Animated.View
            style={[
              styles.brandTextBlock,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={styles.titleText}>PNG Express</Text>
            <View style={styles.accentDivider} />
            <Text style={styles.taglineText}>Your Trusted Transport Service</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006FD8', // Vibrant cobalt / azure
    width: '100%',
    ...(Platform.OS === 'web'
      ? {
          minHeight: '100vh',
          width: '100%',
          maxWidth: 500,
          alignSelf: 'center',
        }
      : {}),
  },
  touchableBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  // Central Identity Container
  centralContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },

  // White Circular Emblem Housing the User's Bus Logo
  iconEmblem: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 26,
    padding: 12,
  },
  busLogoImage: {
    width: 140,
    height: 140,
  },

  // Typography Block
  brandTextBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  accentDivider: {
    width: 44,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginVertical: 10,
    opacity: 0.9,
  },
  taglineText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
