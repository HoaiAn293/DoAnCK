import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedIngredients: string[]) => void;
  selectedIngredients: string[];
}

export function FilterModal({
  visible,
  onClose,
  onApply,
  selectedIngredients: initialSelected,
}: FilterModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as 'light' | 'dark'];
  
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchIngredients();
      setSelected(initialSelected);
    }
  }, [visible]);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await api.getIngredients();
      if (response.success) {
        setIngredients(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (ingredient: string) => {
    if (selected.includes(ingredient)) {
      setSelected(selected.filter((i) => i !== ingredient));
    } else {
      setSelected([...selected, ingredient]);
    }
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Filter by Ingredients</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.infoText, { color: colors.text }]}>
            What in your fridge? Select ingredients to find matching recipes.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={ingredients}
              keyExtractor={(item) => item}
              numColumns={2}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.ingredientChip,
                    {
                      borderColor: colors.icon,
                      backgroundColor: selected.includes(item) ? colors.tint : 'transparent',
                    },
                  ]}
                  onPress={() => toggleIngredient(item)}>
                  <Text
                    style={[
                      styles.ingredientText,
                      { color: selected.includes(item) ? '#fff' : colors.text },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.tint }]} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters ({selected.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  ingredientChip: {
    flex: 1,
    margin: 4,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  ingredientText: {
    fontSize: 14,
  },
  applyButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
