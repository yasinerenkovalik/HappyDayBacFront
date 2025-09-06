# MutluGünüm - Organizasyon Yönetim Platformu

![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-13.4.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

Modern ve güvenli organizasyon yönetim platformu. Şirketler ve organizatörler için kapsamlı etkinlik yönetimi çözümü.

## 🚀 Özellikler

- **Güvenli Kimlik Doğrulama**: JWT tabanlı güvenli giriş sistemi
- **Çoklu Kullanıcı Desteği**: Admin ve şirket kullanıcı rolleri
- **Organizasyon Yönetimi**: Etkinlik oluşturma, düzenleme ve yönetimi
- **Görsel Galeri**: Çoklu resim yükleme ve yönetimi
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Production Ready**: Güvenlik ve performans optimizasyonları

## 🛡️ Güvenlik Özellikleri

- CSP (Content Security Policy) koruması
- XSS ve CSRF koruması
- Rate limiting
- Güvenli header'lar
- Input validation
- Error boundary'ler

## [Demo](https://creative-tim.com/product/nextjs-tailwind-campaign-page)

## Quick start

Quick start options:

- Download from [Creative Tim](https://www.creative-tim.com/product/nextjs-tailwind-campaign-page?ref=readme-ntpp).

## Terminal Commands

1. Download and Install NodeJs LTS version from [NodeJs Official Page](https://nodejs.org/en/download/).
2. Navigate to the root ./ directory of the product and run `npm install` to install our local dependencies.

## Documentation

The documentation for the Material Dashboard is hosted at our [website](https://www.material-tailwind.com/docs/react/installation?ref=readme-ntpp).

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/chrome.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/firefox.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/edge.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/safari.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64">

## Resources

- [Live Preview](https://demos.creative-tim.com/nextjs-tailwind-campaign-page?ref=readme-ntpp)
- [Download Page](https://www.creative-tim.com/product/nextjs-tailwind-campaign-page?ref=readme-ntpp)
- Documentation is [here](https://www.material-tailwind.com/docs/react/installation?ref=readme-ntpp)
- [License Agreement](https://www.creative-tim.com/license?ref=readme-ntpp)
- [Support](https://www.creative-tim.com/contact-us?ref=readme-ntpp)
- Issues: [Github Issues Page](https://github.com/creativetimofficial/nextjs-tailwind-campaign-page/issues)
- [Nepcha Analytics](https://nepcha.com?ref=readme) - Analytics tool for your website

## Reporting Issues

We use GitHub Issues as the official bug tracker for the Nextjs Tailwind Campaign Page. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of the Nextjs Tailwind Campaign Page. Check the CHANGELOG from your dashboard on our [website](https://www.creative-tim.com/product/nextjs-tailwind-campaign-page?ref=readme-ntpp).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.

## Technical Support or Questions

If you have questions or need help integrating the product please [contact us](https://www.creative-tim.com/contact-us?ref=readme-ntpp) instead of opening an issue.

## Licensing

- Copyright 2023 [Creative Tim](https://www.creative-tim.com?ref=readme-ntpp)
- Creative Tim [license](https://www.creative-tim.com/license?ref=readme-ntpp)

## Useful Links

- [More products](https://www.creative-tim.com/templates?ref=readme-ntpp) from Creative Tim

- [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w)

- [Freebies](https://www.creative-tim.com/bootstrap-themes/free?ref=readme-ntpp) from Creative Tim

- [Affiliate Program](https://www.creative-tim.com/affiliates/new?ref=readme-ntpp) (earn money)

##### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Google+: <https://plus.google.com/+CreativetimPage>

Instagram: <https://instagram.com/creativetimofficial>
# happydayfront2

## 📋 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Git

### Geliştirme Ortamı

1. **Repository'yi klonlayın**
```bash
git clone <repository-url>
cd nextjs-tailwind-campaign-page
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables'ları ayarlayın**
```bash
cp .env.example .env.local
# .env.local dosyasını düzenleyin
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

### Production Deployment

#### Docker ile Deployment

1. **Docker image'ını build edin**
```bash
docker build -t mutlugunum-app .
```

2. **Container'ı çalıştırın**
```bash
docker run -p 3000:3000 --env-file .env.production mutlugunum-app
```

#### Docker Compose ile

```bash
# Environment variables'ları ayarlayın
cp .env.example .env.production

# Servisleri başlatın
docker-compose up -d
```

#### Manuel Deployment

```bash
# Production build
npm run build:production

# Sunucuyu başlatın
npm start
```

## 🔧 Konfigürasyon

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL'i | `http://localhost:5268/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL'i | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | JWT secret key | - |

### Nginx Konfigürasyonu

Production ortamında Nginx reverse proxy kullanılması önerilir. `nginx.conf` dosyasını referans alın.

## 🧪 Testing

```bash
# Type check
npm run type-check

# Linting
npm run lint

# Security audit
npm audit
```

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel sayfaları
│   ├── api/               # API routes
│   └── organization-*/    # Public sayfalar
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── constants.ts      # App constants
│   ├── error-handler.ts  # Error handling
│   └── image-utils.ts    # Image utilities
└── middleware.ts          # Next.js middleware
```

## 🔒 Güvenlik

### Implemented Security Measures

- ✅ HTTPS enforcement
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Error boundary
- ✅ Secure authentication

### Security Checklist

- [ ] SSL sertifikası kurulumu
- [ ] Environment variables güvenliği
- [ ] Database güvenliği
- [ ] Backup stratejisi
- [ ] Monitoring ve logging
- [ ] Security audit

## 🚀 Performance

### Optimizations

- Image optimization
- Code splitting
- Static generation
- Caching strategies
- Bundle optimization

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Logs

Production ortamında log monitoring için:
- Application logs
- Error tracking (Sentry önerilir)
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Support

Sorunlar için:
- GitHub Issues
- Documentation
- Community support

---

**Production Ready Checklist:**

- ✅ Environment variables configured
- ✅ Security headers implemented
- ✅ Error handling added
- ✅ Docker configuration ready
- ✅ Nginx configuration provided
- ✅ Health check endpoint
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Production build optimization

**Next Steps:**
1. SSL sertifikası kurulumu
2. Domain konfigürasyonu  
3. Database backup stratejisi
4. Monitoring setup
5. CI/CD pipeline# HappyDayBacFront
