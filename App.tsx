import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigations/StackNavigator';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import ImmersiveMode from 'react-native-immersive';
import Toast from 'react-native-toast-message';

const App = () => {
  useEffect(() => {
  ImmersiveMode.on(); 
}, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
        <Toast />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
