import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoItem {
  icon: string;
  label: string;
  value: string;
}

interface InfoGridProps {
  items: InfoItem[];
}

export const InfoGrid: React.FC<InfoGridProps> = ({ items }) => {
  return (
    <View style={styles.infoGrid}>
      {items.map((item, idx) => (
        <View style={styles.infoCard} key={idx}>
          <MaterialCommunityIcons name={item.icon} size={22} color="#888" />
          <Text style={styles.infoLabel}>{item.label}</Text>
          <Text style={styles.infoValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    paddingVertical: 18,
    marginBottom: 8,
    gap: 4,
  },
  infoLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
  infoValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
}); 