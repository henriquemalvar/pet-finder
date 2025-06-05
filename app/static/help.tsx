import { Container } from '@/components/ui/Container';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FAQItem = {
  question: string;
  answer: string;
};

type ContactItem = {
  icon: 'mail-outline' | 'call-outline' | 'time-outline';
  text: string;
};

type SocialNetwork = {
  icon: 'logo-facebook' | 'logo-instagram' | 'logo-twitter';
};

const faqItems: FAQItem[] = [
  {
    question: 'Como criar uma conta?',
    answer: 'Para criar uma conta, toque no botão "Cadastre-se" na tela de login. Preencha seus dados pessoais e siga as instruções na tela.'
  },
  {
    question: 'Como adicionar um pet?',
    answer: 'Na aba "Meus Pets", toque no botão "+" no canto superior direito. Preencha as informações do seu pet e adicione fotos.'
  },
  {
    question: 'Como criar um post?',
    answer: 'Na aba "Meus Posts", toque no botão "+" no canto superior direito. Escolha o tipo de post, adicione fotos e descreva o conteúdo.'
  },
  {
    question: 'Como editar meu perfil?',
    answer: 'Na aba "Perfil", toque em "Editar Perfil". Você pode atualizar suas informações pessoais e foto de perfil.'
  }
];

const contactInfo: ContactItem[] = [
  { icon: 'mail-outline', text: 'suporte@pet-finder.com' },
  { icon: 'call-outline', text: '(11) 99999-9999' },
  { icon: 'time-outline', text: 'Segunda a Sexta, 9h às 18h' }
];

const socialNetworks: SocialNetwork[] = [
  { icon: 'logo-facebook' },
  { icon: 'logo-instagram' },
  { icon: 'logo-twitter' }
];

const FAQSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Perguntas Frequentes</Text>
    {faqItems.map((item, index) => (
      <View key={index} style={styles.faqItem}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>{item.answer}</Text>
      </View>
    ))}
  </View>
);

const ContactSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Contato</Text>
    <Text style={styles.text}>
      Se você não encontrou a resposta para sua dúvida, entre em contato conosco:
    </Text>
    {contactInfo.map((item, index) => (
      <View key={index} style={styles.contactItem}>
        <Ionicons name={item.icon} size={24} color="#666" />
        <Text style={styles.contactText}>{item.text}</Text>
      </View>
    ))}
  </View>
);

const SocialSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Redes Sociais</Text>
    <View style={styles.socialButtons}>
      {socialNetworks.map((network, index) => (
        <TouchableOpacity key={index} style={styles.socialButton}>
          <Ionicons name={network.icon} size={24} color="#fff" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function Help() {
  return (
    <Container>
      <ScrollView style={styles.content}>
        <FAQSection />
        <ContactSection />
        <SocialSection />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 