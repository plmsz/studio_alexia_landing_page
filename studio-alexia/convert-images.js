import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageMap = {
  '/src/assets/img/design.jpg': 'src/assets/img/design.jpg',
  '/src/assets/img/henna.jpg': 'src/assets/img/henna.jpg',
  '/src/assets/img/micro.jpg': 'src/assets/img/micro.jpg',
  '/src/assets/img/micropigmentacao.jpg': 'src/assets/img/micropigmentacao.jpg',
  '/src/assets/img/lash.jpg': 'src/assets/img/lash.jpg',
  '/src/assets/img/cilios-fio-o-fio.jpg': 'src/assets/img/cilios-fio-o-fio.jpg',
  '/src/assets/img/gel.jpg': 'src/assets/img/gel.jpg',
  '/src/assets/img/postica.jpg': 'src/assets/img/postica.jpg',
  '/src/assets/img/cera.jpg': 'src/assets/img/cera.jpg',
  '/src/assets/img/egipcia.jpg': 'src/assets/img/egipcia.jpg',
  '/src/assets/img/limpeza.jpg': 'src/assets/img/limpeza.jpg'
};

function convertImageToBase64(imagePath) {
  try {
    const fullPath = join(__dirname, imagePath);
    const imageBuffer = readFileSync(fullPath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error(`Erro ao converter ${imagePath}:`, error.message);
    return null;
  }
}

function main() {
  console.log('Convertendo imagens para base64...\n');

  const dbPath = join(__dirname, 'db.json');
  const db = JSON.parse(readFileSync(dbPath, 'utf-8'));

  let converted = 0;
  let errors = 0;

  db.services.forEach(service => {
    const imagePath = imageMap[service.image];
    if (imagePath) {
      console.log(`Convertendo: ${service.title}`);
      const base64 = convertImageToBase64(imagePath);
      
      if (base64) {
        service.image = base64;
        converted++;
        console.log(`✓ Convertido com sucesso\n`);
      } else {
        errors++;
        console.log(`✗ Erro na conversão\n`);
      }
    }
  });

  writeFileSync(dbPath, JSON.stringify(db, null, 2));

  console.log('='.repeat(50));
  console.log(`Conversão concluída!`);
  console.log(`Total convertido: ${converted}`);
  console.log(`Erros: ${errors}`);
  console.log('='.repeat(50));
}

main();
