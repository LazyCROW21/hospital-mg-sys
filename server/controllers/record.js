const RecordModel = require('../models/record');

RecordModel.sync();

const getAllRecords = async () => {
    const records = await RecordModel.findAll();
    return records;
}

const getRecordById = async (id) => {
    const record = await RecordModel.findByPk(id)
    return record
}

const getRecordsByPatientId = async (patientId) => {
    const records = await RecordModel.findAll({
        where: {
            patientId: patientId
        }
    });
    return records
}

const getRecordsByDoctorId = async (doctorId) => {
    const records = await RecordModel.findAll({
        where: {
            doctorId: doctorId
        }
    });
    return records
}

const addRecord = async (recordData) => {
    const newRecord = new RecordModel(recordData);
    await newRecord.save();
    return newRecord;
}



module.exports = {
    getAllRecords,
    getRecordById,
    getRecordsByPatientId,
    getRecordsByDoctorId,
    addRecord
}