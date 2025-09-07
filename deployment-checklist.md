# Deployment Checklist

## ✅ Deployment Öncesi Kontroller:

### 1. **Build Test**
```bash
npm run build
```
Hata olmadığından emin ol.

### 2. **Environment Variables**
- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] Production environment variables hazır
- [ ] API URL'leri doğru

### 3. **Dependencies**
```bash
npm install
```
Tüm dependencies yüklü olduğundan emin ol.

### 4. **TypeScript Errors**
```bash
npm run type-check
```
TypeScript hatası olmadığından emin ol.

### 5. **Lint Errors**
```bash
npm run lint
```
Lint hatalarını düzelt.

## 🚀 Vercel Deploy Adımları:

### Option 1: Vercel CLI
```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy et
vercel

# Production deploy
vercel --prod
```

### Option 2: GitHub Integration
1. https://vercel.com/dashboard
2. "New Project" tıkla
3. GitHub repo'yu seç
4. Environment variables ekle
5. Deploy et

## 📋 Post-Deployment:

1. **Domain Test**: Tüm sayfaların çalıştığını kontrol et
2. **API Test**: Contact form ve admin paneli test et
3. **Mobile Test**: Responsive tasarımı kontrol et
4. **Performance**: Lighthouse score kontrol et