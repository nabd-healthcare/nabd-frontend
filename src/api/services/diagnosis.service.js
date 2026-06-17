import api from '../client';

/**
 * Diagnosis API Service
 * Handles AI-powered diagnosis requests
 */

/**
 * Get AI diagnosis for patient symptoms
 * @param {string} patientId - Patient ID
 * @param {string} symptomsText - Symptoms description
 * @param {number} age - Patient age
 * @param {string} sex - Patient sex (M/F)
 * @param {Array} evidenceCodes - Direct E-codes
 * @returns {Promise} Diagnosis response
 */
export const getDiagnosis = async (patientId, symptomsText, age = null, sex = null, evidenceCodes = []) => {
    try {
        const response = await api.post('/doctor/diagnosis', {
            patientId,
            symptomsText,
            age,
            sex,
            evidenceCodes
        });
        return response.data;
    } catch (error) {
        console.error('Error getting diagnosis:', error);
        throw error;
    }
};

/**
 * Get all available evidence codes and their names from the backend.
 * This is the single source of truth — always in sync with the AI model.
 * @returns {Promise<Array<{code: string, name: string}>>} List of evidence objects
 */
export const getEvidences = async () => {
    try {
        const response = await api.get('/doctor/diagnosis/evidences');
        return response.data; // Array of { code, name }
    } catch (error) {
        console.error('Error fetching evidences:', error);
        throw error;
    }
};

/**
 * Check diagnosis service health
 * @returns {Promise} Health status
 */
export const checkDiagnosisHealth = async () => {
    try {
        const response = await api.get('/doctor/diagnosis/health');
        return response.data;
    } catch (error) {
        console.error('Error checking diagnosis health:', error);
        throw error;
    }
};

export default {
    getDiagnosis,
    getEvidences,
    checkDiagnosisHealth
};
