# Vercel Environment Variables Setup

Vercel dashboard'da bu environment variables'ları ekle:

## Production Environment Variables:

```
API_BASE_URL=http://193.111.77.142/api
NEXT_PUBLIC_API_BASE_URL=/api/proxy
NEXT_PUBLIC_IMAGE_BASE_URL=/api/images
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here-change-this
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

## Vercel'de Environment Variables Ekleme:

1. Vercel dashboard'a git
2. Projeyi seç
3. Settings > Environment Variables
4. Yukarıdaki değişkenleri ekle
5. Production, Preview, Development için aynı değerleri kullan

## Önemli Notlar:

- `NEXTAUTH_SECRET`: Güvenli bir secret key oluştur
- `NEXT_PUBLIC_APP_URL`: Vercel'den aldığın domain ile değiştir
- `API_BASE_URL`: Backend sunucu adresi