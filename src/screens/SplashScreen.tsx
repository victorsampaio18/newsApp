// Tela de abertura do app (SplashScreen)
// Realiza as importações das bibliotecas necessárias
import React, { useEffect, useContext } from 'react'; // Importa o React e alguns hooks importantes
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native'; // Importa componentes do React Native usados para construir a interface
import { NewsContext } from '../contexts/NewsContext'; // Importa a NewsContext para utilizar a função de pré-carregamento
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas no React Navigation (Direcionar para a Home)
import { StackNavigationProp } from '@react-navigation/stack'; // Utilizado para tipar a navegação entre telas em um stack navigator (navegação baseada em pilha)
import { RootStackParamList } from '../types/navigation'; // Tipos das rotas definidas no projeto

// Define o tipo da navegação usado especificamente na SplashScreen
type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

// Componente da tela de splash (carregamento inicial)
const SplashScreen: React.FC = () => {
  // Acessa o objeto de navegação com o tipo correto
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // Obtém a função preloadData do contexto de notícias
  const { preloadData } = useContext(NewsContext);

  // Hook que é executado assim que a tela é montada
  useEffect(() => {
    const init = async () => {
      await preloadData(); // Aguarda a função que carrega os dados iniciais (online ou cache)

       // Após pequena pausa, navega para a tela Home substituindo a splash (não permitindo voltar)
      setTimeout(() => {
        navigation.replace('Home');
      }, 1000); // 1 segundo para mostrar a logo e o carregamento
    };

    // Executa a função assíncrona
    init();
  }, []);

  return (
    <View style={styles.container}>
      {/* Exibe a logo do aplicativo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      {/* Indicador de carregamento visual */}
      <ActivityIndicator size="large" color="#ffffff" style={styles.loading} />
    </View>
    
  );
};

// Exporta o componente para uso na navegação
export default SplashScreen;

// Estilos da tela splash
const styles = StyleSheet.create({
  // Estilo principal do container da tela
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    backgroundColor: '#1e90ff', // Cor de fundo azul
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Alinha verticalmente ao centro
  },
  // Define o tamanho para a logo
  logo: {
    width: 180,
    height: 180,
  },
  loading: {
    marginTop: 30, // espaço entre logo e carregamento
  },
});