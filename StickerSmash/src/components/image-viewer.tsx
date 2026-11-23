import { Image, ImageSource } from 'expo-image';
import { ImageStyle, StyleProp, StyleSheet } from 'react-native';

type Props = {
  imgSource: ImageSource | number;
  style?: StyleProp<ImageStyle>;
};

export default function ImageViewer({ imgSource, style }: Props) {
  return <Image source={imgSource} style={[styles.image, style]} contentFit="cover" />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
