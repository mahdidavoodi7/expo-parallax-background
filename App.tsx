import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Parallax from './Parallax';

export default function App() {
  return (
    <GestureHandlerRootView>
      <Parallax />
    </GestureHandlerRootView>
  );
}
