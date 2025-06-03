import { UserWithToken } from '@/types/auth';
import { Pet, User } from '@/types/database';
import api from '@lib/axios';

interface Contact {
  id: string;
  petId: string;
  userId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Funções para usuários
export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserWithToken> => {
  const response = await api.post<UserWithToken>('/users', user);
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

// Funções para pets
export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> => {
  const response = await api.post<Pet>('/pets', pet);
  return response.data;
};

export const getPets = async (): Promise<Pet[]> => {
  const response = await api.get<Pet[]>('/pets');
  return response.data;
};

export const getPet = async (id: string): Promise<Pet> => {
  const response = await api.get<Pet>(`/pets/${id}`);
  return response.data;
};

// Funções para contatos
export const createContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
  const response = await api.post<Contact>('/contacts', contact);
  return response.data;
};

export const getContacts = async (petId: string): Promise<Contact[]> => {
  const response = await api.get<Contact[]>(`/pets/${petId}/contacts`);
  return response.data;
}; 