import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/pc2.jpg');

export default function Index() {
  const [lst, setLst] = useState<any[]>([]);
  const [xPos] = useState(() => new Animated.Value(-300));
  const [sc] = useState(() => new Animated.Value(1));

  const getLst = async () => {
    try {
      const d = await AsyncStorage.getItem('mojeVaje');
      const arr = d ? JSON.parse(d) : [];
      setLst(arr);
    } catch {
      setLst([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLst();
    }, [])
  );

  useEffect(() => {
    Animated.timing(xPos, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();

    const animacija = Animated.loop(
      Animated.sequence([
        Animated.timing(sc, {
          toValue: 1.06,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(sc, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    animacija.start();
    return () => animacija.stop();
  }, [xPos, sc]);

  const del = async (id: string) => {
    const arr = lst.filter((x: any) => x.id !== id);
    setLst(arr);
    await AsyncStorage.setItem('mojeVaje', JSON.stringify(arr));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.Text style={[styles.title, { transform: [{ translateX: xPos }] }]}>Moje vaje</Animated.Text>

      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} style={styles.mainImage} />
      </View>

      <Text style={{ fontSize: 19, color: 'white', paddingVertical: 14 }}>
        Tukaj si lahko shranis vaje, tezo, sets in reps.
      </Text>

      {lst.length === 0 && (
        <Text style={styles.empty}>Nimas se nobene shranjene vaje.</Text>
      )}

      {lst.map((x: any) => (
        <Pressable
          key={x.id}
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.55 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{x.ime}</Text>
            <Text style={styles.cardText}>{x.teza} kg</Text>
            <Text style={styles.cardText}>{x.sets ?? x.serije} sets x {x.reps ?? x.ponovitve} reps</Text>
          </View>

          <View style={styles.cardButtons}>
            <Link href={{ pathname: '/about', params: { id: x.id } }} asChild>
              <Pressable style={styles.editButton}>
                <Ionicons name="pencil" size={19} color="#25292e" />
              </Pressable>
            </Link>
            <Pressable style={styles.deleteButton} onPress={() => del(x.id)}>
              <Ionicons name="close" size={22} color="white" />
            </Pressable>
          </View>
        </Pressable>
      ))}

      <Animated.View style={{ transform: [{ scale: sc }] }}>
        <Link href="/about" asChild>
          <Pressable style={styles.button}>
            <Ionicons name="add-circle-outline" size={23} color="#25292e" />
            <Text style={styles.buttonText}>Dodaj vajo</Text>
          </Pressable>
        </Link>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 35,
  },
  title: {
    fontSize: 30,
    color: 'white',
    paddingVertical: 18,
    fontWeight: '700',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 175,
    borderRadius: 7,
  },
  empty: {
    color: '#a0a0a0',
    fontSize: 16,
    paddingVertical: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#343a40',
    borderRadius: 9,
    padding: 16,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#ffd33d',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 7,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 3,
  },
  cardButtons: {
    gap: 10,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#ffd33d',
    padding: 10,
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#b92d2d',
    padding: 8,
    borderRadius: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffd33d',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 12,
  },
  buttonText: {
    color: '#25292e',
    fontSize: 17,
    fontWeight: '600',
  },
});
