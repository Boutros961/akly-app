import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    fontSize: 36, // augmenté
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 60, // moins bas
    marginTop: 40,     // ajouté pour le placer plus haut
  },
  input: {
    width: '100%',
    height: 70,
    backgroundColor: '#FFD7A0',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center', // centrer le texte
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    fontWeight: 'bold',
    fontSize: 16, // ← optionnel pour que ça ressorte mieux

  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD7A0',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    height: 70,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
  },
  passwordInput: {
    flex: 1,
    color: '#000',
    textAlign: 'center', // centrer le texte dans les mots de passe aussi
    fontSize: 16, // ← optionnel pour que ça ressorte mieux
    fontWeight: 'bold',

  },
  eye: {
    fontSize: 18,
    color: '#000',
  },
  authButton: {
    width: '100%',
    height: 70, // 👈 Hauteur définie ici
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30, // pour qu'il ait le même arrondi que les autres
    alignItems: 'center',
    justifyContent: 'center', // 👈 pour centrer verticalement le texte
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
  },
  
  authText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16, // ← optionnel pour que ça ressorte mieux
  },
  or: {
    color: '#000',
    marginBottom: 10,
    fontSize: 16, // ← optionnel pour que ça ressorte mieux
    // fontWeight: 'bold',
  },
  googleButton: {
    width: '100%',
    backgroundColor: 'transparent', // transparent
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,             // pour les contours noirs
    borderColor: '#686666',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 70,
    
  },
  googleText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10, // pour que le texte soit à côté du logo Google
    fontSize: 16, // ← optionnel pour que ça ressorte mieux
  },
  footer: {
    flexDirection: 'row',
  },
  footerText: {
    color: '#000',
    fontSize: 16, // ← optionnel pour que ça ressorte mieux
  },
  footerLink: {
    color: '#000',
    fontWeight: 'bold',
  },
  googleImage: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    // tintColor: '#000',
    marginLeft: 8,
  },
  
});
