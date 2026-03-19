import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// 이 스크립트를 실행하려면 'sharp' 라이브러리가 필요합니다.
// 터미널에서 'npm install sharp'를 실행해주세요.
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryDir = path.join(__dirname, '../public/gallery');
const thumbnailsDir = path.join(galleryDir, 'thumbnails');
const optimizedDir = path.join(galleryDir, 'optimized');

// 썸네일 디렉토리가 없으면 생성
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// 최적화 이미지 디렉토리가 없으면 생성
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// 갤러리 폴더의 이미지를 읽어서 썸네일 생성
fs.readdir(galleryDir, (err, files) => {
  if (err) {
    console.error('디렉토리를 읽을 수 없습니다:', err);
    return;
  }

  files.forEach((file) => {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const inputPath = path.join(galleryDir, file);
      const outputPath = path.join(thumbnailsDir, file);
      const optimizedPath = path.join(optimizedDir, file);

      // 1. 썸네일 생성 (400px)
      sharp(inputPath)
        .resize(400) // 너비 400px로 리사이징 (비율 유지)
        .toFile(outputPath)
        .then(() => console.log(`썸네일 생성 완료: ${file}`))
        .catch((err) => console.error(`오류 발생 (${file}):`, err));

      // 2. 웹용 최적화 이미지 생성 (1200px, 품질 80%)
      sharp(inputPath)
        .resize(1200, null, { withoutEnlargement: true }) // 너비 1200px 제한, 원본이 작으면 확대 안 함
        .jpeg({ quality: 80 }) // JPEG 압축 (품질 80%)
        .toFile(optimizedPath)
        .then(() => console.log(`최적화 이미지 생성 완료: ${file}`))
        .catch((err) => console.error(`오류 발생 (${file}):`, err));
    }
  });
});