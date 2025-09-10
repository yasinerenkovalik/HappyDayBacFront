// İletişim bilgileri - Tek yerden yönetim
export const CONTACT_INFO = {
  phone: "0551 100 10 14",
  email: "mutlugunumsosyal@gmail.com",
  address: {
    street: "Osmangazi Mahallesi İstiklal Caddesi ",
    detail: "No:49/B Darıca, Kocaeli",
    full: "Osmangazi Mahallesi İstiklal Caddesi No:49/B Darıca, Kocaeli, Turkey"
  },
  workingHours: {
    weekdays: "Pazartesi - Cuma: 09:00 - 18:00",
    saturday: "Cumartesi: 10:00 - 16:00",
    sunday: "Pazar: Kapalı"
  },
  social: {
    facebook: "https://facebook.com/mutlugunum",
    instagram: "https://instagram.com/mutlugunum",
    twitter: "https://twitter.com/mutlugunum",
    linkedin: "https://linkedin.com/company/mutlugunum"
  }
};

// İletişim bilgilerini formatlamak için yardımcı fonksiyonlar
export const formatPhone = (phone: string = CONTACT_INFO.phone) => {
  return phone.replace(/\s/g, '');
};

export const getPhoneLink = (phone: string = CONTACT_INFO.phone) => {
  return `tel:${formatPhone(phone)}`;
};

export const getEmailLink = (email: string = CONTACT_INFO.email, subject?: string, body?: string) => {
  let link = `mailto:${email}`;
  const params = [];

  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  if (params.length > 0) {
    link += `?${params.join('&')}`;
  }

  return link;
};

export const getWhatsAppLink = (phone: string = CONTACT_INFO.phone, message?: string) => {
  const cleanPhone = formatPhone(phone).replace(/^\+?90/, '90'); // Türkiye kodu ekle
  let link = `https://wa.me/${cleanPhone}`;

  if (message) {
    link += `?text=${encodeURIComponent(message)}`;
  }

  return link;
};