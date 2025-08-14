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

const BASE_BUTTON = {
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: 'center',
  ...PROFILE_SHADOW,
} as const;

const BASE_BUTTON_TEXT = {
  fontWeight: '600',
  fontFamily: 'Beiruti', // Assure-toi que la police est chargée
} as const;

export const StyleProfilePage = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 0, paddingBottom: 50 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 50,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', fontFamily: 'Beiruti' },

  editButton: { ...BASE_BUTTON, backgroundColor: '#FFE0BD' },
  editButtonText: { ...BASE_BUTTON_TEXT, color: '#000' },

  changeBtn: { ...BASE_BUTTON, backgroundColor: '#FFE0BD' },
  changeBtnText: { ...BASE_BUTTON_TEXT, color: '#000' },

  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },

  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8, fontFamily: 'Beiruti' },
  input: {
    backgroundColor: '#F5E6D3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Beiruti',
    ...INPUT_SHADOW,
  },
  disabledInput: { backgroundColor: '#F8EFDE', color: '#000' },

  saveButton: {
    backgroundColor: '#FFAD4D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8B4513',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: { backgroundColor: '#8B4513' },
  checkboxText: { fontSize: 16, color: '#000', fontFamily: 'Beiruti' },

  logoutButton: {
    ...BASE_BUTTON,
    backgroundColor: '#FFE0BD',
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoutButtonText: { ...BASE_BUTTON_TEXT, color: '#000', fontSize: 16 },

  deleteAccountButton: {
    ...BASE_BUTTON,
    backgroundColor: '#FF6B6B',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  deleteAccountButtonText: { ...BASE_BUTTON_TEXT, color: '#FFF', fontSize: 16 },

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
  dropdownButtonText: { fontSize: 16, color: '#000', fontFamily: 'Beiruti' },
  dropdownMenu: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownItemText: { fontSize: 16, color: '#000', fontFamily: 'Beiruti' },
});

export const colors = {
  primary: '#FFAD4D',
  secondary: '#FFE0BD',
  accent: '#8B4513',
};
