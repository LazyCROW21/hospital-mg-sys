export type Appointment = {
    id: number;
    patientId: number;
    doctorId: number;
    subject: string;
    message: string;
    preferredDateTime: Date;
    status: string;
};