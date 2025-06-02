// Função para verificar se está conectado a rede (online ou offline)
// Realiza as importações das bibliotecas necessárias
import React, { createContext, useEffect, useState, ReactNode } from 'react'; // Importa o React e alguns hooks importantes
import NetInfo from '@react-native-community/netinfo'; // Importa o módulo NetInfo usado para verificar o status da conexão de rede (online/offline) do dispositivo em tempo real

// Define a interface para o contexto de rede
interface NetworkContextType {
  isConnected: boolean; // Isso garante que quem consumir o contexto saiba que receberá um booleano `isConnected`
}

// Cria o contexto de rede com um valor padrão: conectado (true)
export const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
});

// Componente que envolve a aplicação e provê a informação de conectividade
export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  // Estado que armazena se o dispositivo está conectado à internet
  const [isConnected, setIsConnected] = useState(true);

  // useEffect para escutar alterações no estado da conexão de rede
  useEffect(() => {
    // Adiciona um listener para detectar mudanças na conectividade
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Atualiza o estado com base na propriedade `isConnected` retornada pela API
      setIsConnected(!!state.isConnected); // garante que seja booleano
    });

    // Remove o listener ao desmontar o componente para evitar vazamento de memória
    return () => unsubscribe();
  }, []);

  return (
    // Fornece o valor atual da conexão para todos os componentes filhos
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
    
  );
};