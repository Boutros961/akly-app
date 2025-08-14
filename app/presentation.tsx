import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '../components/GradientText'; // adapte le chemin

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Hey, Bienvenue sur AKLY',
    description: 'Avec AKLY gère durablement tes produits à plusieurs',
    image: require('../assets/images/FamilleQuiSentraide.png'),
  },
  {
    id: '2',
    title: 'Ne rate plus jamais une date de péremption !',
    description: '',
    image: require('../assets/images/Calender.png'),
  },
  {
    id: '3',
    title: 'Cuisine ce que tu veux selon TES envies\net ce que tu as dans TON frigo',
    description: '',
    image: require('../assets/images/LookingInTheFridge.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleSkip = () => {
    router.replace('/UserInfos');
  };

  const renderItem = ({ item }: any) => (
    <LinearGradient
      colors={['#FFEAD8', '#FF8C1A']}
      style={styles.slide}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.textContainer}>
        <GradientText
          text={item.title}
          colors={['#FC9D44', '#D96C00'] as const}
          style={styles.title}
        />
        {item.description !== '' && (
          <GradientText
            text={item.description}
            colors={['#FC9D44', '#D96C00'] as const}
            style={styles.description}
          />
        )}
      </View>
      {item.image && (
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      )}
    </LinearGradient>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {currentIndex !== 0 ? (
          <TouchableOpacity
            onPress={() =>
              flatListRef.current?.scrollToIndex({ index: currentIndex - 1 })
            }
          >
            <GradientText
              text="←"
              colors={['#FC9D44', '#D96C00'] as const}
              style={styles.backText}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity onPress={handleSkip}>
          <GradientText
            text={currentIndex === slides.length - 1 ? 'Commencer' : 'Passer'}
            colors={['#FC9D44', '#D96C00'] as const}
            style={styles.skipText}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
      />

      {renderPagination()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEAD8',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    marginBottom: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 350,
    marginTop: 20,
  },
  topBar: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  skipText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  pagination: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginHorizontal: 20,
  },
  dotInactive: {
    backgroundColor: '#fff7',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
});
