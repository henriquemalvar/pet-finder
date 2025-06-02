# Pet Finder 🐾

Um aplicativo móvel para ajudar pessoas a encontrarem seus pets perdidos ou encontrarem um novo lar para seus pets através da adoção.

## Funcionalidades

- 🔍 Busca de pets perdidos ou para adoção
- 📱 Cadastro e gerenciamento de pets
- 📝 Criação de posts para pets perdidos ou para adoção
- 👤 Perfil de usuário personalizado
- 📍 Localização dos pets
- 🔔 Notificações de novos posts

## Tecnologias

- [Expo](https://expo.dev) - Framework para desenvolvimento mobile
- [React Native](https://reactnative.dev) - Framework para desenvolvimento mobile
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript com tipagem estática
- [React Hook Form](https://react-hook-form.com) - Gerenciamento de formulários
- [Zod](https://zod.dev) - Validação de dados
- [Axios](https://axios-http.com) - Cliente HTTP

## Começando

1. Clone o repositório

   ```bash
   git clone https://github.com/seu-usuario/pet-finder.git
   cd pet-finder
   ```

2. Instale as dependências

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```
   EXPO_PUBLIC_API_URL=sua_url_api
   ```

4. Inicie o aplicativo

   ```bash
   npx expo start
   ```

## Estrutura do Projeto

```
pet-finder/
├── app/              # Telas da aplicação
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizáveis
├── contexts/        # Contextos React
├── hooks/           # Hooks personalizados
├── lib/             # Utilitários e configurações
├── services/        # Serviços de API
├── theme/           # Tema e estilos
└── types/           # Definições de tipos TypeScript
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
