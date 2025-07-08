const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración de optimización
const config = {
  quality: 80,
  progressive: true,
  mozjpeg: true,
  webp: {
    quality: 80,
    effort: 6
  }
};

// Función para optimizar una imagen
async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const image = sharp(inputPath);
    
    // Obtener metadata
    const metadata = await image.metadata();
    
    // Aplicar optimizaciones
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      image.jpeg({
        quality: options.quality || config.quality,
        progressive: config.progressive,
        mozjpeg: config.mozjpeg
      });
    } else if (metadata.format === 'png') {
      image.png({
        quality: options.quality || config.quality,
        progressive: config.progressive
      });
    }
    
    // Generar WebP
    const webpPath = outputPath.replace(/\.[^.]+$/, '.webp');
    await image.webp(config.webp).toFile(webpPath);
    
    // Generar imagen optimizada original
    await image.toFile(outputPath);
    
    console.log(`✅ Optimizada: ${path.basename(inputPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error optimizando ${inputPath}:`, error.message);
    return false;
  }
}

// Función para procesar todas las imágenes
async function optimizeAllImages() {
  const imagesDir = path.join(__dirname, 'images');
  const optimizedDir = path.join(__dirname, 'images-optimized');
  
  // Crear directorio optimizado si no existe
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Obtener todas las imágenes
  const imageExtensions = ['.jpg', '.jpeg', '.png'];
  const files = fs.readdirSync(imagesDir)
    .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)));
  
  console.log(`🔄 Procesando ${files.length} imágenes...`);
  
  let processed = 0;
  let errors = 0;
  
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const outputPath = path.join(optimizedDir, file);
    
    const success = await optimizeImage(inputPath, outputPath);
    if (success) {
      processed++;
    } else {
      errors++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`✅ Procesadas: ${processed}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📁 Imágenes optimizadas guardadas en: ${optimizedDir}`);
}

// Función para generar diferentes tamaños
async function generateResponsiveImages() {
  const sizes = [
    { width: 500, suffix: 'p-500' },
    { width: 800, suffix: 'p-800' },
    { width: 1080, suffix: 'p-1080' },
    { width: 1600, suffix: 'p-1600' },
    { width: 2000, suffix: 'p-2000' }
  ];
  
  const imagesDir = path.join(__dirname, 'images');
  const responsiveDir = path.join(__dirname, 'images-responsive');
  
  if (!fs.existsSync(responsiveDir)) {
    fs.mkdirSync(responsiveDir, { recursive: true });
  }
  
  const files = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  
  console.log(`🔄 Generando imágenes responsive...`);
  
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.parse(file).name;
    const ext = path.parse(file).ext;
    
    for (const size of sizes) {
      const outputName = `${baseName}-${size.suffix}${ext}`;
      const outputPath = path.join(responsiveDir, outputName);
      
      try {
        await sharp(inputPath)
          .resize(size.width, null, { withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toFile(outputPath);
        
        console.log(`✅ Generada: ${outputName}`);
      } catch (error) {
        console.error(`❌ Error generando ${outputName}:`, error.message);
      }
    }
  }
}

// Ejecutar optimización
if (require.main === module) {
  console.log('🚀 Iniciando optimización de imágenes...\n');
  
  // Verificar si sharp está instalado
  try {
    require('sharp');
  } catch (error) {
    console.error('❌ Sharp no está instalado. Instálalo con: npm install sharp');
    process.exit(1);
  }
  
  optimizeAllImages()
    .then(() => {
      console.log('\n🎉 Optimización completada!');
    })
    .catch(error => {
      console.error('❌ Error durante la optimización:', error);
    });
}

module.exports = { optimizeImage, optimizeAllImages, generateResponsiveImages }; 