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
  console.log('[POST] /users');
  const response = await api.post<UserWithToken>('/users', user);
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  console.log('[GET] /users/' + id);
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

// Funções para pets
export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> => {
  console.log('[POST] /pets');
  const response = await api.post<Pet>('/pets', pet);
  return response.data;
};

export const getPets = async (): Promise<Pet[]> => {
  console.log('[GET] /pets');
  const response = await api.get<Pet[]>('/pets');
  return response.data;
};

export const getPet = async (id: string): Promise<Pet> => {
  console.log('[GET] /pets/' + id);
  const response = await api.get<Pet>(`/pets/${id}`);
  return response.data;
};

// Funções para contatos
export const createContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
  console.log('[POST] /contacts');
  const response = await api.post<Contact>('/contacts', contact);
  return response.data;
};

export const getContacts = async (petId: string): Promise<Contact[]> => {
  console.log('[GET] /pets/' + petId + '/contacts');
  const response = await api.get<Contact[]>(`/pets/${petId}/contacts`);
  return response.data;
}; 