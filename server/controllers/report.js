const { Op, col } = require('sequelize');
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
    const report = await ReportModel.findByPk(id, {
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
    })
    return report
}

const getReportsByPatientId = async (patientId) => {
    const reports = await ReportModel.findAll({
        where: {
            patientId: patientId
        },
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
    return reports
}

const getReportsByDoctorId = async (doctorId) => {
    const reports = await ReportModel.findAll({
        where: {
            doctorId: doctorId
        },
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
    return reports
}

const getNewReports = async (role, id) => {
    const currDate = new Date(new Date() - 1000 * 60 * 60 * 24 * 2);
    let query = {
        where: {
            [Op.or]: {
                updatedAt: {
                    [Op.gte]: currDate
                },
                createdAt: { [Op.eq]: col('updatedAt') }
            }
        }
    };
    switch (role) {
        case 'admin':
            break;
        case 'doctor':
            query.where.doctorId = id;
            break;
        case 'patient':
            query.where.patientId = id;
            break;
    }
    return await ReportModel.findAndCountAll(query);
}

const addReport = async ({ id, patientId, doctorId, preferredDateTime }) => {
    const reportData = {
        appointmentId: id,
        patientId,
        doctorId,
        dateAdmitted: preferredDateTime,
        dateDischarged: null,
        treatmentType: null,
        description: null,
        status: 'progress',
        patientStatus: 'unchanged'
    };
    const newReport = new ReportModel(reportData);
    await newReport.save();
    return newReport;
}

const updateReport = async (id, data) => {
    return await ReportModel.update(data, {
        where: {
            id
        }
    });
}

const deleteReport = async (id) => {
    return await ReportModel.destroy({ where: { id } });
}



module.exports = {
    getAllReports,
    getReportById,
    getReportsByPatientId,
    getReportsByDoctorId,
    addReport,
    updateReport,
    deleteReport,
    getNewReports
}