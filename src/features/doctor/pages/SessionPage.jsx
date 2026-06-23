import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { useSessionManager } from '../hooks/useSessionManager';
import useAuth from '../../auth/hooks/useAuth';

// Components
import SessionHeader from '../components/session/SessionHeader';
import MedicalRecordTab from '../components/session/MedicalRecordTab';
import PrescriptionTab from '../components/session/PrescriptionTab';
import DocumentationTab from '../components/session/DocumentationTab';
import AIDiagnosisTab from '../components/session/AIDiagnosisTab';
import SessionPatientInfo from '../components/session/SessionPatientInfo';
import ErrorAlert from '../components/session/ErrorAlert';
import { FaTerminal, FaShieldAlt } from 'react-icons/fa';

/**
 * SessionPage - Clinical Terminal Edition
 * A high-density split-screen layout for optimal clinical focus.
 */
const SessionPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const {
        currentSession,
        patientInfo,
        patientMedicalRecord,
        documentation,
        loading,
        error,
        fetchPatientMedicalRecord,
        createPrescription,
        addDocumentation,
        fetchDocumentation,
        endSession,
        clearError,
        timeRemaining,
        isSessionExpiring,
    } = useSession();

    const { startOrResumeSession } = useSessionManager();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('medical');
    const [docForm, setDocForm] = useState({
        chiefComplaint: '',
        historyOfPresentIllness: '',
        physicalExamination: '',
        diagnosis: '',
        managementPlan: '',
    });

    const [autoSaveStatus, setAutoSaveStatus] = useState('');
    const autoSaveTimeoutRef = useRef(null);
    const hasChangesRef = useRef(false);

    useEffect(() => {
        const initSession = async () => {
            if (appointmentId && (!currentSession || currentSession.appointmentId !== appointmentId)) {
                await startOrResumeSession({ id: appointmentId, apiStatus: 3 });
            }
        };
        initSession();
    }, [appointmentId, currentSession, startOrResumeSession]);

    useEffect(() => {
        if (activeTab === 'medical' && !patientMedicalRecord && !loading && currentSession) {
            fetchPatientMedicalRecord();
        }
    }, [activeTab, patientMedicalRecord, loading, fetchPatientMedicalRecord, currentSession]);

    useEffect(() => {
        if (hasChangesRef.current && activeTab === 'documentation') {
            if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
            autoSaveTimeoutRef.current = setTimeout(async () => {
                setAutoSaveStatus('saving');
                const result = await addDocumentation({ ...docForm, sessionType: currentSession?.sessionType || 1 }, true);
                if (result.success) {
                    setAutoSaveStatus('saved');
                    hasChangesRef.current = false;
                    setTimeout(() => setAutoSaveStatus(''), 2000);
                } else setAutoSaveStatus('');
            }, 3000);
        }
        return () => { if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current); };
    }, [docForm, activeTab, currentSession, addDocumentation]);

    const handleEndSession = async () => {
        if (window.confirm('هل أنت متأكد من إنهاء الجلسة؟')) {
            if (Object.values(docForm).some(val => val)) {
                await addDocumentation({ ...docForm, sessionType: currentSession?.sessionType || 1 }, true);
            }
            const result = await endSession();
            if (result.success) navigate('/doctor/appointments');
        }
    };

    const handleClose = () => navigate('/doctor/appointments');

    const handleTabChange = async (tabId) => {
        setActiveTab(tabId);
        if (tabId === 'medical' && !patientMedicalRecord) await fetchPatientMedicalRecord();
        else if (tabId === 'documentation') {
            if (!documentation && currentSession) {
                const result = await fetchDocumentation();
                if (result.success && result.data) {
                    setDocForm({
                        chiefComplaint: result.data.chiefComplaint || '',
                        historyOfPresentIllness: result.data.historyOfPresentIllness || '',
                        physicalExamination: result.data.physicalExamination || '',
                        diagnosis: result.data.diagnosis || '',
                        managementPlan: result.data.managementPlan || '',
                    });
                }
            } else if (documentation) {
                setDocForm({
                    chiefComplaint: documentation.chiefComplaint || '',
                    historyOfPresentIllness: documentation.historyOfPresentIllness || '',
                    physicalExamination: documentation.physicalExamination || '',
                    diagnosis: documentation.diagnosis || '',
                    managementPlan: documentation.managementPlan || '',
                });
            }
        }
    };

    const handleDocFormChange = (field, value) => {
        setDocForm(prev => ({ ...prev, [field]: value }));
        hasChangesRef.current = true;
        setAutoSaveStatus('');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Tactical Clinical Header */}
            <SessionHeader
                patientInfo={patientInfo}
                currentSession={currentSession}
                loading={loading}
                onClose={handleClose}
                onEndSession={handleEndSession}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                timeRemaining={timeRemaining}
                isExpiring={isSessionExpiring}
            />

            {/* Split Screen Medical Terminal */}
            <div className="flex-1 max-w-[1800px] w-full mx-auto p-6 flex gap-8" style={{ height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
                {/* Left Area: Dynamic Clinical Panels (70%) */}
                <div className="flex-1 flex flex-col min-w-0 h-full">

                   {/* AI tab gets fixed height + internal scroll; other tabs scroll the container */}
                   {activeTab === 'ai_diagnosis' ? (
                     <div className="h-full flex flex-col">
                       <ErrorAlert error={error} onClear={clearError} />
                       <div className="flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-200">
                         <AIDiagnosisTab
                             patientInfo={patientInfo}
                             currentSession={currentSession}
                         />
                       </div>
                     </div>
                   ) : (
                   <div className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth space-y-4">
                      <ErrorAlert error={error} onClear={clearError} />
                      
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-200">
                        {activeTab === 'medical' && (
                            <MedicalRecordTab
                                patientMedicalRecord={patientMedicalRecord}
                                loading={loading}
                                onFetchMedicalRecord={fetchPatientMedicalRecord}
                                patientInfo={patientInfo}
                                user={user}
                            />
                        )}
                        {activeTab === 'prescription' && (
                            <PrescriptionTab
                                currentSession={currentSession}
                                patientInfo={patientInfo}
                                appointmentId={appointmentId}
                                user={user}
                                onCreatePrescription={createPrescription}
                            />
                        )}
                        {activeTab === 'documentation' && (
                            <DocumentationTab
                                docForm={docForm}
                                onDocFormChange={handleDocFormChange}
                                autoSaveStatus={autoSaveStatus}
                                patientInfo={patientInfo}
                                user={user}
                            />
                        )}
                      </div>
                   </div>
                   )}
                </div>

                {/* Right Area: Tactical Patient Intelligence Sidebar (30%) */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-6 sticky top-0 h-full">

                    <div className="overflow-y-auto no-scrollbar flex flex-col gap-6">
                       <SessionPatientInfo patientInfo={patientInfo} />

                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default SessionPage;
