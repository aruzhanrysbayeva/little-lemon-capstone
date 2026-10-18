import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import {
  initDatabase,
  getMenuItems,
  saveMenuItems,
  filterMenuItems,
} from '../database/database';

const MENU_API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const CATEGORIES = ['starters', 'mains', 'desserts', 'drinks'];

export default function HomeScreen({ navigation }) {
  const [menuData, setMenuData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndStoreMenu = async () => {
    try {
      initDatabase();
      const cached = await getMenuItems();
      if (cached && cached.length > 0) {
        setMenuData(cached);
        setLoading(false);
        return;
      }

      const res = await fetch(MENU_API_URL);
      const json = await res.json();
      const formatted = json.menu.map((item, idx) => ({
        id: idx + 1,
        name: item.name,
        price: item.price,
        description: item.description,
        image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
        category: item.category,
      }));

      await saveMenuItems(formatted);
      setMenuData(formatted);
    } catch (e) {
      console.error('Menu load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndStoreMenu();
  }, []);

  const handleCategoryPress = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const applyFilters = useCallback(async () => {
    try {
      const results = await filterMenuItems(searchQuery, selectedCategories);
      setMenuData(results);
    } catch (e) {
      console.error('Filter error:', e);
    }
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories, applyFilters]);

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemTextContainer}>
        <Text style={styles.menuItemTitle}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.menuItemPrice}>${Number(item.price).toFixed(2)}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} showProfile={true} />

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroSubtitle}>Chicago</Text>
        <View style={styles.heroRow}>
          <Text style={styles.heroDescription}>
            We are a family owned Mediterranean restaurant, focused on traditional
            recipes served with a modern twist.
          </Text>
          <Image
            source={require('../../assets/HeroImage.png')}
            style={styles.heroImage}
          />
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search menu..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>ORDER FOR DELIVERY!</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategories.includes(item);
            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#495E57" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={menuData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMenuItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    backgroundColor: '#495E57',
    padding: 16,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F4CE14',
  },
  heroSubtitle: {
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: '#EDEFEE',
    flex: 1,
    paddingRight: 12,
    lineHeight: 20,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  breakdownSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#EDEFEE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  categoryPillSelected: {
    backgroundColor: '#495E57',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#495E57',
  },
  categoryPillTextSelected: {
    color: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#495E57',
  },
  menuItemImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEFEE',
    marginHorizontal: 16,
  },
});
