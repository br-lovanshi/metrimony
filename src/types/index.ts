export interface Profile {
    id?: string;
    created_at?: string;
    status: 'pending' | 'approved' | 'rejected';

    // Personal
    full_name: string;
    age: number;
    gender: 'Male' | 'Female';
    rashifal_symbol: string; // NEW

    // Physical
    height_inch: number;
    blood_group: string;
    manglik: boolean;

    // Family & Gotra
    father_name: string;
    father_gotra: string; // NEW
    mother_gotra: string; // NEW
    family_gotra: string;

    // Education & Work
    education: string;
    occupation?: string;
    work_experience?: string;
    income_lakh?: number; // NEW

    // Contact
    address: string;
    mobile: string;
    email: string;
    social_media_link?: string; // NEW

    // Media & Bio
    self_photo_url: string;
    family_photo_url: string;
    expectations: string;
    hobbies?: string;

    // Extra Family
    father_occupation?: string;
    mother_occupation?: string;
    siblings_details?: string;
}

export interface SocietyUpdate {
    id: string;
    created_at: string;
    title: string;
    description: string;
    created_by?: string;
}

export interface SamajConnectRequest {
    id: string;
    created_at: string;
    full_name: string;
    age: number;
    mobile: string;
    email: string;
    address: string;
    state: string;
    district: string;
    block_tehsil: string;
    status: 'pending' | 'contacted';
}
