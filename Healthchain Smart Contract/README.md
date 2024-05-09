## HealthChain Smart Contract Documentation

The HealthChain smart contract facilitates the management of medical records on the blockchain. It allows hospitals to create and update patient records securely while maintaining access control and privacy.
The contract deployer can whitelist verified hospitals only. Whitelisted hospitals can call the register hospital function to register the hospital, giving control to the hospital.
A registered hospital can add a patient record, verify a doctor and also revoke a doctor’s access.
The patient can approve/revoke a verified doctor access to view or update the patient’s record.
A verified doctor can view and update a patient’s medical record.

## Contract Structure
The contract consists of several key components:

## Struct: Record - 
Represents a medical record containing a unique identifier (id) and a hash of the medical data (dataHash).

## State Variables:
## owner: 
Address of the contract deployer. Owner can whitelist and approve hospitals only.
## patientRecords: 
Mapping of patient addresses to arrays of patient Record structs.
## accessPermissions: 
Mapping of patient addresses to mappings of doctor addresses to boolean access rights. Checks if the doctor is approved to access the patient’s records.
## hospitals: 
Mapping of hospital addresses to boolean values indicating the hospital registration status.
## whitelist: 
Mapping of addresses to boolean values indicating hospitals whitelisting status.
## doctors: 
Mapping of doctor addresses to boolean values indicating doctors whitelisting status.
## doctorHospital: 
Mapping of doctor addresses to their associated hospital addresses.

## Events:
## RecordAccessGranted: 
Fired when a doctor is granted access to a patient's record.
## RecordAccessRevoked: 
Fired when a doctor's access to a patient's record is revoked.
## RecordUpdated: 
Fired when a patient's record is updated.
## RecordCreated: 
Fired when a new patient record is created by a hospital.
## AddedToWhitelist: 
Fired when an address is added to the whitelist.
## RemovedFromWhitelist: 
Fired when an address is removed from the whitelist.
## HospitalRegistered: 
Fired when a hospital is registered.

## Access Control
## onlyHospital: 
Modifier that restricts certain functions to be executed only by registered hospitals.
## onlyOwner: 
Modifier that allows only the contract deployer to perform certain actions.
## onlyWhitelisted: 
Modifier that ensures only whitelisted addresses can perform specific actions.
## onlyDoctorFromWhitelistedHospital: 
Modifier that allows only whitelisted doctors from whitelisted hospitals to update records.

## Functions
## createRecord: 
Allows hospitals to create a new medical record for a patient.
## grantDoctorAccess / revokeDoctorAccess: 
Allows hospitals to grant or revoke access for doctors to view patient records.
## hasAccess: 
Checks if a doctor has access to a patient's records.
## getRecordDataHash: 
Retrieves the hash of a patient's record data.
## registerHospital: 
Registers a whitelisted hospital.
## addHospitalToWhitelist / removeHospitalFromWhitelist: 
Adds or removes a hospital from the whitelist.
## isHospital: 
Checks if an address is a registered hospital.
## updateRecord: 
Allows verified doctors from whitelisted hospitals to update patient records.
## addDoctorToWhitelist / removeDoctorFromWhitelist: 
Adds or removes a doctor from the whitelist.

## Usage
The HealthChain smart contract provides a secure and transparent platform for managing medical records. Hospitals can create and update patient records while maintaining access control and privacy. Doctors can be granted access to view and update patient records, ensuring seamless collaboration and efficient healthcare delivery.

