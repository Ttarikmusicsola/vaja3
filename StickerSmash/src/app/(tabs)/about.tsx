import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ImageViewer from '@/components/image-viewer';

const PlaceholderImage = require('@/assets/images/pecdeck.jpg');

export default function AboutScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [nm, setNm] = useState('');
  const [kg, setKg] = useState('');
  const [st, setSt] = useState('');
  const [rp, setRp] = useState('');
  const [err, setErr] = useState('');
  const [sh] = useState(() => new Animated.Value(0));
  const [op] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(op, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const load = async () => {
      if (!id) return;
      const d = await AsyncStorage.getItem('mojeVaje');
      const arr = d ? JSON.parse(d) : [];
      const obj = arr.find((x: any) => x.id === id);
      if (obj) {
        setNm(obj.ime);
        setKg(obj.teza);
        setSt(obj.sets ?? obj.serije);
        setRp(obj.reps ?? obj.ponovitve);
      }
    };

    load();
  }, [id, op]);

  const animErr = () => {
    Animated.sequence([
      Animated.timing(sh, { toValue: -12, duration: 70, useNativeDriver: true }),
      Animated.timing(sh, { toValue: 12, duration: 70, useNativeDriver: true }),
      Animated.timing(sh, { toValue: -8, duration: 70, useNativeDriver: true }),
      Animated.timing(sh, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  };

  const save = async () => {
    if (nm === '' || kg === '' || st === '' || rp === '') {
      setErr('Izpolni vse');
      animErr();
      return;
    }

    if (Number(st) > 1) {
      setErr('Tole ni optimalno');
      animErr();
      return;
    }

    const d = await AsyncStorage.getItem('mojeVaje');
    const arr = d ? JSON.parse(d) : [];
    let out;

    if (id) {
      out = arr.map((x: any) => {
        if (x.id === id) {
          return { id: x.id, ime: nm, teza: kg, sets: st, reps: rp };
        }
        return x;
      });
    } else {
      const obj = {
        id: Date.now().toString(),
        ime: nm,
        teza: kg,
        sets: st,
        reps: rp,
      };
      out = [...arr, obj];
    }

    await AsyncStorage.setItem('mojeVaje', JSON.stringify(out));
    setNm('');
    setKg('');
    setSt('');
    setRp('');
    setErr('');
    router.push('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable
          style={({ pressed }) => [styles.back, pressed && { opacity: 0.5 }]}
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
        >
          <Ionicons name="arrow-back" size={23} color="#25292e" />
          <Text style={styles.backText}>Nazaj</Text>
        </Pressable>

        <Text style={{ fontSize: 28, color: '#ffd33d', paddingVertical: 18 }}>
          {id ? 'Uredi vajo' : 'Dodaj novo vajo'}
        </Text>

        <View style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} style={styles.roundImage} />
        </View>

        <Animated.View
          style={[
            styles.form,
            {
              opacity: op,
              transform: [
                {
                  translateY: op.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.label}>Ime vaje</Text>
          <TextInput
            style={styles.input}
            value={nm}
            onChangeText={setNm}
          />

          <Text style={styles.label}>Teza v kg</Text>
          <TextInput
            style={styles.input}
            value={kg}
            onChangeText={setKg}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Sets</Text>
          <TextInput
            style={styles.input}
            value={st}
            onChangeText={setSt}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={rp}
            onChangeText={setRp}
            keyboardType="numeric"
          />

          {err !== '' && (
            <Animated.Text style={[styles.error, { transform: [{ translateX: sh }] }]}>
              {err}
            </Animated.Text>
          )}

          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.5 }]} onPress={save}>
            <Text style={styles.buttonText}>{id ? 'Shrani spremembe' : 'Shrani vajo'}</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingBottom: 40,
  },
  imageContainer: {
    marginBottom: 20,
  },
  back: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffd33d',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 13,
  },
  backText: {
    color: '#25292e',
    fontSize: 16,
    fontWeight: '600',
  },
  roundImage: {
    width: 165,
    height: 105,
    borderRadius: 6,
  },
  form: {
    width: '100%',
    backgroundColor: '#343a40',
    padding: 18,
    borderRadius: 11,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    color: '#25292e',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 16,
    marginBottom: 14,
  },
  error: {
    color: '#ff5858',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ffd33d',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#25292e',
    fontSize: 17,
    fontWeight: '700',
  },
});
