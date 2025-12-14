export interface DogProfile {
  dogName: string;
  ownerName: string;
  phone: string;
  breed: string;
  hairType: string;
  weight: string;
  age: string;
  serviceType: string;
  availabilityDays: string[];
  availabilityTime: string[];
  customTags: string[];
  notes: string;
  photoUrl: string | null;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  WELCOME = 'WELCOME',
  FORM = 'FORM',
  CARD = 'CARD'
}