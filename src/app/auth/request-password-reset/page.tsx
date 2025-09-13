'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, Typography, Alert } from '@material-tailwind/react';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Email adresi gerekli');
      setMessageType('error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Geçerli bir email adresi girin');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/proxy/company/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (data.isSuccess || response.ok) {
        setMessage('Şifre sıfırlama bağlantısı email adresinize gönderildi. Lütfen email kutunuzu kontrol edin.');
        setMessageType('success');
        setIsSubmitted(true);
      } else {
        setMessage(data.message || 'Şifre sıfırlama isteği gönderilemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      setMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="h-7 w-7 text-white" />
            </div>
            <Typography
              variant="h4"
              className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent font-bold"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              MutluGünüm
            </Typography>
          </div>
          <Typography 
            variant="h5" 
            color="blue-gray" 
            className="font-semibold mb-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Şifremi Unuttum
          </Typography>
          <Typography 
            color="gray" 
            className="text-sm"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Email adresinize şifre sıfırlama bağlantısı göndereceğiz
          </Typography>
        </div>

        <Card 
          className="shadow-2xl border border-white/20 bg-white/80 backdrop-blur-sm"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CardBody 
            className="p-8"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {message && (
              <Alert 
                color={messageType === 'success' ? 'green' : 'red'} 
                className="mb-6"
              >
                {message}
              </Alert>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    label="Email Adresi"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-pink-500"
                  size="lg"
                  disabled={loading || !email}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Typography 
                  variant="h6" 
                  color="green" 
                  className="font-semibold"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Email Gönderildi!
                </Typography>
                <Typography 
                  color="gray" 
                  className="text-sm"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi. 
                  Lütfen email kutunuzu kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
                </Typography>
              </div>
            )}

            <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="text"
                size="sm"
                className="flex items-center gap-2 text-blue-500"
                onClick={() => router.push('/admin/login')}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Giriş sayfasına dön
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}