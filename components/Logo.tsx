import { Image, StyleSheet, View } from 'react-native';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'white';
};

export function Logo({ size = 'medium', variant = 'primary' }: LogoProps) {
  const containerSize = {
    small: 80,
    medium: 100,
    large: 120,
  }[size];

  const logoSize = {
    small: 40,
    medium: 50,
    large: 70,
  }[size];

  const backgroundColor = variant === 'primary' ? '#007AFF' : '#fff';
  const logoColor = variant === 'primary' ? '#fff' : '#007AFF';

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      <View style={[styles.background, { backgroundColor }]}>
        <Image
          source={require('@assets/images/logo.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
          tintColor={logoColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  background: {
    width: '80%',
    height: '80%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    tintColor: '#fff',
  },
}); 