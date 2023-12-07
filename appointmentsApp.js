const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/appointments', { useNewUrlParser: true, useUnifiedTopology: true });

const Patient = mongoose.model('Patient', { name: String, email: String });
const Doctor = mongoose.model('Doctor', { name: String, email: String, specializations: [String], clinics: [String] });
const Clinic = mongoose.model('Clinic', { officialID : Number, name: String, location: String, doctors: [String] });
const Appointment = mongoose.model('Appointment', { patientId: String, doctorId: String, clinicId: String, startTime: Date, endTime: Date });

app.post('/patients', async (req, res) => {
    const emialCheck = await Patient.findOne({email: req.body.email})
    if(!emialCheck){
  const patient = new Patient(req.body);
  await patient.save();
  res.send(patient);
    }else{
        res.send(message="patient already exist")
    }
});

app.get('/patients/:email', async (req, res) => {
  try {

    const patient = await Patient.findOne({ email: req.params.email });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/doctors', async (req, res) => {
    const doctorCheck = await Doctor.findOne({email:req.body.email})
    if(!doctorCheck){
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.send(doctor);
    }else{
        res.send(message="Doctor already exists")
    }
});

app.get('/doctors/:email', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.params.email });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/clinics', async (req, res) => {
    const checkClinicID = await Clinic.findOne({officialID : req.body.officialID})
    if(!checkClinicID){
  const clinic = new Clinic(req.body);
  await clinic.save();
  res.send(clinic);
    }else{
        res.send(message="Clinic already registered, Now you can only have access to update clinic details.")
    }
});

app.get('/clinics/:officialID', async (req, res) => {
  try {
    const clinic = await Clinic.findOne({ officialID: req.params.officialID });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    res.status(200).json(clinic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/appointments', async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.body.patientId });
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    const clinic = await Clinic.findOne({ officialID: req.body.clinicId });

    if (!patient || !doctor || !clinic) {
      return res.status(400).json({ error: 'Invalid patient, doctor, or clinic ID' });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/appointments/:appointmentId', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.appointmentId });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
