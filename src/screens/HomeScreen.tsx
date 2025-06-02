// Tela principal do app que mostra as notícias (HomeScreen)
// Realiza as importações das bibliotecas necessárias
import React, { useContext, useState, useRef } from 'react'; // Importa o React e alguns hooks importantes
import { View, Text, TextInput, FlatList, StyleSheet , Animated, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, useColorScheme} from 'react-native'; // Importa componentes do React Native usados para construir a interface
import { NewsContext, NEWS_CATEGORIES } from '../contexts/NewsContext'; // Importa a NewsContext e as categorias definidas para filtro
import { NetworkContext } from '../contexts/NetworkContext'; // Importa o NetworkContext, usado para verificar se há conexão com a internet
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas no React Navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipo para prop de navegação com TypeScript no stack navigator
import { RootStackParamList } from '../types/navigation'; // Tipos das rotas definidas no projeto
import RNPickerSelect from 'react-native-picker-select'; // Importa um seletor dropdown personalizável para React Native
import NewsItem from '../components/NewsItem'; // Importa o componente que representa um item de notícia individual na lista
import Navbar from '../components/Navbar'; // Importa o componente para exibir a navbar

// Define a rota para esta tela da home
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Função Principal da tela inicial do app
const HomeScreen = () => {
  // Importa o NewsContext, com a lista de notícias e a função de pré-carregamento
  const { news, preloadData } = useContext(NewsContext);

  // Estados de busca, categorias e atualização
  const [searchQuery, setSearchQuery] = useState(''); // Estado de busca
  const [selectedCategory, setSelectedCategory] = useState('all'); // Estado de categoria
  const [refreshing, setRefreshing] = useState(false); // Estado de atualização das notícias

  // Acessa o NetworkContext para verificar se está online ou offline
  const { isConnected } = useContext(NetworkContext);

  // Faz a detecção do modo escuro ou claro
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Animações e controle de visibilidade do header
  const [showHeader, setShowHeader] = useState(true); // Controla exibição da header
  const [lastScrollY, setLastScrollY] = useState(0); // Armazena posição anterior do scroll
  const searchTranslateY = useRef(new Animated.Value(0)).current; // Animação da header

  // Hook para navegação entre telas
  const navigation = useNavigation<NavigationProp>();

  // Filtra as notícias com base na busca, categoria e se possuem imagem
  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const hasImage = item.urlToImage;
    return matchesSearch && matchesCategory && hasImage;
  });

  // Função chamada ao puxar a lista para baixo (pull-to-refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    await preloadData(); // Recarrega as notícias
    setRefreshing(false);
  };

  // Detecta direção do scroll para esconder ou mostrar a barra de busca, filtro e botão favoritos
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const goingDown = currentScrollY > lastScrollY;

    setShowHeader(!goingDown); // Esconde ou mostra a header
    setLastScrollY(currentScrollY); // Atualiza posição do scroll
  };

  // Lista de categorias
  const categories = ['all', ...NEWS_CATEGORIES];

  // Redenrização visual da interface (HomeScreen) com o modo para tema claro/escuro
  return (
    <View style={[styles.container, {backgroundColor: isDarkMode ? '#000000' : '#f8f9fa'}]}>

      {/* Banner exibido quando está offline */}
      {!isConnected && (
      <View style={styles.offlineBanner}>
        <Text style={styles.offlineText}>No connection — viewing content offline</Text>
      </View>
      )}

      {/* Exibe a Navbar com animação */}
      <Navbar collapsed={!showHeader} />

      {/* Animação que mostra/esconde a área de busca, filtro e botão de favoritos */}
      {showHeader && (
        <Animated.View
          style={{
            transform: [{ translateY: searchTranslateY }],
            opacity: searchTranslateY.interpolate({ inputRange: [-70, 0], outputRange: [0, 1], extrapolate: 'clamp',}),
            height: searchTranslateY.interpolate({ inputRange: [-70, 0], outputRange: [0, 140], extrapolate: 'clamp',}),
            overflow: 'hidden',
          }}
        >
          <View style={{ height: 12 }} />

          {/* Barra de pesquisa */}
          <TextInput style={styles.searchBar} placeholder="Search News..." value={searchQuery} onChangeText={setSearchQuery} />

          {/* Filtro de categoria e botão de favoritos */}
          <View style={styles.pickerAndFavoritesWrapper}>
            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                value={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                items = {categories.map((category) => ({
                  key: category,
                  label: category.charAt(0).toUpperCase() + category.slice(1),
                  value: category,}))}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
              />
            </View>

            {/* Botão que direciona para tela de favoritos */}
            <TouchableOpacity style={styles.favoritesButton} onPress={() => navigation.navigate('Favorites')}>
              <Text style={styles.favoritesButtonText}>FAV</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      )}

      {/* Caso não haja notícias após o filtro */}
      {filteredNews.length === 0 ? (
        <Text style={styles.noResults}>No news found</Text>
      ) : (
        // FlatList que renderiza as notícias na tela
        <FlatList
          data={filteredNews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Detail', {
                  title: item.title,
                  imageUrl: item.urlToImage,
                  source: item.source.name,
                  date: item.publishedAt,
                  content: item.content,
                  url: item.url,
                  category: item.category,
                })
              }
            >
              {/* Exibe visualmente a notícia */}
              <NewsItem
                title={item.title}
                imageUrl={item.urlToImage}
                source={item.source.name}
                date={item.publishedAt}
                category={item.category}
              />
            </TouchableOpacity>

          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

    </View>
  );
};

export default HomeScreen;

// Define toda a estilização da página
const styles = StyleSheet.create({
  // Estilo principal do container da tela
  container: {
    flex: 1, // Ocupa todo o espaço disponível
  },
  // Estilo da barra de busca
  searchBar: {
    alignSelf: 'center', // Centraliza horizontalmente
    width: '90%', // Define uma largura relativa
    backgroundColor: '#d3d3d3', // Cor de fundo cinza claro
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 12, // Espaçamento interno horizontal
    paddingVertical: 10, // Espaçamento interno vertical
    fontSize: 16, // Tamanho da fonte
    elevation: 3, // Sombra (efeito de elevação no Android)
    marginBottom: 10, // Espaço abaixo da barra
    height: 45, // Altura fixa
  },
  // Wrapper que contém o filtro de categorias e o botão de favoritos
  pickerAndFavoritesWrapper: {
    width: '90%', // Define uma largura relativa
    flexDirection: 'row', // Itens lado a lado
    alignItems: 'center', // Alinha verticalmente ao centro
    justifyContent: 'space-between', // Espaço entre os itens
    marginBottom: 16, // Espaço abaixo do container
    alignSelf: 'center', // Centraliza horizontalmente
    gap: 8, // Espaço entre os elementos
  },
  // Wrapper individual do filtro de categorias
  pickerWrapper: {
    flex: 1, // Ocupa o máximo de espaço possível
    marginRight: 10, // Espaço à direita do picker
    justifyContent: 'center', // Centraliza verticalmente
  },
  // Estilo do botão de favoritos
  favoritesButton: {
    paddingVertical: 12, // Espaçamento interno vertical
    paddingHorizontal: 14, // Espaçamento interno horizontal
    backgroundColor: '#1e90ff', // Cor de fundo azul
    borderRadius: 8, // Bordas arredondadas
    height: 45, // Altura fixa
  },
  // Estilo do texto dentro do botão de favoritos
  favoritesButtonText: {
    color: '#ffffff', // Cor do texto branca
    fontWeight: 'bold', // Texto em negrito
    fontSize: 14, // Tamanho da fonte
  },
  // Texto exibido quando não há resultados
  noResults: {
    textAlign: 'center', // Centraliza o texto
    marginTop: 20, // Espaço acima
    color: '#000000', // Cor do texto preta
    fontSize: 20, // Tamanho do texto
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

// Define toda a estilização do Picker(Dropdown) do filtro
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 45, // Altura fixa
    backgroundColor: '#1e90ff', // Cor de fundo azul
    color: '#ffffff', // Cor do texto branca
    paddingHorizontal: 12, // Espaçamento interno horizontal
    borderRadius: 8, // Bordas arredondadas
    justifyContent: 'center', // Centraliza verticalmente
  },
  inputAndroid: {
    height: 45, // Altura fixa
    backgroundColor: '#1e90ff', // Cor de fundo azul
    color: '#ffffff', // Cor do texto branca
    paddingHorizontal: 12, // Espaçamento interno horizontal
    borderRadius: 8, // Bordas arredondadas
    justifyContent: 'center', // Centraliza verticalmente
  },
});