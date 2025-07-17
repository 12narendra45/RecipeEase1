

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');
const slides = [
  {
    caption: "Welcome to Foodie's Paradise!",
    image: require('../assets/images/slide1.jpg'),
  },
  {
    caption: "Discover Delicious Recipes Instantly!",
    image: require('../assets/images/slide2.jpg'),
  },
  {
    caption: "Search by Ingredients or Food Name!",
    image: require('../assets/images/slide3.jpg'),
  },
  {
    caption: "Get Cooking Steps + Video Guide!",
    image: require('../assets/images/slide4.jpg'),
  },
];

export default function LandingScreen({ navigation }) {
  return (
    <Swiper loop={false} showsPagination={true} activeDotColor="#ff6347">
      {slides.map((slide, index) => (
        <ImageBackground
          key={index}
          source={slide.image}
          style={styles.slide}
          imageStyle={{ opacity: 0.9, resizeMode: 'cover' }}
        >
          <Text style={styles.caption}>{slide.caption}</Text>
          {index === slides.length - 1 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace('Login')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
 caption: {
  fontSize: 28,
  fontWeight: 'bold',
  color: 	'#FFCBA4', 
  textAlign: 'center',
  paddingHorizontal: 20,
  textShadowColor: 'rgba(0, 0, 0, 0.7)', 
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 4,
},
  button: {
    marginTop: 40,
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});
