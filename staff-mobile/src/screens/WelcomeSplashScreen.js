import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeSplashScreen({ onContinue }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006FD8" />

      {/* Top Ambient Glow / iOS Safe Spacing */}
      <View style={styles.topSpacer} />

      {/* Main Central Brand Identity */}
      <View style={styles.centralContainer}>
        {/* Stylized 2D Bus Icon Emblem */}
        <View style={styles.iconEmblem}>
          <View style={styles.busSilhouette}>
            {/* Coach Roof & Destination Display */}
            <View style={styles.coachRoof}>
              <View style={styles.destBoardCutout} />
            </View>

            {/* Main Window Cabin Section */}
            <View style={styles.cabinRow}>
              {/* Slanted Aerodynamic Windshield */}
              <View style={styles.windshield} />
              {/* Panoramic Side Passenger Windows */}
              <View style={styles.passengerWindow} />
              <View style={styles.passengerWindow} />
              <View style={styles.passengerWindow} />
              <View style={styles.passengerWindowSmall} />
            </View>

            {/* Lower Body Panels & Speed Accent */}
            <View style={styles.chassis}>
              <View style={styles.speedLine} />
              <View style={styles.headlightAccent} />
              <View style={styles.taillightAccent} />
            </View>

            {/* Wheel Arch Cutouts & High-Speed Highway Wheels */}
            <View style={styles.wheelAssemblyRow}>
              {/* Front Wheel */}
              <View style={styles.wheelContainer}>
                <View style={styles.wheelTire}>
                  <View style={styles.wheelRim} />
                </View>
              </View>

              <View style={styles.undercarriage} />

              {/* Rear Dual Wheels */}
              <View style={styles.wheelContainer}>
                <View style={styles.wheelTire}>
                  <View style={styles.wheelRim} />
                </View>
              </View>
            </View>

            {/* Ground Horizon Guideline */}
            <View style={styles.horizonTrack} />
          </View>
        </View>

        {/* Brand Typography */}
        <View style={styles.brandTextBlock}>
          <Text style={styles.titleText}>PNG Express</Text>
          <View style={styles.subAccentLine} />
          <Text style={styles.taglineText}>Your Trusted Transport Service</Text>
        </View>
      </View>

      {/* Bottom Safe Area & Action Controls (iPhone 16 / iOS 18 style) */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <Text style={styles.arrowIcon}>➔</Text>
        </TouchableOpacity>

        <Text style={styles.versionLabel}>
          Public Transport Network • iOS 18 Edition
        </Text>

        {/* iPhone iOS Home Indicator Bar */}
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006FD8', // Vibrant cobalt / azure
    justifyContent: 'space-between',
    alignItems: 'center',
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
  topSpacer: {
    height: 40,
  },

  // Central Brand Identity
  centralContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },

  // Icon Emblem Housing
  iconEmblem: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },

  // 2D Stylized Bus Silhouette in pure #FFFFFF
  busSilhouette: {
    width: 96,
    height: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coachRoof: {
    width: 88,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 8,
    marginBottom: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  destBoardCutout: {
    width: 24,
    height: 2.5,
    backgroundColor: '#006FD8',
    borderRadius: 1,
    alignSelf: 'flex-end',
    marginRight: 6,
  },

  cabinRow: {
    width: 90,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 3,
    marginBottom: 2,
  },
  windshield: {
    width: 17,
    height: 12,
    backgroundColor: '#006FD8',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 2,
  },
  passengerWindow: {
    width: 13,
    height: 12,
    backgroundColor: '#006FD8',
    borderRadius: 2,
  },
  passengerWindowSmall: {
    width: 9,
    height: 12,
    backgroundColor: '#006FD8',
    borderRadius: 2,
  },

  chassis: {
    width: 92,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 6,
    position: 'relative',
    justifyContent: 'center',
  },
  speedLine: {
    width: 60,
    height: 2,
    backgroundColor: '#006FD8',
    borderRadius: 1,
    marginLeft: 6,
  },
  headlightAccent: {
    position: 'absolute',
    right: 2,
    top: 3,
    width: 5,
    height: 3,
    backgroundColor: '#006FD8',
    borderRadius: 1,
  },
  taillightAccent: {
    position: 'absolute',
    left: 2,
    top: 3,
    width: 3,
    height: 5,
    backgroundColor: '#006FD8',
    borderRadius: 1,
  },

  wheelAssemblyRow: {
    width: 86,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -4,
    zIndex: 2,
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelTire: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#006FD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelRim: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#006FD8',
  },
  undercarriage: {
    flex: 1,
    height: 2,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    marginTop: 2,
  },

  horizonTrack: {
    width: 96,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
    marginTop: 2,
  },

  // Typography
  brandTextBlock: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subAccentLine: {
    width: 48,
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

  // Bottom Section
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF', // High contrast pure white
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 5,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#006FD8', // Vibrant cobalt text
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  arrowIcon: {
    color: '#006FD8',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  versionLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: 14,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 3,
  },
});
