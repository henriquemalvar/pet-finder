const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../assets/images/logo.png');
const outputDir = path.join(__dirname, '../assets/images');

// Garante que o diretório de saída existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gera o ícone do app (1024x1024)
sharp(sourceImage)
  .resize(1024, 1024)
  .toFile(path.join(outputDir, 'icon.png'))
  .then(() => console.log('Ícone gerado com sucesso'))
  .catch(err => console.error('Erro ao gerar ícone:', err));

// Gera o ícone adaptativo para Android (1024x1024)
sharp(sourceImage)
  .resize(1024, 1024)
  .toFile(path.join(outputDir, 'adaptive-icon.png'))
  .then(() => console.log('Ícone adaptativo gerado com sucesso'))
  .catch(err => console.error('Erro ao gerar ícone adaptativo:', err));

// Gera o favicon para web (48x48)
sharp(sourceImage)
  .resize(48, 48)
  .toFile(path.join(outputDir, 'favicon.png'))
  .then(() => console.log('Favicon gerado com sucesso'))
  .catch(err => console.error('Erro ao gerar favicon:', err));

// Gera a imagem de splash (1242x2436)
sharp(sourceImage)
  .resize(200, 200) // Tamanho do logo na splash screen
  .toFile(path.join(outputDir, 'splash.png'))
  .then(() => console.log('Imagem de splash gerada com sucesso'))
  .catch(err => console.error('Erro ao gerar imagem de splash:', err)); 