import apiClient from '../client';


class PrescriptionsService {
    async getAllPrescriptions() {
        const response = await apiClient.get('/Prescriptions');
        return response.data?.data || [];
    }

    async createPrescription(data) {
        const response = await apiClient.post('/Prescriptions', data);
        return response.data;
    }

    async getPrescription(id) {
        const response = await apiClient.get(`/Prescriptions/${id}`);
        return response.data?.data || null;
    }

    async updatePrescription(id, data) {
        const response = await apiClient.put(`/Prescriptions/${id}`, data);
        return response.data;
    }

    async deletePrescription(id) {
        const response = await apiClient.delete(`/Prescriptions/${id}`);
        return response.data;
    }

    async getPrescriptionByNumber(number) {
        const response = await apiClient.get(`/Prescriptions/number/${number}`);
        return response.data?.data || null;
    }

    async cancelPrescription(id) {
        const response = await apiClient.post(`/Prescriptions/${id}/cancel`);
        return response.data;
    }

    async renewPrescription(id) {
        const response = await apiClient.post(`/Prescriptions/${id}/renew`);
        return response.data;
    }

    async getPatientCurrentMedications(patientId) {
        const response = await apiClient.get(`/Prescriptions/patient/${patientId}/current-medications`);
        return response.data?.data || [];
    }

    // Helper alias to match existing static method usage if any (keeping backward compatibility if needed, though previously it was static)
    // The previous file had: static async getPrescriptions
    // We can keep it or move to instance. Since I am replacing the file, I'll make it a standard instance service like others.
}

export default new PrescriptionsService();