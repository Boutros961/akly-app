// components/StyleProfilePage.ts
import { StyleSheet } from 'react-native';

const PROFILE_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
} as const;

const INPUT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3,
} as const;

const LIGHT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 1,
} as const;

const BASE_BUTTON = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  ...PROFILE_SHADOW,
} as const;

const BASE_BUTTON_TEXT = {
  fontWeight: '600',
  fontFamily: 'Beiruti',
  fontSize: 16,
} as const;

export const StyleProfilePage = StyleSheet.create({
  // ===== LAYOUT DE BASE =====
  screen: { 
    flex: 1 
  },
  
  scroll: { 
    flex: 1 
  },
  
  contentContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 0, 
    paddingBottom: 50 
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Beiruti',
  },

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginTop: 60,
    paddingHorizontal: 4,
  },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2D1B08', 
    fontFamily: 'Montserrat-Bold',
    flex: 1,
  },

  photoButton: {
    backgroundColor: '#FFE0BD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...LIGHT_SHADOW,
  },

  photoButtonIcon: {
    marginRight: 6,
  },

  photoButtonText: {
    color: '#2D1B08',
    fontWeight: '600',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },

  // ===== AVATAR SECTION =====
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
    ...PROFILE_SHADOW,
  },

  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFAD4D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    ...LIGHT_SHADOW,
  },

  avatarHint: {
    fontSize: 14,
    color: '#8B7355',
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
  },

  // ===== FORMULAIRE =====
  form: { 
    flex: 1 
  },

  inputGroup: { 
    marginBottom: 24 
  },

  label: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#2D1B08', 
    marginBottom: 8, 
    fontFamily: 'Montserrat-Bold',
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D1B08',
    fontFamily: 'Montserrat',
    borderWidth: 1,
    borderColor: '#F0E6D6',
    ...INPUT_SHADOW,
  },

  // ===== SECTIONS =====
  notificationSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    ...INPUT_SHADOW,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B08',
    marginBottom: 16,
    fontFamily: 'Montserrat-Bold',
  },

  actionsSection: {
    gap: 16,
  },

  // ===== CHECKBOXES =====
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    paddingVertical: 4,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D4B896',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  checkboxSelected: { 
    backgroundColor: '#FFAD4D',
    borderColor: '#FFAD4D',
  },

  checkboxText: { 
    fontSize: 16, 
    color: '#2D1B08', 
    fontFamily: 'Montserrat',
    flex: 1,
  },

  // ===== BOUTONS =====
  logoutButton: {
    ...BASE_BUTTON,
    backgroundColor: '#FFE0BD',
    gap: 8,
  },

  logoutButtonText: { 
    ...BASE_BUTTON_TEXT, 
    color: '#2D1B08',
  },

  deleteAccountButton: {
    ...BASE_BUTTON,
    backgroundColor: '#FF6B6B',
    gap: 8,
  },

  deleteAccountButtonText: { 
    ...BASE_BUTTON_TEXT, 
    color: '#FFF',
  },

  buttonIcon: {
    // Les icônes sont positionnées via gap dans BASE_BUTTON
  },

  // ===== STYLES LEGACY (conservés pour compatibilité) =====
  editButton: { 
    backgroundColor: '#FFE0BD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...PROFILE_SHADOW,
  },
  
  editButtonText: { 
    color: '#000', 
    fontWeight: '600', 
    fontFamily: 'Montserrat',
  },

  changeBtn: { 
    backgroundColor: '#FFE0BD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...PROFILE_SHADOW,
  },

  changeBtnText: { 
    color: '#000', 
    fontWeight: '600', 
    fontFamily: 'Montserrat',
  },

  avatarRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 30 
  },

  disabledInput: { 
    backgroundColor: '#F8EFDE', 
    color: '#000' 
  },

  saveButton: {
    backgroundColor: '#FFAD4D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },

  saveButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...INPUT_SHADOW,
  },

  dropdownButtonText: { 
    fontSize: 16, 
    color: '#000', 
    fontFamily: 'Montserrat',
  },

  dropdownMenu: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 8,
    ...INPUT_SHADOW,
  },

  dropdownItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 16 
  },

  dropdownItemText: { 
    fontSize: 16, 
    color: '#000', 
    fontFamily: 'Montserrat',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5', // Couleur de fond grisée
    color: '#666',              // Texte plus sombre
    opacity: 0.8,               // Légère transparence
  }
});

export const colors = {
  primary: '#FFAD4D',
  secondary: '#FFE0BD',
  accent: '#8B4513',
  background: '#FFF3E5',
  text: '#2D1B08',
  textMuted: '#8B7355',
  border: '#F0E6D6',
  white: '#FFF',
};