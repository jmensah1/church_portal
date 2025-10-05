// Service types for the Church Portal

export interface Service {
    _id: string;
    start_time?: string; // ISO date string
    end_time?: string; // ISO date string
    location: string;
    attendance: number;
    speaker?: string;
    theme?: string;
    churchday: string; // ObjectId reference
    owner: string; // ObjectId reference
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ServiceFormData {
    start_time: string; // Storing as string for date input
    end_time: string; // Storing as string for date input
    location: string;
    attendance: number | ''; // Optional: Initial expected attendance
    speaker: string;
    theme: string;
    churchday: string;
}

export interface Churchday {
    _id: string;
    attendance?: number;
    speaker?: string;
    comment?: string;
    service_type?: 'christmas' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'easter';
    owner: string;
    service?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ChurchdayFormData {
    attendance: number | ''; // Optional: Initial expected attendance
    speaker: string;
    comment: string;
    service_type: string;
}

export interface Attendance {
    _id: string;
    check_in?: string; // ISO date string
    check_out?: string; // ISO date string
    member_id: string; // ObjectId reference
    owner: string; // ObjectId reference
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AttendanceFormData {
    check_in: string; // Storing as string for date input
    check_out: string; // Storing as string for date input
    member_id: string;
}
