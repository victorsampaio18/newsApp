// Tela que mostra as notícia favoritadas (FavoritesScreen)
// Realiza as importações das bibliotecas necessárias
import React, { useCallback, useState, useContext } from 'react'; // Importa o React e alguns hooks importantes
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme } from 'react-native'; // Importa componentes do React Native usados para construir a interface
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas no React Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipo para prop de navegação com TypeScript no stack navigator
import { RootStackParamList } from '../types/navigation'; // Tipos das rotas definidas no projeto
import { NetworkContext } from '../contexts/NetworkContext'; // Importa o NetworkContext, usado para verificar se há conexão com a internet
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa o módulo AsyncStorage, que permite salvar e recuperar dados localmente no dispositivo
import NewsItem from '../components/NewsItem'; // Importa o componente que representa um item de notícia individual na lista

// Define a rota para esta tela das notícias favoritadas
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

// Interface que descreve a estrutura de uma notícia
interface Article {
  title: string;
  imageUrl?: string;
  source: string;
  date: string;
  content?: string;
  url: string;
  category: string;
}

// Função Principal da tela de favoritos
const FavoritesScreen = () => {
  // Estado usado para armazenar as notícias favoritadas
  const [favoriteNews, setFavoriteNews] = useState<Article[]>([]);

  // Acessa o NetworkContext para verificar se está online ou offline
  const { isConnected } = useContext(NetworkContext);

  // Faz a detecção do modo escuro ou claro
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Hook para navegação entre telas
  const navigation = useNavigation<NavigationProp>();

  const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favoritos'); // Reailiza a busca no armazenamento
        const parsed = stored ? JSON.parse(stored) : []; // Converte para array de objetos
        setFavoriteNews(parsed); // Atualiza estado com os favoritos
      } catch (error) {
        Alert.alert('Erro ao carregar favoritos');
      }
    };

  // Recarrega os favoritos sempre que a tela estiver em foco
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Redenrização visual da tela (FavoritesScreen) com o modo para tema claro/escuro
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#f8f9fa' }]}>

      {/* Banner exibido quando está offline */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>No connection — viewing offline favorites</Text>
        </View>
      )}

      {/* Se não houver favoritos, exibe uma mensagem */}
      {favoriteNews.length === 0 ? (
        <Text style={[styles.emptyText, {color: isDarkMode ? '#ffffff' : '##555555'}]}>No news favorited</Text>
      ) : (
        // Se houver favoritos, exibe lista de notícias usando FlatList
        <FlatList
          data={favoriteNews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => ( // Ao tocar, navega para a tela de detalhes com os dados da notícia
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Detail', {
                  title: item.title,
                  imageUrl: item.imageUrl,
                  source: item.source,
                  date: item.date,
                  content: item.content,
                  url: item.url,
                  category: item.category,
                })
              }
            >
              {/* Componente que renderiza os dados da notícia na lista */}
              <NewsItem
                title={item.title}
                imageUrl={item.imageUrl}
                source={item.source}
                date={item.date}
                category={item.category}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>

  );
};

// Define toda a estilização da página
const styles = StyleSheet.create({
  // Estilo principal do container da tela
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    padding: 10, // Adiciona preenchimento interno em todos os lados
  },
  // Texto exibido quando não há favoritos
  emptyText: {
    textAlign: 'center', // Centraliza horizontalmente o texto
    marginTop: 20, // Espaço acima do texto
    fontSize: 16, // Tamanho da fonte
  },
  // Banner exibido quando está offline
  offlineBanner: {
    backgroundColor: '#ff4d4d', // Cor de fundo vermelha
    paddingVertical: 8, // Espaço interno vertical
    alignItems: 'center', // Alinha verticalmente ao centro
    height: 40, // Altura fixa
  },
  // Texto dentro do banner offline
  offlineText: {
    color: '#ffffff', // Cor do texto branca
    fontWeight: 'bold', // Negrito
  },
});

export default FavoritesScreen;