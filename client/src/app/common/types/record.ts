export type Record = {
    id: number;
    patientId: number;
    doctorId: number;
    dateAdmitted: Date;
    dateDischarged: Date;
    treatmentType: string;
    description: string;
    status: string;
    patientStatus: string;
};