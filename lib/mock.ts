export const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456',
    token: 'mock-token-1',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: '123456',
    token: 'mock-token-2',
  },
];

export const mockPets = [
  {
    id: '1',
    name: 'Rex',
    type: 'Cachorro',
    breed: 'Labrador',
    age: '2 anos',
    gender: 'Macho',
    size: 'Grande',
    description: 'Cachorro muito dócil e brincalhão',
    image: 'https://picsum.photos/seed/rex1/400/400',
    owner: {
      name: 'João Silva',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
    },
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Gato',
    breed: 'Siamês',
    age: '1 ano',
    gender: 'Fêmea',
    size: 'Pequeno',
    description: 'Gata muito carinhosa e tranquila',
    image: 'https://picsum.photos/seed/luna1/400/400',
    owner: {
      name: 'Maria Santos',
      phone: '(11) 98888-8888',
      email: 'maria@email.com',
    },
  },
]; 