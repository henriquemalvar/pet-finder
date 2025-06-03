import { Header } from '@/components/ui/Header';
import { Container } from '@/components/ui/Container';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Terms() {
  return (
    <Container edges={['top']}>
      <Header title="Termos de Uso" showBackButton />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>1. Aceitação dos Termos</Text>
          <Text style={styles.text}>
            Ao acessar e usar o pet-finder, você concorda em cumprir estes termos de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>2. Uso do Serviço</Text>
          <Text style={styles.text}>
            O pet-finder é uma plataforma para conectar pessoas que desejam adotar ou doar animais de estimação. Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>3. Conta do Usuário</Text>
          <Text style={styles.text}>
            Para usar certos recursos do aplicativo, você precisará criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha, e por todas as atividades que ocorrerem em sua conta.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>4. Conteúdo do Usuário</Text>
          <Text style={styles.text}>
            Você mantém todos os direitos sobre o conteúdo que publicar no pet-finder. Ao publicar conteúdo, você concede ao pet-finder uma licença não exclusiva para usar, modificar e distribuir esse conteúdo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>5. Privacidade</Text>
          <Text style={styles.text}>
            Sua privacidade é importante para nós. Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>6. Limitações de Responsabilidade</Text>
          <Text style={styles.text}>
            O pet-finder não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequentes que possam resultar do uso ou da impossibilidade de usar o serviço.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>7. Modificações dos Termos</Text>
          <Text style={styles.text}>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após sua publicação no aplicativo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>8. Contato</Text>
          <Text style={styles.text}>
            Se você tiver alguma dúvida sobre estes termos, entre em contato conosco através do e-mail: suporte@pet-finder.com
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 