import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Dimensions,
  StatusBar 
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [currentOperand, setCurrentOperand] = useState('0');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(null);
  const [resetOnNextInput, setResetOnNextInput] = useState(false);
  
  // Calcul responsive
  const buttonSize = Math.min((width - 50) / 4, 90);
  const displayFontSize = Math.min(width / 10, 42);
  const buttonFontSize = Math.min(width / 16, 26);
  
  const appendNumber = (number) => {
    if (resetOnNextInput) {
      setCurrentOperand(number);
      setResetOnNextInput(false);
    } else {
      setCurrentOperand(currentOperand === '0' ? number : currentOperand + number);
    }
  };
  
  const appendDecimal = () => {
    if (resetOnNextInput) {
      setCurrentOperand('0.');
      setResetOnNextInput(false);
      return;
    }
    
    if (!currentOperand.includes('.')) {
      setCurrentOperand(currentOperand + '.');
    }
  };
  
  const chooseOperation = (op) => {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
      compute();
    }
    
    setOperation(op);
    setPreviousOperand(currentOperand);
    setCurrentOperand('');
  };
  
  const compute = () => {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
      case '+': computation = prev + current; break;
      case '-': computation = prev - current; break;
      case '×': computation = prev * current; break;
      case '÷': 
        if (current === 0) {
          setCurrentOperand('Error');
          setResetOnNextInput(true);
          return;
        }
        computation = prev / current; 
        break;
      default: return;
    }
    
    setCurrentOperand(computation.toString());
    setOperation(null);
    setPreviousOperand('');
    setResetOnNextInput(true);
  };
  
  const clearAll = () => {
    setCurrentOperand('0');
    setPreviousOperand('');
    setOperation(null);
    setResetOnNextInput(false);
  };
  
  const deleteLast = () => {
    if (resetOnNextInput || currentOperand === 'Error') {
      clearAll();
      return;
    }
    
    setCurrentOperand(currentOperand.length === 1 ? '0' : currentOperand.slice(0, -1));
  };

  // DISPOSITION CORRIGÉE - POINT DOUBLE LARGEUR
  const buttonRows = [
    // Ligne 1: AC, DEL, ÷, ×
    [
      { label: 'AC', type: 'function', action: clearAll, width: 1 },
      { label: 'DEL', type: 'function', action: deleteLast, width: 1 },
      { label: '÷', type: 'operation', action: () => chooseOperation('÷'), width: 1 },
      { label: '×', type: 'operation', action: () => chooseOperation('×'), width: 1 }
    ],
    // Ligne 2: 7, 8, 9, -
    [
      { label: '7', type: 'number', action: () => appendNumber('7'), width: 1 },
      { label: '8', type: 'number', action: () => appendNumber('8'), width: 1 },
      { label: '9', type: 'number', action: () => appendNumber('9'), width: 1 },
      { label: '-', type: 'operation', action: () => chooseOperation('-'), width: 1 }
    ],
    // Ligne 3: 4, 5, 6, +
    [
      { label: '4', type: 'number', action: () => appendNumber('4'), width: 1 },
      { label: '5', type: 'number', action: () => appendNumber('5'), width: 1 },
      { label: '6', type: 'number', action: () => appendNumber('6'), width: 1 },
      { label: '+', type: 'operation', action: () => chooseOperation('+'), width: 1 }
    ],
    // Ligne 4: 1, 2, 3, =
    [
      { label: '1', type: 'number', action: () => appendNumber('1'), width: 1 },
      { label: '2', type: 'number', action: () => appendNumber('2'), width: 1 },
      { label: '3', type: 'number', action: () => appendNumber('3'), width: 1 },
      { label: '=', type: 'equals', action: compute, width: 1 }
    ],
    // Ligne 5: 0 (double largeur), . (double largeur)
    [
      { label: '0', type: 'number', action: () => appendNumber('0'), width: 2 },
      { label: '.', type: 'number', action: appendDecimal, width: 2 } // POINT DOUBLE LARGEUR
    ]
  ];

  const getButtonStyle = (type) => {
    switch (type) {
      case 'function': return styles.functionButton;
      case 'operation': return styles.operationButton;
      case 'equals': return styles.equalsButton;
      default: return styles.numberButton;
    }
  };

  const getButtonTextStyle = (type) => {
    switch (type) {
      case 'function': return styles.functionText;
      case 'equals': return styles.equalsText;
      default: return styles.buttonText;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calculatrice React Native</Text>
        <Text style={styles.headerSubtitle}>Développée pour le cours d'App Mobile</Text>
      </View>
      
      <View style={styles.calculator}>
        {/* Écran d'affichage */}
        <View style={styles.display}>
          <Text style={styles.previousOperand}>
            {previousOperand} {operation}
          </Text>
          <Text style={[styles.currentOperand, { fontSize: displayFontSize }]}>
            {currentOperand}
          </Text>
        </View>
        
        {/* Grille de boutons - DISPOSITION CORRIGÉE */}
        <View style={styles.buttonsGrid}>
          {buttonRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { 
                      width: button.width === 2 ? (buttonSize * 2) + 10 : buttonSize,
                      height: buttonSize
                    },
                    getButtonStyle(button.type)
                  ]}
                  onPress={button.action}
                  activeOpacity={0.7}
                >
                  <Text style={[getButtonTextStyle(button.type), { fontSize: buttonFontSize }]}>
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a11cb',
    padding: 15,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
  },
  calculator: {
    backgroundColor: '#2c3e50',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 10,
  },
  display: {
    backgroundColor: '#1a252f',
    padding: 25,
    minHeight: 140,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  previousOperand: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    marginBottom: 10,
  },
  currentOperand: {
    color: 'white',
    fontWeight: '300',
  },
  buttonsGrid: {
    backgroundColor: '#34495e',
    padding: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  functionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  equalsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  numberButton: {
    backgroundColor: '#2c3e50',
  },
  operationButton: {
    backgroundColor: '#3498db',
  },
  functionButton: {
    backgroundColor: '#f39c12',
  },
  equalsButton: {
    backgroundColor: '#e74c3c',
  },
});