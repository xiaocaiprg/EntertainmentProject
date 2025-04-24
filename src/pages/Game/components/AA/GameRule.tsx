import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GameRuleProps {
  playRuleCode: string;
  handleBankerWin: () => void;
  handleBankerLose: () => void;
  handlePlayerWin: () => void;
  handlePlayerLose: () => void;
}

export const GameRule: React.FC<GameRuleProps> = React.memo((props: GameRuleProps) => {
  const { playRuleCode, handleBankerWin, handleBankerLose, handlePlayerWin, handlePlayerLose } = props;
  return (
    <View style={styles.ruleContainer}>
      <View style={styles.ruleHeader}>
        <Text style={styles.ruleTitle}>规则</Text>
        <Text style={styles.ruleDescription}>打法:{playRuleCode}</Text>
      </View>
      <View style={styles.betOptionsColumn}>
        <View style={[styles.betOption, styles.bankerOption]}>
          <Text style={[styles.betLabel, styles.bankerLabel]}>庄</Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWithLabel}>
              <TouchableOpacity style={styles.button} onPress={handleBankerWin}>
                <Icon name="add" size={30} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonWithLabel}>
              <TouchableOpacity style={styles.button} onPress={handleBankerLose}>
                <Icon name="remove" size={30} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.betOption, styles.playerOption]}>
          <Text style={[styles.betLabel, styles.playerLabel]}>闲</Text>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWithLabel}>
              <TouchableOpacity style={styles.button} onPress={handlePlayerWin}>
                <Icon name="add" size={30} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonWithLabel}>
              <TouchableOpacity style={styles.button} onPress={handlePlayerLose}>
                <Icon name="remove" size={30} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.ruleDescription}>点击"+"表示赢，点击"-"表示输</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  ruleContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'left',
  },
  betOptionsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  betOption: {
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    height: 80,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankerOption: {
    backgroundColor: '#ffeeee',
    borderColor: '#ffdddd',
  },
  playerOption: {
    backgroundColor: '#eeeeff',
    borderColor: '#ddddff',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#666',
    transform: [{ translateY: -2 }],
  },
  betLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  bankerLabel: {
    color: '#e74c3c',
  },
  playerLabel: {
    color: '#3498db',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '40%',
  },
  buttonWithLabel: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
