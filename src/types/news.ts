// Define uma interface chamada "Article" que representa a estrutura de um artigo de notícia
export interface Article {
  title: string; // Título da notícia
  urlToImage: string | null; // URL da imagem relacionada à notícia (pode ser nulo se não houver imagem)
  source: { name: string }; // Objeto que representa a fonte da notícia
  publishedAt: string; // Data e hora da publicação da notícia (em formato ISO, por exemplo)
}