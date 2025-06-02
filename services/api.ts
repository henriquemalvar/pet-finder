import { mockPets, mockUsers } from '@lib/mock';

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  description: string;
  image: string;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
}

// Autenticação
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('E-mail ou senha inválidos');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userExists = mockUsers.some(u => u.email === email);
    if (userExists) {
      throw new Error('E-mail já cadastrado');
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
      token: `mock-token-${mockUsers.length + 1}`,
    };

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  resetPassword: async (email: string): Promise<void> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userExists = mockUsers.some(u => u.email === email);
    if (!userExists) {
      throw new Error('E-mail não encontrado');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.password === currentPassword);
    if (!user) {
      throw new Error('Senha atual inválida');
    }
  },
};

// Pets
export const petService = {
  list: async (): Promise<Pet[]> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockPets;
  },

  search: async (params: {
    query?: string;
    type?: string;
    age?: string;
    size?: string;
  }): Promise<Pet[]> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockPets.filter(pet => {
      if (params.query && !pet.name.toLowerCase().includes(params.query.toLowerCase())) {
        return false;
      }
      if (params.type && pet.type !== params.type) {
        return false;
      }
      if (params.age && pet.age !== params.age) {
        return false;
      }
      if (params.size && pet.size !== params.size) {
        return false;
      }
      return true;
    });
  },

  getById: async (id: string): Promise<Pet> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pet = mockPets.find(p => p.id === id);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }
    return pet;
  },

  create: async (data: Omit<Pet, 'id' | 'owner'>): Promise<Pet> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPet = {
      id: String(mockPets.length + 1),
      ...data,
      owner: {
        name: 'Usuário Logado',
        phone: '(11) 99999-9999',
        email: 'usuario@email.com',
      },
    };

    return newPet;
  },

  update: async (id: string, data: Partial<Pet>): Promise<Pet> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pet = mockPets.find(p => p.id === id);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }

    return { ...pet, ...data };
  },

  delete: async (id: string): Promise<void> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pet = mockPets.find(p => p.id === id);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }
  },
};

// Mensagens
export const messageService = {
  send: async (petId: string, data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<void> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pet = mockPets.find(p => p.id === petId);
    if (!pet) {
      throw new Error('Pet não encontrado');
    }
  },
}; 