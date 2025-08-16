// app/HOME/RECIPES/FastRecipesPage.tsx - Page dédiée aux recettes rapides "10 min chrono"
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  cuisines?: string[];
  instructions?: string;
  ingredients?: string[];
}

interface FastRecipesPageProps {
  onKitchenPress?: () => void;
  onProfilePress?: () => void;
  onHomePress?: () => void;
}

export default function FastRecipesPage({ onKitchenPress, onProfilePress, onHomePress }: FastRecipesPageProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fonction pour récupérer les recettes rapides depuis TheMealDB
  const fetchFastRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
      const data = await response.json();
      
      if (data.meals) {
        const detailedRecipes = await Promise.all(
          data.meals.slice(0, 12).map(async (meal: any) => {
            try {
              const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
              const detailData = await detailResponse.json();
              const recipe = detailData.meals[0];
              
              const ingredients: string[] = [];
              const instructions = recipe.strInstructions || 'Instructions non disponibles';
              
              for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];
                if (ingredient && ingredient.trim()) {
                  ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
                }
              }

              return {
                id: parseInt(recipe.idMeal),
                title: recipe.strMeal,
                image: recipe.strMealThumb,
                readyInMinutes: Math.floor(Math.random() * 15) + 5, // Temps 5-20 min
                servings: Math.floor(Math.random() * 4) + 2,
                cuisines: [recipe.strArea || 'Internationale'],
                instructions: instructions,
                ingredients: ingredients
              };
            } catch (error) {
              console.error('Erreur lors de la récupération des détails:', error);
              return null;
            }
          })
        );

        const validRecipes = detailedRecipes.filter(recipe => recipe !== null);
        setRecipes(validRecipes);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes rapides:', error);
      setRecipes([
        { id: 1, title: 'Saumon grillé express', image: '', readyInMinutes: 8, servings: 2, cuisines: ['Française'], instructions: 'Faites griller le saumon 4 min de chaque côté avec des herbes.', ingredients: ['Filet de saumon', 'Herbes', 'Citron', 'Huile d\'olive', 'Sel et poivre'] },
        { id: 2, title: 'Crevettes sautées', image: '', readyInMinutes: 6, servings: 3, cuisines: ['Française'], instructions: 'Sautées les crevettes dans l\'huile avec de l\'ail et du persil.', ingredients: ['Crevettes', 'Ail', 'Persil', 'Huile d\'olive', 'Citron'] },
        { id: 3, title: 'Thon en salade', image: '', readyInMinutes: 10, servings: 2, cuisines: ['Française'], instructions: 'Mélangez le thon avec des légumes et une vinaigrette.', ingredients: ['Thon', 'Légumes', 'Vinaigrette', 'Herbes', 'Citron'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFastRecipes();
  }, []);

  const handleRecipePress = (recipe: Recipe) => {
    Alert.alert(
      recipe.title,
      `🍳 ${recipe.title}\n\n⏱️ Temps de préparation: ${recipe.readyInMinutes || 0} minutes\n👥 Portions: ${recipe.servings || 1} personne(s)\n🌍 Cuisine: ${recipe.cuisines && recipe.cuisines.length > 0 ? recipe.cuisines.join(', ') : 'Non spécifiée'}\n\n📝 Instructions:\n${recipe.instructions || 'Instructions non disponibles'}\n\n🥕 Ingrédients:\n${recipe.ingredients ? recipe.ingredients.map(ing => `• ${ing}`).join('\n') : 'Ingrédients non disponibles'}`,
      [
        { text: 'Fermer', style: 'cancel' },
        { text: 'Voir la recette complète', onPress: () => {
          Alert.alert('Fonctionnalité à venir', 'La page de détail de recette sera bientôt disponible !');
        }}
      ]
    );
  };

  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: number) => {
    return favorites.includes(recipeId);
  };

  return (
    <LinearGradient
      colors={['#FFF3E5', '#FFAD4D']}
      locations={[0.35, 1.0]}
      style={styles.screen}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onHomePress}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>⏱️ 10 Min Chrono</Text>
          <Text style={styles.subtitle}>Des recettes ultra-rapides et délicieuses</Text>
        </View>

        <View style={styles.recipesSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFAD4D" />
              <Text style={styles.loadingText}>Chargement des recettes rapides...</Text>
            </View>
          ) : (
            <View style={styles.recipesGrid}>
              {recipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => handleRecipePress(recipe)}
                >
                  <View style={styles.recipeImageContainer}>
                    {recipe.image ? (
                      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    ) : (
                      <View style={styles.recipeImagePlaceholder}>
                        <Ionicons name="restaurant" size={32} color="#FFAD4D" />
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                  >
                    <Ionicons 
                      name={isFavorite(recipe.id) ? "heart" : "heart-outline"} 
                      size={20} 
                      color={isFavorite(recipe.id) ? "#FF6B6B" : "#8B4513"} 
                    />
                  </TouchableOpacity>
                  
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {recipe.title || 'Recette sans titre'}
                  </Text>
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTime}>⏱️ {recipe.readyInMinutes || 0} min</Text>
                    <Text style={styles.recipeServings}>👥 {recipe.servings || 1}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  
  header: { 
    alignItems: 'center', 
    marginBottom: 30, 
    marginTop: 20 
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#000', 
    fontFamily: 'Beiruti',
    marginBottom: 8
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    fontFamily: 'Beiruti',
    textAlign: 'center'
  },

  recipesSection: { 
    marginBottom: 30 
  },
  loadingContainer: { 
    alignItems: 'center', 
    paddingVertical: 40 
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#666', 
    fontFamily: 'Beiruti' 
  },
  recipesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  recipeCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  recipeImageContainer: { 
    alignItems: 'center', 
    marginBottom: 12 
  },
  recipeImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40 
  },
  recipeImagePlaceholder: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#F5E6D3', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  recipeTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#000', 
    fontFamily: 'Beiruti',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18
  },
  recipeInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  recipeTime: { 
    fontSize: 11, 
    color: '#666', 
    fontFamily: 'Beiruti' 
  },
  recipeServings: { 
    fontSize: 11, 
    color: '#666', 
    fontFamily: 'Beiruti' 
  },

  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }
}); 