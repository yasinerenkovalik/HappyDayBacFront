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
} from "@material-tailwind/react";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    role: "user",
  });

  useEffect(() => {
    // Mock data for now
    setInvitations([
      {
        id: "1",
        email: "user@example.com",
        role: "admin",
        status: "pending",
        createdAt: "2024-01-15",
        expiresAt: "2024-01-22",
      },
    ]);
    setLoading(false);
  }, []);

  const handleSendInvitation = () => {
    // Mock invitation sending
    console.log("Sending invitation to:", newInvitation);
    setNewInvitation({ email: "", role: "user" });
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
            className="mb-6"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Davetiyeler
          </Typography>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="E-posta"
                  value={newInvitation.email}
                  onChange={(e) =>
                    setNewInvitation({ ...newInvitation, email: e.target.value })
                  }
                  crossOrigin={undefined}
                />
                <Select
                  label="Rol"
                  value={newInvitation.role}
                  onChange={(value) =>
                    setNewInvitation({ ...newInvitation, role: value || "user" })
                  }
                >
                  <Option value="user">Kullanıcı</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="moderator">Moderatör</Option>
                </Select>
                <Button
                  onClick={handleSendInvitation}
                  disabled={!newInvitation.email}
                  className="bg-pink-500"
                >
                  Davetiye Gönder
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
                            Rol
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
                              {invitation.role}
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
                              {invitation.createdAt}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-blue-gray-50">
                            <Button
                              size="sm"
                              variant="text"
                              color="red"
                              onClick={() => console.log("Cancel invitation")}
                            >
                              İptal Et
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}