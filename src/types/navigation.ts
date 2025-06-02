// Define um tipo que representa os parâmetros de navegação de cada rota da stack
export type RootStackParamList = {
  // Rota "Home" não recebe nenhum parâmetro
  Home: undefined;
  // Rota "Detail" exige um objeto com os seguintes parâmetros:
  Detail: {
    title: string; // Título da notícia
    imageUrl?: string; // URL da imagem (opcional)
    source: string; // Fonte da notícia
    date: string; // Data da publicação
    content?: string; // Conteúdo da notícia (opcional)
    url: string; // URL para a notícia original
    category: string; // Categoria da notícia
  };
  // Rota "Favorites" não recebe parâmetros
  Favorites: undefined;
  // Rota "Splash" também não recebe parâmetros
  Splash: undefined;
};