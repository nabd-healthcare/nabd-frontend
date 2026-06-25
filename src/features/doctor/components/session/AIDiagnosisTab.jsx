import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaExclamationTriangle, FaTimes, FaPlus, FaBirthdayCake, FaSpinner, FaKeyboard, FaSearch } from 'react-icons/fa';
import diagnosisService from '../../../../api/services/diagnosis.service';

/**
 * AIDiagnosisTab - Clinical Intelligence Hub
 *
 * Supports two input modes (toggled via a pill switch):
 *   1. "Search Mode"  — original tag-based symptom picker (unchanged)
 *   2. "Text Mode"    — doctor types free Arabic/English clinical note;
 *                       Mistral AI extracts the matching E-codes before
 *                       sending them to the main diagnosis model.
 *
 * The existing search-mode behaviour is fully preserved.
 */
const AIDiagnosisTab = ({ patientInfo }) => {
  const patientId = patientInfo?.patientId || 'unknown';
  const storageKey = `ai_chat_${patientId}`;

  // ---- Chat state (persisted) ----
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [{
      id: 1, type: 'ai',
      content: 'مرحباً دكتور! يمكنك اختيار الأعراض يدوياً من القائمة، أو التبديل لوضع النص الحر وكتابة ملاحظاتك السريرية بالعربي أو الإنجليزي.',
      timestamp: new Date()
    }];
  });

  // ---- Input mode: 'search' | 'text' ----
  const [inputMode, setInputMode] = useState('search');

  // ---- Dynamic evidence options loaded from backend ----
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [evidencesLoading, setEvidencesLoading] = useState(true);
  const [evidencesError, setEvidencesError] = useState(false);

  // ---- Search mode state ----
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // ---- Text mode state ----
  const [clinicalNote, setClinicalNote] = useState('');

  // ---- Shared state ----
  const [age, setAge] = useState(patientInfo?.patientAge || '');
  const [sex, setSex] = useState(patientInfo?.gender === 'Male' ? 'M' : patientInfo?.gender === 'Female' ? 'F' : 'M');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const searchRef      = useRef(null);
  const dropdownRef    = useRef(null);
  const textareaRef    = useRef(null);

  // Load evidences from backend on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setEvidencesLoading(true);
        setEvidencesError(false);
        const data = await diagnosisService.getEvidences();
        if (!cancelled) {
          setSymptomOptions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load evidences:', err);
          setEvidencesError(true);
        }
      } finally {
        if (!cancelled) setEvidencesLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Persist messages
  useEffect(() => {
    try {
      if (patientId !== 'unknown') localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) { /* ignore */ }
  }, [messages, storageKey, patientId]);

  // Auto scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchRef.current  && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus textarea when switching to text mode
  useEffect(() => {
    if (inputMode === 'text') {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [inputMode]);

  // ---- Filtered symptoms (search mode) ----
  const filteredSymptoms = searchQuery.trim().length < 2 ? [] :
    symptomOptions
      .filter(s => {
        const name       = s.name.toLowerCase();
        const nameWords  = name.split(/[\s,?!.;:()/]+/).filter(w => w.length > 0);
        const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
        if (searchWords.length === 0) return false;
        const isMatch = searchWords.every(searchWord =>
          name.includes(searchWord) ||
          nameWords.some(nw => nw.startsWith(searchWord)) ||
          nameWords.some(nw => nw.length > 2 && searchWord.startsWith(nw))
        );
        return isMatch && !selectedSymptoms.find(sel => sel.code === s.code);
      })
      .slice(0, 12);

  const addSymptom    = (symptom) => {
    setSelectedSymptoms(prev => [...prev, symptom]);
    setSearchQuery('');
    setShowDropdown(false);
    searchRef.current?.focus();
  };
  const removeSymptom = (code) => setSelectedSymptoms(prev => prev.filter(s => s.code !== code));

  // ---- Can send? ----
  const canSendSearch = selectedSymptoms.length > 0 && !!age && !isLoading;
  const canSendText   = clinicalNote.trim().length > 5 && !!age && !isLoading;

  // ---- Handle send (both modes share this) ----
  const handleSend = async () => {
    if (inputMode === 'search' && !canSendSearch) return;
    if (inputMode === 'text'   && !canSendText)   return;

    // Build the user message shown in the chat
    const userMsgContent = inputMode === 'text'
      ? `📝 ملاحظة سريرية: ${clinicalNote.trim()} | العمر: ${age} | النوع: ${sex === 'M' ? 'ذكر' : 'أنثى'}`
      : `🔍 تحليل أعراض: ${selectedSymptoms.map(s => s.name).join(' ، ')} | العمر: ${age} | النوع: ${sex === 'M' ? 'ذكر' : 'أنثى'}`;

    const summaryMsg = {
      id: Date.now(), type: 'user',
      content: userMsgContent,
      timestamp: new Date()
    };

    // Show a "Mistral is processing" indicator for text mode
    const loadingMsg = inputMode === 'text' ? {
      id: Date.now() + 0.5, type: 'ai', isProcessing: true,
      content: '🔄 Mistral يحلل الملاحظة السريرية ويستخرج الأعراض...',
      timestamp: new Date()
    } : null;

    setMessages(prev => loadingMsg ? [...prev, summaryMsg, loadingMsg] : [...prev, summaryMsg]);
    setIsLoading(true);

    try {
      let response;

      if (inputMode === 'text') {
        // Text mode: send symptomsText to backend → Mistral parses it → main model diagnoses
        response = await diagnosisService.getDiagnosis(
          patientInfo?.patientId || 'unknown',
          clinicalNote.trim(),  // ← the free text goes here
          parseInt(age),
          sex,
          []                    // no direct codes
        );
      } else {
        // Search mode: send direct E-codes (existing behaviour unchanged)
        response = await diagnosisService.getDiagnosis(
          patientInfo?.patientId || 'unknown',
          '',
          parseInt(age),
          sex,
          selectedSymptoms.map(s => s.code)
        );
      }

      const dto = response?.data ?? response;

      // Remove the "processing" placeholder if it was added
      if (loadingMsg) {
        setMessages(prev => prev.filter(m => m.id !== loadingMsg.id));
      }

      const aiResponse = {
        id: Date.now() + 1, type: 'ai',
        content: dto.suggestedDiagnosis,
        timestamp: new Date(),
        // Show which E-codes Mistral extracted (for transparency)
        extractedCodes: inputMode === 'text' ? dto.normalizedSymptoms : null,
        rawData: {
          normalizedSymptoms: dto.normalizedSymptoms,
          topResults: dto.topResults?.map(r => ({
            disease: r.disease, confidence: r.confidence,
            nameAr: r.nameAr, descriptionAr: r.descriptionAr,
          })),
        },
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      if (loadingMsg) {
        setMessages(prev => prev.filter(m => m.id !== loadingMsg.id));
      }
      setMessages(prev => [...prev, {
        id: Date.now() + 1, type: 'ai', isError: true,
        content: '⚠️ حدث خطأ في التشخيص. يرجى المحاولة لاحقاً.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      // Reset inputs
      setSelectedSymptoms([]);
      setClinicalNote('');
    }
  };

  // ---- Keyboard submit for textarea ----
  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && canSendText) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 128px)', minHeight: '500px' }}>

      {/* Header */}
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0070CD] text-white flex items-center justify-center shadow-lg shadow-[#0070CD]/20">
            <FaRobot className="text-lg" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Nabd Intelligence</h4>
            <span className="text-[9px] font-black text-[#0070CD] uppercase tracking-widest">Diagnostic Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-50/30">
        {messages.map((message) => (
          <div key={message.id} className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            {message.type === 'user' ? (
              <div className="max-w-[85%] bg-[#0070CD] text-white px-6 py-4 rounded-[1.5rem] rounded-tr-none shadow-xl shadow-[#0070CD]/20">
                <p className="font-bold text-sm leading-relaxed">{message.content}</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="max-w-[95%] bg-white border border-slate-100 rounded-[2rem] rounded-tl-none p-6 shadow-sm relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#0070CD] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">
                    Nabd AI
                  </div>

                  {/* Processing placeholder */}
                  {message.isProcessing ? (
                    <div className="flex items-center gap-3 pt-2">
                      <FaSpinner className="text-[#0070CD] animate-spin text-base shrink-0" />
                      <p className="text-slate-600 font-semibold text-sm">{message.content}</p>
                    </div>
                  ) : !message.rawData ? (
                    <p className="text-slate-700 font-semibold text-sm leading-relaxed pt-2">{message.content}</p>
                  ) : (
                    <div className="space-y-6 pt-2">

                      {/* Extracted codes badge (text mode transparency) */}
                      {message.extractedCodes && message.extractedCodes.length > 0 && (
                        <div className="bg-[#0070CD]/5 border border-[#0070CD]/15 rounded-xl p-3">
                          <p className="text-[9px] font-black text-[#0070CD] uppercase tracking-widest mb-2">
                            🔬 الأعراض التي استخرجها Mistral
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {message.extractedCodes.map(code => (
                              <span key={code} className="text-[9px] font-black text-[#0070CD] bg-[#0070CD]/10 border border-[#0070CD]/20 px-2 py-0.5 rounded-md">
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Results Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {message.rawData.topResults?.map((r, i) => (
                          <div key={i} className={`p-4 rounded-2xl border transition-all ${i === 0 ? 'bg-white border-[#0070CD]/20 shadow-lg shadow-[#0070CD]/5 ring-1 ring-[#0070CD]/10' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h5 className={`font-black text-sm ${i === 0 ? 'text-[#0070CD]' : 'text-slate-700'}`}>
                                {r.nameAr || r.disease}
                              </h5>
                              <div className={`text-[9px] font-black px-2.5 py-1 rounded-md ${i === 0 ? 'bg-[#0070CD] text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {r.confidence}%
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-[#0070CD]' : 'bg-slate-300'}`}
                                style={{ width: `${r.confidence}%` }}
                              />
                            </div>
                            {r.descriptionAr && <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{r.descriptionAr}</p>}
                          </div>
                        ))}
                      </div>

                      {/* Disclaimer */}
                      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                        <FaExclamationTriangle className="text-amber-500 text-sm mt-0.5 shrink-0" />
                        <p className="text-[10px] text-amber-800 font-semibold leading-relaxed">
                          هذه النتائج إرشادية فقط. يرجى الاعتماد على التقييم السريري الكامل للتشخيص النهائي.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && !messages.some(m => m.isProcessing) && (
          <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 w-fit shadow-sm animate-pulse">
            <FaRobot className="text-[#0070CD] animate-spin text-lg" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">جاري التحليل...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== Smart Input Bar ===== */}
      <div className="p-5 border-t border-slate-50 bg-white space-y-4">

        {/* ── Mode Toggle ── */}
        <div className="flex items-center justify-between">
          <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
            {/* Search mode button */}
            <button
              id="ai-mode-search"
              onClick={() => setInputMode('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                inputMode === 'search'
                  ? 'bg-[#0070CD] text-white shadow-md shadow-[#0070CD]/20'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FaSearch className="text-[10px]" />
              بحث عن أعراض
            </button>

            {/* Text mode button */}
            <button
              id="ai-mode-text"
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                inputMode === 'text'
                  ? 'bg-[#0070CD] text-white shadow-md shadow-[#0070CD]/20'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <FaKeyboard className="text-[10px]" />
              نص حر (Mistral)
            </button>
          </div>

          {/* Mistral badge shown only in text mode */}
          {inputMode === 'text' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 rounded-full">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Mistral AI</span>
            </div>
          )}
        </div>

        {/* Age + Sex row */}
        <div className="flex items-center gap-3">
          {/* Age */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex-1 focus-within:border-[#0070CD] transition-colors">
            <FaBirthdayCake className="text-slate-400 text-sm shrink-0" />
            <input
              id="ai-age-input"
              type="text"
              value={age}
              onChange={e => setAge(e.target.value.replace(/\D/, ''))}
              placeholder="أدخل العمر"
              className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>

          {/* Sex toggle */}
          <div className="flex bg-slate-100 rounded-2xl p-1 shrink-0">
            {[{ val: 'M', label: 'ذكر', icon: '♂' }, { val: 'F', label: 'أنثى', icon: '♀' }].map(opt => (
              <button
                key={opt.val}
                id={`ai-sex-${opt.val.toLowerCase()}`}
                onClick={() => setSex(opt.val)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  sex === opt.val
                    ? 'bg-[#0070CD] text-white shadow-md shadow-[#0070CD]/20'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── SEARCH MODE: symptom tags + search bar ── */}
        {inputMode === 'search' && (
          <>
            {/* Selected symptom tags */}
            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(s => (
                  <span key={s.code} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0070CD]/5 border border-[#0070CD]/20 text-[#0070CD] rounded-xl text-[10px] font-black uppercase tracking-tight">
                    {s.name}
                    <button onClick={() => removeSymptom(s.code)} className="hover:text-rose-500 transition-colors ml-0.5">
                      <FaTimes className="text-[8px]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search input + send */}
            <div className="flex items-center gap-3 relative">
              <div className="flex-1 relative" ref={dropdownRef}>
                <input
                  ref={searchRef}
                  id="ai-symptom-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                  onPaste={e => {
                    setTimeout(() => {
                      const val = e.target.value.trim();
                      if (val.length >= 2) setShowDropdown(true);
                    }, 50);
                  }}
                  placeholder={
                    evidencesLoading
                      ? 'جاري تحميل قائمة الأعراض...'
                      : evidencesError
                        ? 'فشل تحميل الأعراض - حاول مرة أخرى'
                        : `ابحث عن عرض (${symptomOptions.length} عرض متاح)...`
                  }
                  disabled={evidencesLoading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/5 transition-all outline-none placeholder:text-slate-400 placeholder:font-normal disabled:opacity-60"
                />

                {/* Loading spinner */}
                {evidencesLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FaSpinner className="text-[#0070CD] animate-spin text-sm" />
                  </div>
                )}

                {/* Dropdown */}
                {showDropdown && filteredSymptoms.length > 0 && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 max-h-64 overflow-y-auto no-scrollbar">
                    {filteredSymptoms.map(s => (
                      <button
                        key={s.code}
                        onClick={() => addSymptom(s)}
                        className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#0070CD]/5 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <span className="text-[9px] font-black text-[#0070CD] bg-[#0070CD]/5 border border-[#0070CD]/10 px-2 py-0.5 rounded-md">{s.code}</span>
                        <span className="text-xs font-semibold text-slate-700">{s.name}</span>
                        <FaPlus className="text-[8px] text-slate-300 ml-auto shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                {/* No results hint */}
                {showDropdown && searchQuery.trim().length >= 2 && filteredSymptoms.length === 0 && !evidencesLoading && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 px-5 py-4">
                    <p className="text-xs text-slate-400 font-semibold">لا توجد نتائج لـ "{searchQuery}"</p>
                  </div>
                )}
              </div>

              <button
                id="ai-send-search"
                onClick={handleSend}
                disabled={!canSendSearch}
                className="w-14 h-14 bg-[#0070CD] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#0070CD]/20 disabled:opacity-30 shrink-0"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </>
        )}

        {/* ── TEXT MODE: free-text textarea ── */}
        {inputMode === 'text' && (
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                id="ai-clinical-note"
                value={clinicalNote}
                onChange={e => setClinicalNote(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                rows={3}
                placeholder="اكتب ملاحظاتك السريرية بحرية... مثال: المريض عنده حرارة عالية وكحة جافة بقاله 3 أيام مع ألم في الصدر..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/5 transition-all outline-none placeholder:text-slate-400 placeholder:font-normal resize-none leading-relaxed"
                dir="auto"
              />
              {/* Ctrl+Enter hint */}
              <p className="absolute bottom-3 left-4 text-[9px] text-slate-300 font-semibold">
                Ctrl + Enter للإرسال
              </p>
            </div>

            <button
              id="ai-send-text"
              onClick={handleSend}
              disabled={!canSendText}
              className="w-14 self-end mb-0.5 h-14 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-400/30 disabled:opacity-30 shrink-0"
            >
              {isLoading ? <FaSpinner className="text-sm animate-spin" /> : <FaPaperPlane className="text-sm" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDiagnosisTab;
