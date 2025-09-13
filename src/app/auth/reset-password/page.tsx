'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, Typography, Alert } from '@material-tailwind/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [companyId, setCompanyId] = useState('');
  const [token, setToken] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // URL parametrelerinden companyId ve token'ı al
    const cid = searchParams.get('cid');
    const resetToken = searchParams.get('token');

    if (!cid || !resetToken) {
      setMessage('Geçersiz şifre sıfırlama bağlantısı. Link eksik parametreler içeriyor.');
      setMessageType('error');
      return;
    }

    setCompanyId(cid);
    setToken(resetToken);
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Mesajı temizle
    if (message) {
      setMessage('');
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Şifre en az 6 karakter olmalıdır';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyId || !token) {
      setMessage('Geçersiz şifre sıfırlama bağlantısı');
      setMessageType('error');
      return;
    }

    // Form validasyonu
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType('error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Şifreler eşleşmiyor');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/proxy/company/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: companyId,
          token: token,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.isSuccess || response.ok) {
        setMessage('Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.');
        setMessageType('success');
        
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      } else {
        setMessage(data.message || 'Şifre sıfırlama işlemi başarısız oldu');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card 
          className="shadow-2xl"
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
            <div className="text-center mb-8">
              <Typography 
                variant="h3" 
                color="blue-gray" 
                className="mb-2"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Şifre Sıfırla
              </Typography>
              <Typography 
                color="gray" 
                className="text-sm"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Yeni şifrenizi belirleyin
              </Typography>
            </div>

            {message && (
              <Alert 
                color={messageType === 'success' ? 'green' : 'red'} 
                className="mb-6"
              >
                {message}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Yeni Şifre */}
              <div className="relative">
                <Input
                  label="Yeni Şifre *"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  required
                  disabled={loading || !companyId || !token}
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <Button
                  variant="text"
                  size="sm"
                  className="!absolute right-1 top-1 rounded"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  disabled={loading}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Şifre Tekrar */}
              <div className="relative">
                <Input
                  label="Yeni Şifre Tekrar *"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  disabled={loading || !companyId || !token}
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <Button
                  variant="text"
                  size="sm"
                  className="!absolute right-1 top-1 rounded"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                  disabled={loading}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500"
                size="lg"
                disabled={loading || !companyId || !token || !formData.newPassword || !formData.confirmPassword}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <Typography 
                color="gray" 
                className="text-sm"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Giriş yapmak için{" "}
                <Button
                  variant="text"
                  size="sm"
                  className="p-0 text-blue-500"
                  onClick={() => router.push('/admin/login')}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  buraya tıklayın
                </Button>
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}