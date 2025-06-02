// Importação de bibliotecas e hooks necessários
import React from 'react'; // Importa a biblioteca React
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Importa o criador de pilha de navegação nativa do React Navigation
import { RootStackParamList } from './types/navigation'; // Importa o tipo RootStackParamList, que define os parâmetros esperados por cada tela da navegação
// Importa as telas que serão usadas na navegação
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SplashScreen from './screens/SplashScreen';

// Cria a pilha de navegação usando os tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();

// Define o componente que configura a navegação entre telas do app
const AppNavigator = () => {
  return (
    // Define Splash como a primeira tela exibida
    <Stack.Navigator initialRouteName="Splash">
      {/* Tela de carregamento inicial (splash), sem exibição do cabeçalho */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>

      {/* Tela principal (Home), também sem exibição do cabeçalho */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />

      {/* Tela de detalhes da notícia, com cabeçalho customizado */}
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'News Details', headerStyle: { backgroundColor: '#1e90ff' }, headerTintColor: '#fff' }} />
      
      {/* Tela de favoritos, com cabeçalho customizado */}
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites', headerStyle: { backgroundColor: '#1e90ff' }, headerTintColor: '#fff' }} />
    </Stack.Navigator>
  );
};

// Exporta o componente de navegação para uso no App
export default AppNavigator;