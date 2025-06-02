import { StyleSheet, View } from 'react-native';

export function PetEditSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.image} />
      </View>
      <View style={styles.form}>
        {/* Nome */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Tipo */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Raça */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Idade */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Gênero */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Tamanho */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={[styles.input, styles.textArea]} />
        </View>

        {/* Localização */}
        <View style={styles.inputContainer}>
          <View style={styles.label} />
          <View style={styles.input} />
        </View>

        {/* Checkboxes */}
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} />
          <View style={styles.checkbox} />
        </View>

        {/* Botão de Submit */}
        <View style={styles.submitButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E1E9EE',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    width: '40%',
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
  },
  textArea: {
    height: 100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  submitButton: {
    height: 56,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    marginTop: 16,
  },
}); 