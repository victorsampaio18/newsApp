import axios from 'axios';

const API_KEY = 'SUA_CHAVE_AQUI';

export default axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});