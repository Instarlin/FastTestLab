import axios from 'axios';
import type { CardI } from '~/components/CardDialog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export interface CreateCardResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  picture_url: string;
}

export interface GetCardResponse {
  title: string;
  description: string;
  picture_url: string;
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const homeApi = {
  createCard: async (card: CardI): Promise<CreateCardResponse> => {
    const form = new FormData();
    form.append('title', card.title);
    form.append('description', card.description);
    if (card.picture) {
      // form.append('picture', card.picture);
    }
    const { data } = await api.post<CreateCardResponse>('/crud/courses', form);
    return data;
  },
  getCards: async (): Promise<GetCardResponse[]> => {
    const { data } = await api.get<GetCardResponse[]>('/crud/courses', {
      params: {
        skip: 0,
        limit: 10
      }
    });
    return data;
  }
};