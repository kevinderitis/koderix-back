import mongoose from 'mongoose';
import Lead from './models/leadModel.js';
import config from '../config/config.js';

mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});


const createLead = async (threadId, email) => {
  try {
    let existingLead = await Lead.findOne({ threadId });

    if (existingLead) {
      existingLead.email = email;
      await existingLead.save();
      console.log('Lead actualizado exitosamente:', existingLead);
      return existingLead;
    } else {
      const newLead = new Lead({
        threadId,
        email
      });
      await newLead.save();
      console.log('Lead creado exitosamente:', newLead);
      return newLead;
    }
  } catch (error) {
    console.error('Error al crear o actualizar lead:', error.message);
    throw new Error('No se pudo crear o actualizar el lead');
  }
};



const getAllLeads = async () => {
  try {
    const leads = await Lead.find();
    console.log('Leads encontrados:', leads);
    return leads;
  } catch (error) {
    console.error('Error al obtener leads:', error.message);
    throw new Error('No se pudieron obtener los leads');
  }
};

const getLeadById = async (leadId) => {
  try {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      throw new Error('Lead no encontrado');
    }
    console.log('Lead encontrado:', lead);
    return lead;
  } catch (error) {
    console.error('Error al obtener lead por ID:', error.message);
    throw new Error('No se pudo encontrar el lead');
  }
};

const updateLeadById = async (leadId, newData) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(leadId, newData, {
      new: true,
    });
    if (!updatedLead) {
      throw new Error('Lead no encontrado');
    }
    console.log('Lead actualizado:', updatedLead);
    return updatedLead;
  } catch (error) {
    console.error('Error al actualizar lead por ID:', error.message);
    throw new Error('No se pudo actualizar el lead');
  }
};

const deleteLeadById = async (leadId) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    if (!deletedLead) {
      throw new Error('Lead no encontrado');
    }
    console.log('Lead eliminado:', deletedLead);
    return deletedLead;
  } catch (error) {
    console.error('Error al eliminar lead por ID:', error.message);
    throw new Error('No se pudo eliminar el lead');
  }
};

export { createLead, getAllLeads, getLeadById, updateLeadById, deleteLeadById };