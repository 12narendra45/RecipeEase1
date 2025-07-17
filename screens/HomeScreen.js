import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then((u) => u && setUser(JSON.parse(u)));
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch('https://dummyjson.com/recipes?limit=10');
      const json = await res.json();
      setRecipes(json.recipes);
    } catch (e) {
      Alert.alert('Error', 'Failed to load recipes.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['user', 'token']);
    setModalVisible(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.welcome}>Foodie's Paradise 🍲</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person-circle-outline" size={36} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Recipe Cards */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {recipes.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.card}
            onPress={() => Alert.alert(r.name, r.instructions.join('\n'))}
          >
            <Image source={{ uri: r.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{r.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User Info Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>👤 Your Info</Text>
            {user ? (
              <>
                <Text style={styles.userInfo}>Name: {user.name}</Text>
                <Text style={styles.userInfo}>Email: {user.email}</Text>
                <Text style={styles.userInfo}>Username: {user.username}</Text>
                {user.phone && <Text style={styles.userInfo}>Phone: {user.phone}</Text>}
              </>
            ) : (
              <Text style={styles.userInfo}>User not found</Text>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // light warm background
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347', // tomato
    fontFamily: 'sans-serif-medium',
  },
  cardContainer: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: width - 30,
    height: 200,
  },
  cardTitle: {
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#FF6347',
  },
  userInfo: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#555',
    marginTop: 15,
    textAlign: 'center',
  },
});
