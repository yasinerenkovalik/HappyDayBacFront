// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Input,
  Select,
  Option,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { sendInvitation, getAllInvitations } from "@/lib/api";

interface Invitation {
  id: string;
  email: string;
  companyNameHint: string;
  status: "pending" | "accepted" | "expired";
  token?: string;
  invitationLink?: string;
  createdAt: string;
  expiresAt: string;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    companyNameHint: "",
    expiresAt: "",
  });
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [invitationLink, setInvitationLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await getAllInvitations();
      if (data.isSuccess) {
        setInvitations(data.data || []);
      } else {
        console.error('Failed to load invitations:', data.message);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!newInvitation.email || !newInvitation.companyNameHint) {
      setError("E-posta ve şirket adı zorunludur");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      // Debug: localStorage'daki token'ı kontrol et
      const token = localStorage.getItem('token');
      console.log('🔍 Token debug:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token?.substring(0, 20) + '...' || 'No token'
      });

      // Eğer expiresAt belirtilmemişse, 7 gün sonrası için UTC tarih oluştur
      let expiresAt;
      if (newInvitation.expiresAt) {
        // Kullanıcı tarafından girilen tarihi UTC'ye çevir
        const userDate = new Date(newInvitation.expiresAt);
        expiresAt = userDate.toISOString();
      } else {
        // 7 gün sonrası için UTC tarih oluştur
        const futureDate = new Date();
        futureDate.setUTCDate(futureDate.getUTCDate() + 7);
        expiresAt = futureDate.toISOString();
      }

      const requestData = {
        email: newInvitation.email,
        companyNameHint: newInvitation.companyNameHint,
        expiresAt: expiresAt, // UTC formatında tarih
      };

      console.log('📤 Sending invitation request:', {
        ...requestData,
        expiresAtOriginal: newInvitation.expiresAt,
        expiresAtUTC: expiresAt,
        isUTC: expiresAt.endsWith('Z')
      });

      const response = await sendInvitation(requestData);

      console.log('📡 Full API Response:', response);
      console.log('📡 Response type:', typeof response);
      console.log('📡 Response keys:', Object.keys(response));

      // Farklı başarı formatı kontrolleri
      const isSuccess = response.isSuccess === true || 
                       response.success === true || 
                       response.data || 
                       (!response.error && !response.message?.includes('hata'));

      console.log('✅ Success analysis:', {
        'response.isSuccess': response.isSuccess,
        'response.success': response.success,
        'has data': !!response.data,
        'no error': !response.error,
        'final isSuccess': isSuccess
      });

      if (isSuccess) {
        const tokenValue = response.token || response.data?.token || "Token alınamadı";
        const linkValue = response.invitationLink || response.data?.invitationLink || 
                         `${window.location.origin}/create-company/${tokenValue}`;
        
        setGeneratedToken(tokenValue);
        setInvitationLink(linkValue);
        setShowTokenDialog(true);
        setSuccess("Davetiye başarıyla gönderildi!");
        setNewInvitation({ email: "", companyNameHint: "", expiresAt: "" });
        // Davetiye listesini yenile
        loadInvitations();
      } else {
        console.error('❌ API Error Response:', response);
        const errorMsg = response.message || response.error || 
                        "Davetiye gönderilirken hata oluştu";
        setError(errorMsg);
      }
    } catch (error) {
      console.error('💥 Catch Error:', error);
      setError("Davetiye gönderilirken hata oluştu: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess("Panoya kopyalandı!");
      setTimeout(() => setSuccess(""), 2000);
    }).catch(() => {
      setError("Kopyalama başarısız");
    });
  };

  const debugLocalStorage = () => {
    console.log('🔍 localStorage Debug:');
    console.log('All keys:', Object.keys(localStorage));
    console.log('Token:', localStorage.getItem('token'));
    console.log('User info:', localStorage.getItem('user'));
    console.log('All localStorage:', { ...localStorage });
    
    setSuccess('localStorage bilgileri console\'da yazdırıldı');
    setTimeout(() => setSuccess(''), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "amber";
      case "accepted":
        return "green";
      case "expired":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredUserType="admin">
        <AdminLayout userType="admin">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredUserType="admin">
      <AdminLayout userType="admin">
        <div className="p-6">
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-6 flex items-center justify-between"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Davetiyeler
            <Button
              size="sm"
              variant="text"
              color="blue"
              onClick={debugLocalStorage}
              className="ml-4"
            >
              🔍 Debug
            </Button>
          </Typography>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Typography color="red" className="text-sm font-medium">
                ❌ Hata: {error}
              </Typography>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Typography color="green" className="text-sm font-medium">
                ✅ {success}
              </Typography>
            </div>
          )}

          {/* Send New Invitation */}
          <Card className="mb-6">
            <CardBody>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Yeni Davetiye Gönder
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="E-posta"
                  value={newInvitation.email}
                  onChange={(e) =>
                    setNewInvitation({ ...newInvitation, email: e.target.value })
                  }
                  crossOrigin={undefined}
                />
                <Input
                  label="Şirket Adı İpuçu"
                  value={newInvitation.companyNameHint}
                  onChange={(e) =>
                    setNewInvitation({ ...newInvitation, companyNameHint: e.target.value })
                  }
                  crossOrigin={undefined}
                />
                <Input
                  label="Son Kullanma Tarihi (isteğe bağlı)"
                  type="datetime-local"
                  value={newInvitation.expiresAt}
                  onChange={(e) =>
                    setNewInvitation({ ...newInvitation, expiresAt: e.target.value })
                  }
                  crossOrigin={undefined}
                  className="text-sm"
                  containerProps={{
                    className: "min-w-0"
                  }}
                />
                <Button
                  onClick={handleSendInvitation}
                  disabled={!newInvitation.email || !newInvitation.companyNameHint || sending}
                  className="bg-pink-500"
                  loading={sending}
                >
                  {sending ? "Gönderiliyor..." : "Davetiye Gönder"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Invitations List */}
          <Card>
            <CardBody>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Gönderilen Davetiyeler
              </Typography>

              {invitations.length === 0 ? (
                <Typography
                  color="gray"
                  className="text-center py-8"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Henüz davetiye gönderilmemiş.
                </Typography>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            E-posta
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            Şirket Adı
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            Durum
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            Gönderilme Tarihi
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            Son Kullanma
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            İşlemler
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((invitation) => (
                        <tr key={invitation.id}>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {invitation.email}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {invitation.companyNameHint}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={invitation.status}
                              color={getStatusColor(invitation.status)}
                            />
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {new Date(invitation.createdAt).toLocaleDateString('tr-TR')}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              placeholder={undefined}
                              onPointerEnterCapture={undefined}
                              onPointerLeaveCapture={undefined}
                            >
                              {new Date(invitation.expiresAt).toLocaleDateString('tr-TR')}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <div className="flex gap-2">
                              {invitation.token && (
                                <Button
                                  size="sm"
                                  variant="text"
                                  color="blue"
                                  onClick={() => copyToClipboard(invitation.token!)}
                                >
                                  Token Kopyala
                                </Button>
                              )}
                              {invitation.invitationLink && (
                                <Button
                                  size="sm"
                                  variant="text"
                                  color="green"
                                  onClick={() => copyToClipboard(invitation.invitationLink!)}
                                >
                                  Link Kopyala
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="text"
                                color="red"
                                onClick={() => console.log("Cancel invitation")}
                              >
                                İptal Et
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Token Dialog */}
          <Dialog 
            open={showTokenDialog} 
            handler={() => setShowTokenDialog(false)}
            size="md"
          >
            <DialogHeader>
              <Typography variant="h5" color="blue-gray">
                Davetiye Başarıyla Oluşturuldu
              </Typography>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Davetiye Token:
                  </Typography>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Typography 
                      variant="small" 
                      className="flex-1 font-mono text-sm break-all"
                    >
                      {generatedToken}
                    </Typography>
                    <Button
                      size="sm"
                      variant="text"
                      color="blue"
                      onClick={() => copyToClipboard(generatedToken)}
                    >
                      Kopyala
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Davetiye Linki:
                  </Typography>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Typography 
                      variant="small" 
                      className="flex-1 text-sm break-all"
                    >
                      {invitationLink}
                    </Typography>
                    <Button
                      size="sm"
                      variant="text"
                      color="blue"
                      onClick={() => copyToClipboard(invitationLink)}
                    >
                      Kopyala
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Typography variant="small" color="amber">
                    <strong>Not:</strong> Bu token ve link sadece bir kez kullanılabilir. 
                    Davet edilecek kişiyle paylaşın.
                  </Typography>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={() => setShowTokenDialog(false)}
                className="mr-1"
              >
                <span>Kapat</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}