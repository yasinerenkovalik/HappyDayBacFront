export interface Organization {
    id: string;
    title: string;
    description: string;
    price: number;
    maxGuestCount: number;
    location: string | null;
    services: string[];
    duration: string;
    isOutdoor: boolean;
    reservationNote: string;
    cancelPolicy: string;
    videoUrl: string;
    coverPhotoPath: string;
    companyId: string;
    cityName?: string;
    districtName?: string;
    city?: string;
    district?: string;
    cityId?: number;
    districtId?: number;
  }
  export interface OrganizationDetail {
    id: string;
    title: string;
    description: string;
    price: number;
    maxGuestCount: number;
    location: string | null;
    services: string[];
    duration: string;
    isOutdoor: boolean;
    reservationNote: string;
    cancelPolicy: string;
    videoUrl: string;
    coverPhotoPath: string;
    companyId: string;
    images: {
      id: number;
      imageUrl: string;
    }[];
    latitude?: number;
    longitude?: number;
    cityName?: string;
    districtName?: string;
    city?: string;
    district?: string;
    cityId?: number;
    districtId?: number;
  }