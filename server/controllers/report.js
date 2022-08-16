const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const ReportModel = require('../models/report');
const User = require('../models/user');

ReportModel.sync();

const getAllReports = async () => {
    const reports = await ReportModel.findAll({
        include: [
            {
                model: Doctor,
                as: 'doctor',
                include: {
                    model: User,
                    as: 'user'
                }
            },
            {
                model: Patient,
                as: 'patient',
                include: {
                    model: User,
                    as: 'user'
                }
            }
        ]
    });
    return reports;
}

const getReportById = async (id) => {
    const report = await ReportModel.findByPk(id)
    return report
}

const getReportsByPatientId = async (patientId) => {
    const reports = await ReportModel.findAll({
        where: {
            patientId: patientId
        }
    });
    return reports
}

const getReportsByDoctorId = async (doctorId) => {
    const reports = await ReportModel.findAll({
        where: {
            doctorId: doctorId
        }
    });
    return reports
}

const addReport = async (reportData) => {
    reportData.doctorId = 1;
    const newReport = new ReportModel(reportData);
    await newReport.save();
    return newReport;
}



module.exports = {
    getAllReports,
    getReportById,
    getReportsByPatientId,
    getReportsByDoctorId,
    addReport
}