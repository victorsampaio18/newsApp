// Tela que mostra a notícia selecionada (DetailScreen)
// Realiza as importações das bibliotecas necessárias
import React, { useEffect, useState } from 'react'; // Importa o React e alguns hooks importantes
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity, Alert, Share, useColorScheme } from 'react-native'; // Importa componentes do React Native usados para construir a interface
import { RouteProp } from '@react-navigation/native'; // Importa o tipo RouteProp da biblioteca de navegação, utilizado para tipar rotas e acessar parâmetros da navegação com segurança em TypeScript
import { RootStackParamList } from '../types/navigation'; // Tipos das rotas definidas no projeto
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa o módulo AsyncStorage, que permite salvar e recuperar dados localmente no dispositivo

// Define a rota para esta tela do detalhe das notícias
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

// Função Principal da tela de detalhes
const DetailScreen: React.FC<Props> = ({ route }) => {

  // Recebe os dados da notícia via rota (route.params)
  const { title, imageUrl, source, date, content, url, category } = route.params;

  // Faz a detecção do modo escuro ou claro
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const textColor1 = isDarkMode ? '#ffffff' : '#777777';

  // Função de compartilhamento utilizando a API Share
  const shareFunction = async () => {
    try {
      await Share.share({
        message: `${title}\n\nRead more at: ${url}`,
      });
    } catch (error) {
      Alert.alert('Erro ao compartilhar');
    }
  };

  // Função para abrir o link da notícia no navegador padrão
  const openLink = () => {
    Linking.openURL(url);
  };

  // Função para controlar se a notícia está favoritada
  const [isFavorited, setFavorited] = useState(false);

  // Chama a função checkIfFavorited ao abrir a tela
  useEffect(() => {
    checkFavorited();
  }, []);

  // Função que verifica se a notícia está nos favoritos (AsyncStorage)
  const checkFavorited = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoritos');
      const favoritos = stored ? JSON.parse(stored) : [];
      const alreadyFavorited = favoritos.some((item: any) => item.url === url);
      setFavorited(alreadyFavorited);
    } catch (error) {
      Alert.alert('Erro ao verificar favoritos');
    }
  };

  // Função para adicionar ou remover a notícia dos favoritos
  const favoriteFunction = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoritos');
      const parsed = stored ? JSON.parse(stored) : [];

      let updatedFavorites;

      if (isFavorited) {
        // Remove a notícia dos favoritos
        updatedFavorites = parsed.filter((item: any) => item.url !== url);

      } else {
        // Adiciona a notícia aos favoritos
        const newItem = { title, imageUrl, source, date, content, url, category };
        updatedFavorites = [...parsed, newItem];
      }

      // O AsyncStorage é usado para armazenar as notícias salvas
      await AsyncStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
      setFavorited(!isFavorited);

    } catch (error) {
      Alert.alert('Não foi possível adicionar aos favoritos, tente novamente.');
    }
  };

  // Redenrização visual da tela (DetailScreen) com o modo para tema claro/escuro
  return (
    // Exibe todas as informações da notícia na tela (Título, data, texto, site da notícia e contéudo)
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#f8f9fa' }]}>

      {/* Exibe as informações da notícia */}
      <Text style={styles.category}>{category}</Text>
      <Text style={[styles.title, {color: textColor}]}>{title}</Text>
      <Text style={[styles.meta, {color: textColor1}]}>{source}</Text>
      <Text style={[styles.date, {color: textColor1}]}>
        {new Date(date).toLocaleString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>

      {/* Exibe a imagem da notícia */}
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : null}

      {/* Exibe o conteúdo da notícia */}
      <Text style={[styles.content, {color: textColor}]}>{content || 'No content available.'}</Text>
      
      {/* Botão que redireciona o usuário ao site que publicou a notícia */}
      <TouchableOpacity style={styles.readButton} onPress={openLink}>

        <Text style={styles.readButtonText}>Read the news on {source}</Text>

      </TouchableOpacity>

      {/* Exibe os botões com a função de compartilhar e favoritar a notícia */}
      <View style={styles.actionButtons}>

        {/* Botão que utiliza a função shareFunction para compartilhar a notícia */}
        <TouchableOpacity style={[styles.buttonHalf, { backgroundColor: '#007bff' }]} onPress={shareFunction}>
          
          <Text style={styles.favoritedText}>Share</Text>

        </TouchableOpacity>

        {/* Botão que utiliza a função toggleFavorite para adicionar ou remover a notícia dos favoritos */}
        <TouchableOpacity
            style={[ styles.buttonHalf, isFavorited ? styles.favorited : styles.notFavorited, ]}
            activeOpacity={0.7} onPress={favoriteFunction}
          >
          
            <Text style={isFavorited ? styles.favoritedText : styles.notFavoritedText}>
              {isFavorited ? 'Remove from Fav' : 'Add to Fav'}
            </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
};

export default DetailScreen;

// Define toda a estilização da página
const styles = StyleSheet.create({
  // Estilo principal do container da tela
  container: {
    flex: 1, // Ocupa todo o espaço disponível
    padding: 16,
  },
  // Categoria da notícia
  category: {
    fontSize: 16, // Tamanho da fonte
    color: '#1e90ff', // Cor do texto azul
    fontWeight: 'bold', // Texto em negrito
  },
  // Título da notícia
  title: {
    fontSize: 28, // Tamanho da fonte
    fontWeight: 'bold', // Texto em negrito
    marginBottom: 8, // Espaço abaixo do container
    textAlign: 'justify', // Justifica o texto
  },
  // Fonte da notícia (Quem publicou a notícia)
  meta: {
    fontSize: 16, // Tamanho da fonte
    color: '#555555', // Cor de fundo cinza claro
  },
  // Data e horário da publicação da notícia
  date: {
    fontSize: 16, // Tamanho da fonte
    marginBottom: 12, // Espaço abaixo do container
  },
  // Imagem da notícia
  image: {
    width: '90%', // Define uma largura relativa
    height: 200, // Altura fixa
    borderRadius: 12, // Bordas arredondadas
    marginBottom: 16, // Espaço abaixo do container
    alignSelf: 'center', // Centraliza horizontalmente
  },
  // Conteúdo da notícia
  content: {
    fontSize: 20, // Tamanho da fonte
    marginBottom: 20, // Espaço abaixo do container
    textAlign: 'justify', // Justifica o texto
  },
  // Botão para ler a notícia completa
  readButton: {
    backgroundColor: '#1e90ff', // Cor de fundo azul
    paddingVertical: 12, // Espaçamento interno vertical
    borderRadius: 10, // Bordas arredondadas
    marginBottom: 16, // Espaço abaixo do container
    alignItems: 'center', // Alinha verticalmente ao centro
  },
  // Texto que fica dentro do botão de ler a notícia completa
  readButtonText: {
    color: '#ffffff', // Cor do texto branca
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Texto em negrito
  },
  buttonContainer: {
    marginBottom: 20, // Espaço abaixo do container
    borderRadius: 10, // Bordas arredondadas
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row', // Itens lado a lado
    justifyContent: 'space-between', // Espaço entre os itens
    gap: 10, // Espaço entre os elementos
    marginTop: 4, // Espaço acima
  },
  buttonHalf: {
    flex: 1,
    borderRadius: 10, // Bordas arredondadas
    paddingVertical: 8, // Espaçamento interno vertical
    alignItems: 'center', // Alinha verticalmente ao centro
    justifyContent: 'center', // Centraliza verticalmente
    marginTop: 4, // Espaço acima
    overflow: 'hidden',
  },
  favorited: {
    backgroundColor: '#1e90ff', // Cor de fundo azul
  },
  notFavorited: {
    backgroundColor: '#eeeeee', // Cor de fundo cinza claro
  },
  favoritedText: {
    color: '#ffffff', // Cor do texto branca
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center', // Centraliza o texto
    fontSize: 16, // Tamanho da fonte
  },
  notFavoritedText: {
    color: '#1e90ff', // Cor do texto azul
    fontWeight: 'bold', // Texto em negrito
    textAlign: 'center', // Centraliza o texto
    fontSize: 16, // Tamanho da fonte
  },
});