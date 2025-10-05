const { StatusCodes, getStatusCode } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const Attendance = require("../models/Attendance");

const getAllAttendance = async (req, res) => {
  const attendanceRecords = await Attendance.find({});
  if (!attendanceRecords) {
    throw new CustomError.NotFoundError("No attendance record found");
  }
  res
    .status(StatusCodes.OK)
    .json({ hits: attendanceRecords.length, attendanceRecords });
};

//TODO prevent duplicate for checking in
const createAttendance = async (req, res) => {
  // Add the owner field from the authenticated user
  const attendanceData = {
    ...req.body,
    owner: req.user.userId,
  };

  const attendanceRecord = await Attendance.create(attendanceData);
  res
    .status(StatusCodes.OK)
    .send({ msg: "Record created successfully", attendanceRecord });
};
const deleteAttendance = async (req, res) => {
  const attendanceRecord = await Attendance.findByIdAndDelete(req.params.id);
  if (!attendanceRecord) {
    throw new CustomError.NotFoundError("No attendance record found");
  }
  res
    .status(StatusCodes.OK)
    .send({ msg: "Record deleted successfully", attendanceRecord });
};

module.exports = {
  getAllAttendance,
  deleteAttendance,
  createAttendance,
};
