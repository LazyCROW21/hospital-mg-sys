const transporter = require('../config/mail');

module.exports = {
    async accountReqGreeting(email) {
        const mailOptions = { 
            from: 'app@hms.com', 
            to: email, 
            subject: 'Welcome to HMS', 
            text: 'Thankyou for creating a account, please wait until your details are verified, then you will be able to login.' 
        };
        return await transporter.sendMail(mailOptions);
    },
    async commitAccountGreeting(user) {
        let subject = '', text = '';
        switch(user.status) {
            case 'A': 
                subject += 'Account Confirmed';
                text += 'Thankyou for creating a account, your details are verified, now you will be able to login.\n';
                break;
            case 'R':
                subject += 'Account Rejected';
                text += 'Thankyou for creating a account, but it seems your details are invalid or cannot be verified.\n'
                text += 'Contact the hospital if there is some mistake.\n';
                break;
            case 'X': 
                subject += 'Account Deleted';
                text += 'Thankyou for using HMS, your account has been deactivated by admins.\n'
                text += 'Contact the hospital if there is some mistake.\n';
                break;
        }
        const mailOptions = { 
            from: 'app@hms.com', 
            to: user.email, 
            subject, 
            text 
        };
        return await transporter.sendMail(mailOptions);
    },
    async appointmentAlert(doctor, patient, appointment) {
        let subject = '', text = '', to = '';
        if(appointment.concludedByPatient && !appointment.concludedByDoctor) {
            to += doctor.user.email;
            subject += 'Appointment Concluded | HMS';
            text += `The appointment request on ${appointment.preferredDateTime} has been concluded by the patient\n`;
            text += `Paitent: ${patient.user.firstName} ${patient.user.lastName} (${patient.user.phone})\n`;
            text += `Appointment subject: ${appointment.subject}\n`;
            text += `If case of conflict please contact HMS Admin\n`;
        } else if(!appointment.concludedByPatient && appointment.concludedByDoctor) {
            to += patient.user.email;
            subject += 'Appointment Concluded | HMS';
            text += `The appointment request on ${appointment.preferredDateTime} has been concluded by the doctor\n`;
            text += `Doctor: ${doctor.user.firstName} ${doctor.user.lastName} (${doctor.user.phone})\n`;
            text += `Appointment subject: ${appointment.subject}\n`;
            text += `If case of conflict please contact HMS Admin\n`;
        } else if(appointment.concludedByPatient && appointment.concludedByDoctor) {
            to += `${doctor.user.email}, ${patient.user.email}`;
            subject += 'Appointment Concluded | HMS';
            text += `The appointment request on ${appointment.preferredDateTime} has been concluded by both patient & doctor\n`;
            text += `Paitent: ${patient.user.firstName} ${patient.user.lastName} (${patient.user.phone})\n`;
            text += `Doctor: ${doctor.user.firstName} ${doctor.user.lastName} (${doctor.user.phone})\n`;
            text += `Appointment subject: ${appointment.subject}\n`;
            text += `Appointment report will be available soon\n`;
            text += `If case of conflict please contact HMS Admin\n`;
        } else {
            switch(appointment.status) {
                case 'fixed':
                    to += patient.user.email;
                    subject += 'Appointment Fixed | HMS';
                    text += `The appointment request on ${appointment.preferredDateTime} has been confirmed by the doctor\n`;
                    text += `Doctor: ${doctor.user.firstName} ${doctor.user.lastName} (${doctor.user.phone})\n`;
                    text += `Appointment subject: ${appointment.subject}\n`;
                    break;
                case 'cancelled':
                    to += doctor.user.email;
                    subject += 'Appointment Cancelled | HMS';
                    text += `The appointment request on ${appointment.preferredDateTime} has been cancelled by the patient\n`;
                    text += `Patient: ${patient.user.firstName} ${patient.user.lastName} (${patient.user.phone})\n`;
                    text += `Appointment subject: ${appointment.subject}\n`;
                    break;
                case 'applied':
                    to += doctor.user.email;
                    subject += 'New Appointment | HMS';
                    text += 'A new appointment request\n';
                    text += `From: ${patient.user.firstName} ${patient.user.lastName}\n`;
                    text += `Subject: ${appointment.subject}\n`;
                    text += `Date: ${appointment.preferredDateTime}\n`; 
                    break;
                case 'rejected':
                    to += patient.user.email;
                    subject += 'Appointment Rejected | HMS';
                    text += `The appointment request on ${appointment.preferredDateTime} has been rejected by the doctor\n`;
                    text += `Doctor: ${doctor.user.firstName} ${doctor.user.lastName} (${doctor.user.phone})\n`;
                    text += `Appointment subject: ${appointment.subject}\n`;
                    break;
            }
        }
        const mailOptions = { from: 'app@hms.com', to, subject, text };
        return await transporter.sendMail(mailOptions);
    }
}