// // SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract HealthRecords {
    struct Record {
        uint id;
        string dataHash;
    }

    uint256 private recordID;
    address public owner;

    mapping(address => Record) private latestPatientRecord; // Mapping to store the latest record of each patient
    mapping(address => mapping(uint256 => Record)) private patientRecords; // Mapping to store all records of each patient
    mapping(address => mapping(address => bool)) private accessPermissions;
    mapping(address => bool) private hospital; // Mapping to store registered hospital
    mapping(address => bool) private whitelistedHospital; // mapping to whitelistedHospital hospital
    mapping(address => bool) private doctor;
    mapping(address => address) private doctorHospital;

    event doctorAccessGranted(address indexed patient, address indexed doctor);
    event doctorAccessRevoked(address indexed patient, address indexed doctor);
    event PatientRecordUpdated(address indexed patient, uint recordId, string dataHash);
    event PatientRecordCreated(address indexed hospital, address indexed _patient, uint256 recordId, string _dataHash);
    event hospitalAddedToWhitelist(address indexed hospital);
    event hospitalRemovedFromwhitelisted(address indexed hospital);
    event RegisteredHospital(address indexed hospital);

    modifier onlyHospital() {
        require(hospital[msg.sender], "Hospital not verified");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Admin");
        _;
    }

     modifier onlyWhitelistedHospital() {
        require(whitelistedHospital[msg.sender], "Hospital not whitelisted");
        _;
    }

     modifier onlyDoctor() {
        require(doctor[msg.sender], "Doctor not verified");
        //require(hospital[doctorHospital[msg.sender]], "Doctor's hospital not whitelisted");
        _;
    }


    constructor() {owner = msg.sender;}

     function createRecord(address _patient, string memory _dataHash) external onlyHospital {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_dataHash).length > 0, "Empty datahash param");
        
         // Check if a record already exists for the patient
        require(patientRecords[_patient][recordID].id == 0, "Patient record already exist");

        recordID++;
        Record memory record = Record(recordID, _dataHash);
        patientRecords[_patient][recordID] = record;
        latestPatientRecord[_patient] = record;

        
        emit PatientRecordCreated(msg.sender, _patient, recordID, _dataHash);
        
    }

    function updatePatientRecord(address _patient, string calldata _dataHash) external onlyDoctor {
        require(_patient != address(0), "Invalid patient address");
        require(bytes(_dataHash).length > 0, "Empty record");
        //require(patientRecords[_patient][recordID].id != 0, "no record found"); // Check if record exists
        // previous line returns no record for a valid record
        require(accessPermissions[_patient][msg.sender], "Not authorized");

        uint256 currentRecordID = patientRecords[_patient][recordID].id;
        Record memory updatedRecord = Record(currentRecordID, _dataHash);
        patientRecords[_patient][currentRecordID] = updatedRecord;
        latestPatientRecord[_patient] = updatedRecord;

        emit PatientRecordUpdated(_patient, currentRecordID, _dataHash);
    }

    function getPatientRecord(address _patient) external view returns (string memory) {
        // require(latestPatientRecord[_patient].id != 0, "No record found"); // Check if record exists
        require(hospital[msg.sender] || doctor[msg.sender], "Not authourized"); // only hospital or doctor can view records
        return latestPatientRecord[_patient].dataHash; // Return the data hash of the latest record
    }

    function grantDoctorAccess(address _doctor) external {
        accessPermissions[msg.sender][_doctor] = true;
        emit doctorAccessGranted(msg.sender, _doctor);
    }

    function revokeDoctorAccess(address _doctor) external {
        accessPermissions[msg.sender][_doctor] = false;
        emit doctorAccessRevoked(msg.sender, _doctor);
    }

    function hasDoctorAccess(address _patient, address _doctor) public view returns (bool) {
        return accessPermissions[_patient][_doctor];
    }

    function registerHospital() external onlyWhitelistedHospital {
        hospital[msg.sender] = true;
        emit RegisteredHospital(msg.sender);
    }

    function addHospitalToWhitelist(address _address) external onlyOwner {
        whitelistedHospital[_address] = true;
        emit hospitalAddedToWhitelist(_address);
    }

    function removeHospitalFromWhitelist(address _address) external onlyOwner {
        whitelistedHospital[_address] = false;
        emit hospitalRemovedFromwhitelisted(_address);
    }

    function verifyHospital(address _address) external view returns (bool) {
        return hospital[_address];
    }

    function verifyDoctor(address _doctor) external view returns (bool) {
        return doctor[_doctor];
    }

    function addDoctorTohospital(address _doctor) external onlyHospital {
        doctor[_doctor] = true;
        doctorHospital[_doctor] = msg.sender;
    }

    function removeDoctorFromhospital(address _doctor) external onlyHospital {
        doctor[_doctor] = false;
        doctorHospital[_doctor] = address(0);
    }

}


