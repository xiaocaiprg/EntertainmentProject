import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GameRuleProps {
  bankerValue: number;
  playerValue: number;
  handleBankerWin: () => void;
  handleBankerLose: () => void;
  handlePlayerWin: () => void;
  handlePlayerLose: () => void;
}

export const GameRule: React.FC<GameRuleProps> = React.memo(
  ({ bankerValue, playerValue, handleBankerWin, handleBankerLose, handlePlayerWin, handlePlayerLose }) => {
    return (
      <View style={styles.ruleContainer}>
        <Text style={styles.ruleTitle}>比赛规则</Text>

        <View style={styles.betOptionsColumn}>
          <View style={[styles.betOption, styles.bankerOption, bankerValue === 1 ? styles.selectedOption : {}]}>
            <Text style={[styles.betLabel, styles.bankerLabel]}>庄</Text>

            <View style={styles.buttonsContainer}>
              <View style={styles.buttonWithLabel}>
                <TouchableOpacity style={styles.button} onPress={handleBankerLose}>
                  <Icon name="remove" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>庄输</Text>
              </View>

              <View style={styles.buttonWithLabel}>
                <TouchableOpacity style={styles.button} onPress={handleBankerWin}>
                  <Icon name="add" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>庄赢</Text>
              </View>
            </View>
          </View>

          <View style={[styles.betOption, styles.playerOption, playerValue === 1 ? styles.selectedOption : {}]}>
            <Text style={[styles.betLabel, styles.playerLabel]}>闲</Text>

            <View style={styles.buttonsContainer}>
              <View style={styles.buttonWithLabel}>
                <TouchableOpacity style={styles.button} onPress={handlePlayerLose}>
                  <Icon name="remove" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>闲输</Text>
              </View>

              <View style={styles.buttonWithLabel}>
                <TouchableOpacity style={styles.button} onPress={handlePlayerWin}>
                  <Icon name="add" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>闲赢</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.ruleDescription}>点击"+"表示赢，点击"-"表示输</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  ruleContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  betOptionsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
  },
  betOption: {
    alignItems: 'center',
    width: '90%',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
    marginHorizontal: 5,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#333',
  },
  buttonLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
    fontWeight: 'bold',
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
});
