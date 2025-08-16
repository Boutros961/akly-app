// app/HOME/RECIPES/HomePage.tsx - Page d'accueil avec recettes
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

interface HomePageProps { 
  onKitchenPress?: () => void; 
  onProfilePress?: () => void;
  onHomePress?: () => void;
  onExpressRecipesPress?: () => void; // Navigation vers recettes express
  onAppetizersPress?: () => void; // Navigation vers apéritifs
  onProteinRecipesPress?: () => void; // Navigation vers recettes protéinées
  onNoCookPress?: () => void; // Navigation vers recettes sans cuisson
  onFastRecipesPress?: () => void; // Navigation vers recettes rapides
  onLowCalRecipesPress?: () => void; // Navigation vers recettes faibles en calories
  onVegetarianPress?: () => void; // Navigation vers recettes végétariennes
  onLightDessertsPress?: () => void; // Navigation vers desserts légers
}

export default function HomePage({ onKitchenPress, onProfilePress, onHomePress, onExpressRecipesPress, onAppetizersPress, onProteinRecipesPress, onNoCookPress, onFastRecipesPress, onLowCalRecipesPress, onVegetarianPress, onLightDessertsPress }: HomePageProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('quick');
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState('Foyer CHAHINE');
  const [favorites, setFavorites] = useState<number[]>([]); // IDs des recettes favorites
  const [categoryRecipes, setCategoryRecipes] = useState<{[key: string]: Recipe[]}>({});

  // Catégories de recettes en français (anciennes préférées)
  const categories = [
    { id: 'favorites', name: 'Favoris', color: '#FFD700' },
    { id: 'quick', name: 'Recettes express', color: '#FFAD4D' },
    { id: 'appetizer', name: 'Apéritifs', color: '#FF6B6B' },
    { id: 'protein', name: 'Protéinées', color: '#4ECDC4' },
    { id: 'no-cook', name: 'Sans cuisson',color: '#45B7D1' },
    { id: 'fast', name: '10 min chrono', color: '#96CEB4' },
    { id: 'low-cal', name: 'Faible calories',color: '#FFEAA7' },
    { id: 'vegetarian', name: 'Végétarien', color: '#A8E6CF' },
    { id: 'dessert', name: 'Desserts légers', color: '#FFB3BA' }
  ];

  // Foyers disponibles
  const households = ['Foyer CHAHINE', 'Foyer DUPONT', 'Foyer MARTIN'];

  // Fonction pour récupérer les recettes depuis TheMealDB pour une catégorie spécifique
  const fetchRecipesForCategory = async (category: string) => {
    try {
      let url = '';

      switch (category) {
        case 'quick':
          // Recettes rapides (poulet et poisson)
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken';
          break;
        case 'appetizer':
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Starter';
          break;
        case 'protein':
          // Recettes protéinées (bœuf et poulet)
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef';
          break;
        case 'no-cook':
          // Recettes sans cuisson (desserts et entrées)
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';
          break;
        case 'fast':
          // Recettes rapides (poulet et poisson)
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood';
          break;
        case 'low-cal':
          // Recettes légères (végétarien et poisson)
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian';
          break;
        case 'vegetarian':
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian';
          break;
        case 'dessert':
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';
          break;
        default:
          url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken';
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.meals) {
        // Récupérer les détails de chaque recette
        const detailedRecipes = await Promise.all(
          data.meals.slice(0, 6).map(async (meal: any) => {
            try {
              const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
              const detailData = await detailResponse.json();
              const recipe = detailData.meals[0];
              
              // Extraire les ingrédients et mesures
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
                readyInMinutes: Math.floor(Math.random() * 45) + 15, // Estimation du temps
                servings: Math.floor(Math.random() * 4) + 2, // Estimation des portions
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

        // Filtrer les recettes null et les ajouter à la catégorie
        const validRecipes = detailedRecipes.filter(recipe => recipe !== null);
        setCategoryRecipes(prev => ({
          ...prev,
          [category]: validRecipes
        }));
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des recettes pour ${category}:`, error);
      // Recettes par défaut pour cette catégorie
      const defaultRecipes = [
        { id: Math.random() * 1000, title: `Recette ${category} 1`, image: '', readyInMinutes: 20, servings: 2, cuisines: ['Française'], instructions: 'Instructions par défaut', ingredients: ['Ingrédient 1', 'Ingrédient 2'] },
        { id: Math.random() * 1000, title: `Recette ${category} 2`, image: '', readyInMinutes: 25, servings: 3, cuisines: ['Française'], instructions: 'Instructions par défaut', ingredients: ['Ingrédient 1', 'Ingrédient 2'] },
        { id: Math.random() * 1000, title: `Recette ${category} 3`, image: '', readyInMinutes: 30, servings: 4, cuisines: ['Française'], instructions: 'Instructions par défaut', ingredients: ['Ingrédient 1', 'Ingrédient 2'] }
      ];
      setCategoryRecipes(prev => ({
        ...prev,
        [category]: defaultRecipes
      }));
    }
  };

  // Charger toutes les catégories au démarrage
  useEffect(() => {
    const loadAllCategories = async () => {
      setLoading(true);
      for (const category of categories) {
        if (category.id !== 'favorites') {
          await fetchRecipesForCategory(category.id);
        }
      }
      setLoading(false);
    };
    
    loadAllCategories();
  }, []);

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'favorites') {
      // Pour les favoris, on reste sur la même page
      return;
    }
    
    if (categoryId === 'quick' && onExpressRecipesPress) {
      // Navigation vers la page des recettes express
      onExpressRecipesPress();
      return;
    }
    
    if (categoryId === 'appetizer' && onAppetizersPress) {
      // Navigation vers la page des apéritifs
      onAppetizersPress();
      return;
    }
    
    if (categoryId === 'protein' && onProteinRecipesPress) {
      // Navigation vers la page des recettes protéinées
      onProteinRecipesPress();
      return;
    }
    
    if (categoryId === 'noCook' && onNoCookPress) {
      // Navigation vers la page des recettes sans cuisson
      onNoCookPress();
      return;
    }
    
    if (categoryId === 'fast' && onFastRecipesPress) {
      // Navigation vers la page des recettes rapides
      onFastRecipesPress();
      return;
    }
    
    if (categoryId === 'lowCal' && onLowCalRecipesPress) {
      // Navigation vers la page des recettes faibles en calories
      onLowCalRecipesPress();
      return;
    }
    
    if (categoryId === 'vegetarian' && onVegetarianPress) {
      // Navigation vers la page des recettes végétariennes
      onVegetarianPress();
      return;
    }
    
    if (categoryId === 'dessert' && onLightDessertsPress) {
      // Navigation vers la page des desserts légers
      onLightDessertsPress();
      return;
    }
    
    // Navigation vers d'autres pages dédiées (à implémenter)
    Alert.alert(
      `Page ${categories.find(c => c.id === categoryId)?.name}`,
      `Vous allez être redirigé vers la page dédiée aux ${categories.find(c => c.id === categoryId)?.name.toLowerCase()}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => {
          // Ici vous pourrez ajouter la navigation vers la page dédiée
          Alert.alert('Fonctionnalité à venir', `La page ${categories.find(c => c.id === categoryId)?.name} sera bientôt disponible !`);
        }}
      ]
    );
  };

  const handleRecipePress = (recipe: Recipe) => {
    // Navigation vers une page de détail de recette (à implémenter)
    Alert.alert(
      recipe.title,
      `🍳 ${recipe.title}\n\n⏱️ Temps de préparation: ${recipe.readyInMinutes || 0} minutes\n👥 Portions: ${recipe.servings || 1} personne(s)\n🌍 Cuisine: ${recipe.cuisines && recipe.cuisines.length > 0 ? recipe.cuisines.join(', ') : 'Non spécifiée'}\n\n📝 Instructions:\n${recipe.instructions || 'Instructions non disponibles'}\n\n🥕 Ingrédients:\n${recipe.ingredients ? recipe.ingredients.map(ing => `• ${ing}`).join('\n') : 'Ingrédients non disponibles'}`,
      [
        { text: 'Fermer', style: 'cancel' },
        { text: 'Voir la recette complète', onPress: () => {
          // Ici vous pourrez ajouter la navigation vers une page de détail
          Alert.alert('Fonctionnalité à venir', 'La page de détail de recette sera bientôt disponible !');
        }}
      ]
    );
  };

  const handlePreferencesPress = () => {
    setShowPreferences(!showPreferences);
  };

  const handleHouseholdSelect = (household: string) => {
    setSelectedHousehold(household);
    setShowPreferences(false);
  };

  // Fonction pour ajouter/supprimer des favoris
  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  // Fonction pour vérifier si une recette est en favori
  const isFavorite = (recipeId: number) => {
    return favorites.includes(recipeId);
  };

  // Obtenir les recettes favorites
  const getFavoriteRecipes = () => {
    const allRecipes = Object.values(categoryRecipes).flat();
    return allRecipes.filter(recipe => favorites.includes(recipe.id));
  };

  return (
    <LinearGradient
      colors={['#FFF3E5', '#FFAD4D']}
      locations={[0.35, 1.0]}
      style={styles.screen}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
        {/* Header avec bouton préférences */}
        <View style={styles.header}>
          <Text style={styles.title}> Mes Recettes</Text>
          <Text style={styles.subtitle}>Découvre ta prochaine création culinaire</Text>
          
          {/* Bouton Préférences alimentaires */}
          <TouchableOpacity style={styles.preferencesButton} onPress={handlePreferencesPress}>
            <Ionicons name="settings-outline" size={20} color="#FFF" />
            <Text style={styles.preferencesButtonText}>Préférences alimentaires</Text>
          </TouchableOpacity>

          {/* Sélecteur de foyer */}
          {showPreferences && (
            <View style={styles.preferencesPanel}>
              <Text style={styles.preferencesTitle}>Sélectionner le foyer :</Text>
              {households.map((household) => (
                <TouchableOpacity
                  key={household}
                  style={[
                    styles.householdOption,
                    selectedHousehold === household && styles.householdOptionSelected
                  ]}
                  onPress={() => handleHouseholdSelect(household)}
                >
                  <Text style={[
                    styles.householdText,
                    selectedHousehold === household && styles.householdTextSelected
                  ]}>
                    {household}
                  </Text>
                  {selectedHousehold === household && (
                    <Ionicons name="checkmark" size={20} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
              <Text style={styles.preferencesInfo}>
                Les filtres d'allergies et préférences seront appliqués pour ce foyer
              </Text>
            </View>
          )}
        </View>

        {/* Catégories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonSelected
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Favoris */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Favoris</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScrollView}>
            {getFavoriteRecipes().length > 0 ? (
              getFavoriteRecipes().map((recipe) => (
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
                  
                  {/* Bouton favori */}
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
              ))
            ) : (
              <View style={styles.emptyFavoritesContainer}>
                <Text style={styles.emptyFavoritesText}>Pas de coup de cœur pour le moment...</Text>
                <Text style={styles.emptyFavoritesSubtext}>Ajoutez des recettes à vos favoris en cliquant sur le cœur </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Sections par catégorie */}
        {categories.slice(1).map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.sectionTitle}>{category.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScrollView}>
              {categoryRecipes[category.id]?.map((recipe) => (
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
                  
                  {/* Bouton favori */}
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
            </ScrollView>
          </View>
        ))}

        {/* Indicateur de défilement */}
        <View style={styles.scrollIndicator}>
          <Ionicons name="chevron-down" size={24} color="#FFAD4D" />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  
  // Header
  header: { 
    alignItems: 'center', 
    marginBottom: 30, 
    marginTop: 20 
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
  preferencesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFAD4D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  preferencesButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Beiruti'
  },
  preferencesPanel: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Beiruti',
    textAlign: 'center',
    marginBottom: 15
  },
  householdOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5E6D3'
  },
  householdOptionSelected: {
    backgroundColor: '#FFAD4D',
    borderColor: '#FFAD4D',
    borderWidth: 2
  },
  householdText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Beiruti'
  },
  householdTextSelected: {
    color: '#FFF'
  },
  preferencesInfo: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Beiruti',
    textAlign: 'center',
    marginTop: 15
  },

  // Catégories
  categoriesContainer: { 
    marginBottom: 25 
  },
  categoryButton: { 
    backgroundColor: '#F5E6D3', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 20, 
    marginRight: 12, 
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  categoryButtonSelected: { 
    backgroundColor: '#FFAD4D' 
  },
  categoryIcon: { 
    fontSize: 20, 
    marginBottom: 4 
  },
  categoryText: { 
    fontSize: 12, 
    color: '#000', 
    fontFamily: 'Beiruti',
    textAlign: 'center'
  },
  categoryTextSelected: { 
    color: '#FFF' 
  },

  // Sections de catégories
  categorySection: {
    marginBottom: 25,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000', 
    fontFamily: 'Beiruti',
    marginBottom: 15,
    marginLeft: 20
  },
  recipesScrollView: {
    paddingBottom: 10,
  },

  // Recettes
  recipeCard: { 
    width: 160, 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 15, 
    marginRight: 15,
    marginLeft: 20,
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

  // Bouton favori
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
  },

  // Indicateur de défilement
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },

  // Favoris vides
  emptyFavoritesContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    minWidth: 300,
    alignSelf: 'center'
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    fontFamily: 'Beiruti',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Beiruti',
    textAlign: 'center',
    lineHeight: 20,
  }
}); 