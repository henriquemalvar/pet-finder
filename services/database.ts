import { Pet, User } from '@services/api';

interface Contact {
  id: string;
  petId: string;
  userId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Dados em memória
let users: User[] = [];
let pets: Pet[] = [];
let contacts: Contact[] = [];

// Funções para usuários
export const createUser = async (user: Omit<User, 'id' | 'token'>) => {
  const id = Math.random().toString(36).substring(7);
  const token = `mock-token-${id}`;
  const newUser = { ...user, id, token };
  users.push(newUser);
  return newUser;
};

export const getUser = async (id: string) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  return user;
};

// Funções para pets
export const createPet = async (pet: Omit<Pet, 'id' | 'owner'>) => {
  const id = Math.random().toString(36).substring(7);
  const newPet = {
    ...pet,
    id,
    owner: {
      name: 'Usuário Logado',
      phone: '(11) 99999-9999',
      email: 'usuario@email.com',
    },
  };
  pets.push(newPet);
  return newPet;
};

export const getPets = async () => {
  return pets;
};

export const getPet = async (id: string) => {
  const pet = pets.find(p => p.id === id);
  if (!pet) {
    throw new Error('Pet não encontrado');
  }
  return pet;
};

// Funções para contatos
export const createContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
  const id = Math.random().toString(36).substring(7);
  const now = new Date().toISOString();
  const newContact = { ...contact, id, createdAt: now, updatedAt: now };
  contacts.push(newContact);
  return newContact;
};

export const getContacts = async (petId: string) => {
  return contacts.filter(c => c.petId === petId);
}; 