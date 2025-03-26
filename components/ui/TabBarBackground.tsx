// This is a shim for web and Android where the tab bar is generally opaque.
// export default undefined;
import { Text } from 'react-native';

export default function TabBarBackground() {
  return null;
}

export function useBottomTabOverflow() {
  return 0;
}