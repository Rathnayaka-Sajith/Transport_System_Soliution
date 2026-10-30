import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';

export default function WelcomeSplashScreen({ onContinue }) {
  // Animation Values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current; // 0% to 100% opacity
  const textTranslateY = useRef(new Animated.Value(18)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.sequence([
      // First, pop in the bus logo with subtle scale & fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
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
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Automatically navigate to login page after greeting presentation (~2.8 seconds)
    const autoNavTimer = setTimeout(() => {
      if (onContinue) {
        onContinue();
      }
    }, 2800);

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
        <View style={styles.topSpacer} />

        {/* Central Identity Section */}
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

        {/* Bottom Section: Ambient Loader & iOS Home Indicator */}
        <Animated.View style={[styles.bottomContainer, { opacity: footerOpacity }]}>
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.loadingStatusText}>Starting Portal...</Text>
          </View>

          <Text style={styles.skipHintText}>Tap anywhere to continue</Text>

          {/* iOS 18 / iPhone 16 Home Indicator Bar */}
          <View style={styles.homeIndicator} />
        </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  topSpacer: {
    height: 48,
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
    letterSpacing: 1.2,
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
    letterSpacing: 0.6,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },

  // Bottom Safe Area Section
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  loadingStatusText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  skipHintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 3,
  },
});
