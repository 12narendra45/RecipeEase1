import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList,
  TouchableOpacity, Image, ActivityIndicator, ScrollView, Linking,
  ImageBackground, Modal
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_SEARCH = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const API_AREA = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian';

const translateText = (text, lang) => ({
  hi: `अनुवाद: ${text}`,
  te: `అనువాదం: ${text}`,
  en: text
}[lang] || text);

const getIngredients = (meal, lang) => {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      items.push(`${measure?.trim() || ''} ${ing.trim()}`);
    }
  }
  return translateText(items.join(', '), lang);
};

export default function SearchScreen() {
  const quickItems = ['Chicken', 'Pasta', 'Biryani', 'Salad', 'Paneer', 'Egg'];
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const searchMeals = async (q) => {
    setLoading(true);
    setSelectedMeal(null);
    try {
      const res = await fetch(API_SEARCH + q);
      const json = await res.json();
      setMeals(json.meals || []);
    } catch {
      alert('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  const loadIndianMeals = async () => {
    setLoading(true);
    setSelectedMeal(null);
    try {
      const res = await fetch(API_AREA);
      const json = await res.json();
      if (json.meals && json.meals.length > 0) {
        const detailed = await fetch(API_SEARCH + json.meals[0].strMeal);
        const detailJson = await detailed.json();
        setSelectedMeal(detailJson.meals[0]);
        setModalVisible(true);
        setMeals([]);
      }
    } catch {
      alert('Error loading Indian meals');
    } finally {
      setLoading(false);
    }
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

  const addToFav = async () => {
    if (!selectedMeal) return;
    try {
      const json = await AsyncStorage.getItem('favs');
      const arr = json ? JSON.parse(json) : [];
      if (!arr.find((m) => m.idMeal === selectedMeal.idMeal)) {
        arr.push(selectedMeal);
        await AsyncStorage.setItem('favs', JSON.stringify(arr));
        alert('Added to Favorites!');
      }
    } catch {
      alert('Error saving favorite');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TextInput
          placeholder="Search recipes..."
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => searchMeals(query)}
          placeholderTextColor="#888"
        />

        <ScrollView horizontal style={styles.chipRow}>
          {quickItems.map((i) => (
            <TouchableOpacity key={i} style={styles.chip} onPress={() => searchMeals(i)}>
              <Text style={styles.chipText}>{i}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.indianChip} onPress={loadIndianMeals}>
            <Text style={styles.chipText}>Indian 🇮🇳</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.langRow}>
          {['en', 'hi', 'te'].map((l) => (
            <TouchableOpacity
              key={l}
              style={language === l ? styles.langSelected : styles.langBtn}
              onPress={() => setLanguage(l)}
            >
              <Text style={styles.langText}>{l.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && <ActivityIndicator size="large" color="#ff6347" style={{ marginTop: 20 }} />}

        {!loading && meals.length > 0 && (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.idMeal}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setSelectedMeal(item);
                  setModalVisible(true);
                }}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
                <Text style={styles.title}>{translateText(item.strMeal, language)}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {!loading && query && meals.length === 0 && (
          <Text style={styles.noResults}>No recipes found 😔</Text>
        )}

        {/* Modal for Recipe Detail */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView style={styles.modalContent}>
            {selectedMeal && (
              <>
                <Text style={styles.detailTitle}>
                  {translateText(selectedMeal.strMeal, language)}
                </Text>
                <Image source={{ uri: selectedMeal.strMealThumb }} style={styles.detailImage} />

                <Text style={styles.sectionTitle}>Ingredients:</Text>
                <Text style={styles.stepText}>{getIngredients(selectedMeal, language)}</Text>

                <Text style={styles.sectionTitle}>Steps:</Text>
                {selectedMeal.strInstructions
                  .split('\r\n')
                  .filter((s) => s.trim())
                  .map((step, idx) => (
                    <View key={idx} style={styles.stepCard}>
                      <Text style={styles.stepNumber}>Step {idx + 1}</Text>
                      <Text style={styles.stepText}>{translateText(step, language)}</Text>
                    </View>
                  ))}

                <View style={styles.buttonBar}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => speak(selectedMeal.strInstructions)}>
                    <Text style={styles.btnText}>{isSpeaking ? '🛑 Stop' : '🔊 Listen'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={addToFav}>
                    <Text style={styles.btnText}>⭐ Favorite</Text>
                  </TouchableOpacity>
                </View>

                {selectedMeal.strYoutube && (
                  <TouchableOpacity style={styles.videoBtn} onPress={() => Linking.openURL(selectedMeal.strYoutube)}>
                    <Text style={styles.btnText}>▶ Watch Video</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtnText}>✖ Close</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    color: '#333',
  },
  chipRow: {
    maxHeight: 40,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#ffe6e1',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  indianChip: {
    backgroundColor: '#f1c40f',
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    color: '#e67e22',
    fontWeight: '600',
  },
  langRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  langBtn: {
    padding: 6,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginRight: 6,
  },
  langSelected: {
    padding: 6,
    backgroundColor: '#ff6347',
    borderRadius: 6,
    marginRight: 6,
  },
  langText: {
    color: '#fff',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 6,
  },
  stepCard: {
    backgroundColor: '#f9f3ef',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: '#ff6347',
  },
  stepText: {
    marginTop: 4,
    color: '#444',
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  actionBtn: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  videoBtn: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  closeBtnText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  modalContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
