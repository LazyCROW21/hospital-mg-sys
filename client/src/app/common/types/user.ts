export type createUser = {
    firstName: string;
    lastName: string;
    phone: string;
    emergencyPhone: string;
    gender: '' | 'M' | 'F';
    dob: string;
    line1: string;
    line2: string;
    pincode: string;
    city: string;
    state: string;
    email: string;
    pwd: string;
    role: 'P' | 'D';
}