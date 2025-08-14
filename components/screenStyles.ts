import { StyleSheet } from 'react-native';

export const colors = {
  bgGradient: ['#FF8C1A', '#FFEAD8'] as [string, string],
  text: '#1F2937',
  muted: '#6B7280',
  card: '#FFEDD5',
  border: '#FCD34D',
  navbarBg: '#FFE8CC',
  // Nouvelles couleurs pour simplifier
  inputBg: '#FFE8CC',
  chipBg: '#FFE8CC',
  chipSelectedBg: '#FFD8A8',
  chipSelectedText: '#7C2D12',
  stepperColor: '#C2410C',
  white: '#fff',
  orange: '#FF8C1A',
  lightOrange: '#FFF0D5',
  placeholderText: '#9CA3AF',
};

// Constantes communes
const BORDER_RADIUS = {
  small: 12,
  medium: 16,
  large: 18,
  xlarge: 25,
  round: 22,
};

const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
};

export const screenStyles = StyleSheet.create({
  // ===== LAYOUT DE BASE =====
  container: {
    flex: 1,
  },
  
  blocBlanc: {
    flex: 1,
    backgroundColor: colors.lightOrange,
    borderTopLeftRadius: BORDER_RADIUS.xlarge,
    borderTopRightRadius: BORDER_RADIUS.xlarge,
    padding: 30,
    marginTop: 20,
    minHeight: 550,
  },
  
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },

  // ===== TYPOGRAPHIE =====
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  
  headerTitle: {
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
    color: colors.text,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
  
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  
//   cardTitle: {
//     fontSize: 86,
//     fontWeight: '600',
//     color: colors.text,
//    fontFamily: 'Montserrat',
//   },
  
  addText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'Montserrat',
  },
  
  chipText: {
    fontSize: 11.5,
    color: colors.text,
    fontWeight: '600',
    fontFamily: 'Montserrat',

  },
  
  helper: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  
  note: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
  },

  // ===== ÉLÉMENTS INTERACTIFS =====
  // Cartes
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    padding: 16,
    borderRadius: BORDER_RADIUS.large,
    ...SHADOWS.light,
  },

  // Headers
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: BORDER_RADIUS.xlarge,
    borderBottomRightRadius: BORDER_RADIUS.xlarge,
    overflow: 'hidden',
  },
  
  headerIcon: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.xlarge,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Icônes et boutons
  addIcon: {
    backgroundColor: colors.border,
    height: 44,
    width: 44,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  plus: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    lineHeight: 26,
  },
  
  submitBtn: {
    marginTop: 26,
    backgroundColor: colors.orange,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  
  submitTxt: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },

  // ===== FORMULAIRES =====
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'Montserrat',

  },

  // Counter
  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  stepper: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  stepTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.stepperColor,
    fontFamily: 'Montserrat',
  },

  // ===== CHIPS (RESTRICTIONS) =====
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.chipBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.medium,
  },
  
  chipSelected: {
    backgroundColor: colors.chipSelectedBg,
  },
  
  chipTextSelected: {
    color: colors.chipSelectedText,
  },
  
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginRight: 8,
    opacity: 0.6,
  },
  
  dotSelected: {
    opacity: 1,
  },

  //CARTES BLOC BLANC 
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',

  },

// ===== STYLES FOYERS (NOUVEAU DESIGN) =====
foyerCard: {
    backgroundColor: colors.white,
    borderRadius: BORDER_RADIUS.large,
    padding: 16,
    marginTop: 12,
    ...SHADOWS.medium,
  },
  
  foyerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  foyerIconContainer: {
    backgroundColor: colors.orange,
    borderRadius: BORDER_RADIUS.small,
    padding: 8,
    marginRight: 12,
  },
  
  foyerIcon: {
    width: 24,
    height: 24,
    tintColor: colors.white,
  },
  
  foyerInfo: {
    flex: 1,
  },
  
  foyerTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
    color: colors.text,
  },
  
  modifyBtn: {
    backgroundColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.small,
  },
  
  modifyBtnText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
  
  foyerBlocs: {
    flexDirection: 'row',
    gap: 12,
  },
  
  blocPersonnes: {
    backgroundColor: '#E0F2FE', // Bleu clair
    borderRadius: BORDER_RADIUS.small,
    padding: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  
  blocRestrictions: {
    backgroundColor: '#FEF3C7', // Jaune clair
    borderRadius: BORDER_RADIUS.small,
    padding: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  
  blocNumber: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
    color: colors.text,
  },
  
  blocLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat',
    color: colors.muted,
    marginTop: 2,
  },
  

//   -------------------

});