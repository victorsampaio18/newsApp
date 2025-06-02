// Função que exibe a notícia
// Importação de bibliotecas e hooks necessários
import React from 'react'; // Importa o React e alguns hooks importantes
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native'; // Importa componentes do React Native usados para construir a interface

// Define os tipos das props que o componente NewsItem espera
type Props = {
  title: string;
  imageUrl?: string;
  source: string;
  date: string;
  category: string;
  content?: string;
  url?: string;
};

// Função principal da NewsItem
const NewsItem: React.FC<Props> = ({category, imageUrl, title, source, date,}) => {
  // Faz a detecção do modo escuro ou claro
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const textColor = isDarkMode ? '#ffffff' : '#000000';

  // Formata a data para o formato 'dd MMM yyyy'
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Redenrização visual do componente (NewsItem) com o modo para tema claro/escuro
  return (
    <View style={[styles.card, {backgroundColor: isDarkMode ? '#1c1c1c' : '#f8f9fa', shadowColor: isDarkMode ? '#ffffff' : '#000000'}]}>

      {/* Categoria da notícia */}
      <Text style={[styles.category, {color: textColor}]}>{category.toUpperCase()}</Text>

      {/* Exibe imagem da notícia ou um placeholder se não houver */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>Sem imagem</Text>
        </View>
      )}

      {/* Título da notícia */}
      <Text style={[styles.title, {color: textColor}]}>{title}</Text>

      {/* Fonte da notícia e data */}
      <Text style={[styles.sourceDate, {color: isDarkMode ? '#ffffff' : '##555555'}]}>
        {source} - {formattedDate}
      </Text>
      
    </View>
  );
};

export default NewsItem;

// Define toda a estilização do componente
const styles = StyleSheet.create({
  card: {
    width: '90%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center',
  },
  category: {
    width: '90%',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    alignSelf: 'center',
  },
  image: {
    width: '90%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  imagePlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#666',
    fontSize: 14,
  },
  title: {
    width: '90%',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    alignSelf: 'center',
    textAlign: 'justify',
  },
  sourceDate: {
    width: '90%',
    alignSelf: 'center',
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
});