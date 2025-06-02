// Função responsável por fazer as requisições necessarias para receber as notícias
// Importação de bibliotecas e hooks necessários
import React, { createContext, useState, useEffect, ReactNode } from 'react'; // Importa o React e alguns hooks importantes
import axios from 'axios'; // Importa a biblioteca Axios, usada para fazer requisições HTTP a APIs externas
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa o módulo AsyncStorage, que permite salvar e recuperar dados localmente no dispositivo
import NetInfo from '@react-native-community/netinfo'; // Importa o módulo NetInfo usado para verificar o status da conexão de rede (online/offline) do dispositivo em tempo real

// Interface para representar uma notícia (article)
interface Article {
  title: string;
  urlToImage: string;
  source: { name: string };
  publishedAt: string;
  category: string;
  content: string;
  url: string;
}

// Tipagem do Context para utilizar com TypeScript
interface NewsContextType {
  news: Article[]; // Lista de notícias carregadas
  favoriteNews: Article[]; // Lista de notícias favoritadas
  favoriteFunction: (article: Article) => void; // Função para adicionar/remover dos favoritos
  isFavorited: (url: string) => boolean; // Função para verificar se uma notícia está favoritada
  preloadData: () => Promise<void>; // Função para carregar os dados (online ou cache)
}

// Criação do Context com valores padrão
export const NewsContext = createContext<NewsContextType>({
  news: [],
  favoriteNews: [],
  favoriteFunction: () => {},
  isFavorited: () => false,
  preloadData: async () => {},
});

// Lista de categorias usadas para buscar notícias
export const NEWS_CATEGORIES = ['technology', 'health', 'sports', 'entertainment'];
// Se desejar alterar as categorias, as disponiveis são as seguintes: technology, health, sports,
// entertainment, science, general e business.

// Props esperadas pelo NewsProvider
interface Props {
  children: ReactNode;
}

// Componente que fornece os dados e funções via Context
export const NewsProvider: React.FC<Props> = ({ children }) => {
  const [news, setNews] = useState<Article[]>([]); // Estado com as notícias
  const [favoriteNews, setFavoriteNews] = useState<Article[]>([]); // Estado com os favoritos

  // Função que busca notícias da API ou do cache
  const preloadData = async () => {
    const apiKey = 'SUA_CHAVE_AQUI';

    try {
      const state = await NetInfo.fetch();

      // Se estiver online, faz as requisições para cada categoria
      if (state.isConnected) {
        const requests = NEWS_CATEGORIES.map(async (category) => {
          const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`
          );
          return response.data.articles.map((article: Article) => ({
            ...article,
            category,
          }));
        });

        // Aguarda todas as requisições terminarem
        const results = await Promise.all(requests);

        // Junta os resultados de todas as categorias em um único array
        const combinedArticles = results.flat();

        // Ordenar as notícias por data mais recente
        combinedArticles.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        // Atualiza o estado
        setNews(combinedArticles);

        // Salva cache
        await AsyncStorage.setItem('@cachedNews', JSON.stringify(combinedArticles));
      } else {
        // Se estiver offline, tenta carregar do cache
        const cached = await AsyncStorage.getItem('@cachedNews');
        if (cached) {
          setNews(JSON.parse(cached));
        } else {
          console.warn('Sem conexão e sem cache disponível.');
        }
      }
      // Se ocorrer erro na requisição, tenta usar cache
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        const cached = await AsyncStorage.getItem('@cachedNews');
        if (cached) {
          setNews(JSON.parse(cached));
        }
    }
  };

  // Carrega os favoritos salvos localmente
  const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@favorites');
        if (jsonValue) {
          setFavoriteNews(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Erro ao carregar favoritos', e);
      }
  };

  // Chama preloadData e loadFavorites quando o componente for montado
  useEffect(() => {
    preloadData();
    loadFavorites();
  }, []);

  // Adiciona ou remove uma notícia dos favoritos
  const favoriteFunction = async (article: Article) => {
    const isAlreadyFavorite = favoriteNews.some((fav) => fav.url === article.url);
    const updatedFavorites = isAlreadyFavorite
      ? favoriteNews.filter((fav) => fav.url !== article.url)
      : [...favoriteNews, article];

    setFavoriteNews(updatedFavorites); // Atualiza o estado
    await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavorites)); // Salva no armazenamento
  };

  // Verifica se uma notícia está nos favoritos
  const isFavorited = (url: string) => {
    return favoriteNews.some((fav) => fav.url === url);
  };

  // Provedor do Context que disponibiliza os valores e funções aos componentes filhos
  return (
    <NewsContext.Provider value={{ news, favoriteNews, favoriteFunction, isFavorited, preloadData }}>
      {children}
    </NewsContext.Provider>
  );
};