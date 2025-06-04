export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Contact {
  whatsapp?: string;
  instagram?: string;
  contactPreference?: string;
} 