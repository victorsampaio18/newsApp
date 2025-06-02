<h1 align="center">NewsApp</h1>

![Badge Finalizado](http://img.shields.io/static/v1?label=STATUS&message=FINALIZADO&color=GREEN&style=for-the-badge)

O NewsApp é um aplicativo mobile desenvolvido com **React Native CLI**, projetado para fornecer ao usuário uma experiência prática e intuitiva na leitura de notícias em tempo real. Utilizando a **NewsAPI** como fonte de dados, o aplicativo permite a exibição de manchetes atualizadas, detalhamento completo de cada notícia, busca por título, filtragem por categorias, gerenciamento de favoritos e suporte ao modo off-line, tudo isso em uma interface limpa e responsiva.

# Funcionalidades
- Tela de **Splash** com animação de carregamento
- Tela de **Home** com scroll infinito apresentando as notícias
- **Navbar** presente na tela Home com animação ao rolar a lista
- Notícias exibidas em **cards** com categoria, imagem, título, fonte e data
- **Busca** de notícias por título
- Filtro por **categorias**
- Tela de **detalhes** com informações completas da notícia
- **Favoritar notícias** (armazenamento com `AsyncStorage`)
- Visualização de **notícias favoritadas** em tela separada
- Suporte a **modo offline** (com alerta usando `NetInfo`)
- Design responsivo
- Função de **compartilhamento** nativa

# Tecnologias Utilizadas
- **React Native CLI**
- **React Navigation**
- **TypeScript**
- **Axios**
- **NewsAPI**
- **AsyncStorage**
- **NetInfo**
- **react-native-vector-icons**
- **react-native-picker-select**
- **react-native-gesture-handler**
- **@react-navigation/native / stack / native-stack**
- **react-native-screens**
- **react-native-safe-area-context**

# Requisitos Necessários
- Node.js versão 16.x ou mais recente
- React Native CLI
- Instale Android Studio ou Xcode (emulador ou dispositivo físico)
- Criar uma conta na [NewsAPI.org](https://newsapi.org)

# Observação para Emulador
Se o emulador Android não funcionar, verifique se a virtualização está ativada na BIOS:
- Intel: **Intel VT-x**
- AMD: **AMD-V**

# Configurando API
Este app consome a **NewsAPI**, para configurá-la:

- **Passo 1:** Acesse [newsapi.org](https://newsapi.org) e crie uma conta gratuita
- **Passo 2:** Copie sua **API Key**
- **Passo 3:** Vá até o arquivo `NewsContext.tsx` e `NewsAPI.tsx` e insira sua chave na constante:
```ts
const apiKey = 'SUA_CHAVE_AQUI';
```

# Estrutura do Projeto (src)
- assets/ (imagens)
- components/ (Componentes reutilizáveis: Navbar, NewsItem)
- contexts/ (Contextos: NewsContext, NetworkContext)
- screens/ (Telas: Home, Splash, Favorites, Detail)
- types/ (Tipagens: navigation, Article)
- AppNavigator.tsx (Navegação principal)

# Instalação
- **Passo 1:** Clone o repositório
git clone https://github.com/victorsampaio18/newsApp.git

- **Passo 2:** Instale as dependências na pasta principal
npm install

- Passo 2.1: Se estiver usando Mac, instale o pods no iOS
npx pod-install

- **Passo 3:** Execute o app
**Android:** npx react-native run-android
**iOS:** npx react-native run-ios

# Autor
Desenvolvido por **Victor Sampaio de Almeida**

# Licença
Este projeto está licenciado sob a **MIT License**
