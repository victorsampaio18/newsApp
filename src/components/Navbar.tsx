// Navbar que fica presente na HomeScreen (Navbar)
// Realiza as importações das bibliotecas necessárias
import React, { useEffect, useRef } from 'react'; // Importa o React e alguns hooks importantes
import { Animated, StyleSheet } from 'react-native'; // Importa componentes do React Native usados para construir a interface

// Define a interface que especifica as props esperadas pelo componente
interface NavbarProps {
  collapsed: boolean; // Determina se a barra deve estar colapsada (escondida) ou não
}

// Componente funcional Navbar, que recebe a prop `collapsed`
const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
  // Cria uma referência animada para controlar o eixo Y (movimento vertical)
  const translateY = useRef(new Animated.Value(0)).current;

  // Cria uma referência animada para controlar a opacidade do logo
  const logoOpacity = useRef(new Animated.Value(1)).current;

  // useEffect dispara animações sempre que a prop `collapsed` muda
  useEffect(() => {
    // Anima o movimento vertical da Navbar
    Animated.timing(translateY, {
      toValue: collapsed ? -60 : 0, // Se colapsado, move -60px para cima; senão, volta à posição original
      duration: 300, // Duração da animação em milissegundos
      useNativeDriver: true, // Usa o driver nativo para melhor performance
    }).start();

    // Anima a opacidade do logo (mostra ou esconde)
    Animated.timing(logoOpacity, {
      toValue: collapsed ? 0 : 1, // Se colapsado, esconde o logo (opacidade 0) ou mostra a logo (opacidade 1)
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [collapsed]); // Executa sempre que 'collapsed' mudar

  return (
    // View animada que representa a barra de navegação
    <Animated.View
      style={[
        styles.navbar,
        {
          transform: [{ translateY }],
        },
      ]}
    >

      {/* Imagem animada da logo com opacidade controlada */}
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { opacity: logoOpacity }]} // Aplica estilo e animação de opacidade
        resizeMode="contain" // Garante que a imagem não distorça
      />
    </Animated.View>
  );
};

// Exporta o componente para uso em outras partes do app
export default Navbar;

// Estilos aplicados à Navbar e à logo
const styles = StyleSheet.create({
  navbar: {
    width: '100%', // Ocupa toda a largura da tela
    paddingVertical: 20, // Espaçamento vertical
    backgroundColor: '#1e90ff', // Cor de fundo azul
    alignItems: 'center', // Centraliza a logo horizontalmente
    justifyContent: 'center', // Centraliza a logo verticalmente
    elevation: 4, // Sombra em Android
    height: 90, // Define uma altura fixa
  },
  logo: {
    width: 200,
    height: 70,
    resizeMode: 'contain', // Garante que a logo mantenha proporção
  },
});