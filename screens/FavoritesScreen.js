import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Linking } from 'react-native';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadFavorites = async() => {
      const json = await AsyncStorage.getItem('favs');
      const arr = json ? JSON.parse(json) : [];
      setFavorites(arr);
    };
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const removeFavorite = async (idMeal) => {
    const newList = favorites.filter(m => m.idMeal !== idMeal);
    await AsyncStorage.setItem('favs', JSON.stringify(newList));
    setFavorites(newList);
    setSelectedMeal(null);
    Alert.alert('Removed from favorites');
  };

  const speak = (text) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(text);
      setIsSpeaking(true);
    }
  };

  const getIngredientsList = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
      }
    }
    return ingredients.join(', ');
  };

  return (
    <View style={styles.container}>
      {!selectedMeal ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={() => setSelectedMeal(item)}>
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
              <Text style={styles.title}>{item.strMeal}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ScrollView>
          <Text style={styles.detailTitle}>{selectedMeal.strMeal}</Text>
          <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.detailImage} />

          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <Text style={styles.ingredientsText}>{getIngredientsList(selectedMeal)}</Text>

          <Text style={styles.sectionTitle}>Steps:</Text>
          {selectedMeal.strInstructions
            .split('\r\n')
            .filter((s) => s.trim())
            .map((step, idx) => (
              <View key={idx} style={styles.stepCard}>
                <Text style={styles.stepNumber}>Step {idx + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))
          }

          <View style={styles.buttonBar}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => speak(selectedMeal.strInstructions)}>
              <Text style={styles.btnText}>{isSpeaking ? '🛑 Stop' : '🔊 Listen'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => removeFavorite(selectedMeal.idMeal)}>
              <Text style={styles.btnText}>🗑 Remove</Text>
            </TouchableOpacity>
          </View>

          {selectedMeal.strYoutube && (
            <TouchableOpacity style={styles.videoBtn} onPress={() => Linking.openURL(selectedMeal.strYoutube)}>
              <Text style={styles.btnText}>▶ Watch Video</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setSelectedMeal(null)}>
            <Text style={styles.backText}>⬅ Back to Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.backText}>🔍 Back to Search</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 10
  },
  thumb: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  detailImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 10 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginVertical: 6 },
  ingredientsText: { fontSize: 14, color: '#333', marginBottom: 10 },

  stepCard: {
    backgroundColor: '#f9f3ef',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4
  },
  stepNumber: { fontWeight: 'bold', color: '#ff6347' },
  stepText: { marginTop: 4, color: '#444' },

  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12
  },
  actionBtn: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  videoBtn: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  backText: { color: '#3498db', marginTop: 10, textAlign: 'center', fontWeight: '600' }
});
