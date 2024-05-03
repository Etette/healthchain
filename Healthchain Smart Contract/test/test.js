const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthRecords", function () {
  let HealthRecords;
  let healthRecords;
  let owner;
  let hospital;
  let doctor;
  let patient;

  beforeEach(async function () {
    HealthRecords = await ethers.getContractFactory("HealthRecords");
    healthRecords = await HealthRecords.deploy();
    
    [owner, hospital, doctor, patient] = await ethers.getSigners();

    await healthRecords.connect(owner).addHospitalToWhitelist(hospital.address);
    await healthRecords.connect(hospital).registerHospital();
  });

  
  it("it should whitelist, register and remove hospital", async function () {
    let isHospital_ = await healthRecords.verifyHospital(hospital.address);
    expect(isHospital_).to.be.true;

    await healthRecords.connect(owner).removeHospitalFromWhitelist(hospital.address);
    isHospital_ = await healthRecords.verifyHospital(hospital.address);
    expect(isHospital_).to.be.true;
  });

  it("Hospital should create a patient medical record", async function () {
    const dataHash = "Patient record data";
    await healthRecords.connect(hospital).createRecord(patient.address, dataHash);
    const retrievedDataHash = await healthRecords.connect(hospital).getPatientRecord(patient.address);
    expect(retrievedDataHash).to.equal(dataHash);
  });

  it("it should prevent creating duplicate medical records for a patient", async function () {
    await healthRecords.connect(hospital).createRecord(patient.address, "Record data");
    await expect(
      healthRecords.connect(hospital).createRecord(patient.address, "Another record data")
    ).to.be.revertedWith("Patient record already exist");
  });
  
  it("Hospital should add and remove doctor from hospital", async function () {
    await healthRecords.connect(hospital).addDoctorTohospital(doctor.address);
    let isDoctor = await healthRecords.verifyDoctor(doctor.address);
    expect(isDoctor).to.be.true;

    await healthRecords.connect(hospital).removeDoctorFromhospital(doctor.address);
    isDoctor = await healthRecords.verifyDoctor(doctor.address);
    expect(isDoctor).to.be.false;
  });

  it("patient should grant and revoke doctor access to patient's medical record", async function () {
    await healthRecords.connect(patient).grantDoctorAccess(doctor.address);
    let hasAccess = await healthRecords.hasDoctorAccess(patient.address, doctor.address);
    expect(hasAccess).to.be.true;

    await healthRecords.connect(patient).revokeDoctorAccess(doctor.address);
    hasAccess = await healthRecords.hasDoctorAccess(patient.address, doctor.address);
    expect(hasAccess).to.be.false;
  });

  it("Doctor should get a patient's record", async function () {
    await healthRecords.connect(hospital).addDoctorTohospital(doctor.address);
    await healthRecords.connect(hospital).createRecord(patient.address, "record1");
    const dataHash = await healthRecords.connect(doctor).getPatientRecord(patient.address);
    expect(dataHash).to.equal("record1");
  });

  it("doctor should update patient record", async function () {
    const initialDataHash = "Initial record data";
    const newDataHash = "Updated record data";
    await healthRecords.connect(hospital).createRecord(patient.address, initialDataHash);
    await healthRecords.connect(hospital).addDoctorTohospital(doctor.address);
    await healthRecords.connect(patient).grantDoctorAccess(doctor.address);
    await healthRecords.connect(doctor).updatePatientRecord(patient.address, newDataHash);
    const retrievedDataHash = await healthRecords.connect(doctor).getPatientRecord(patient.address);
    expect(retrievedDataHash).to.equal(newDataHash);
  });

});
