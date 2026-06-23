import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaExclamationTriangle, FaTimes, FaPlus, FaBirthdayCake, FaSpinner } from 'react-icons/fa';
import diagnosisService from '../../../../api/services/diagnosis.service';

/**
 * AIDiagnosisTab - Clinical Intelligence Hub
 * Smart symptom search with tag-based multi-select.
 * Evidence list is loaded dynamically from the backend (evidences.json)
 * so every symptom the model knows about is always searchable.
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
      content: 'مرحباً دكتور! استخدم أداة البحث أدناه لتحديد الأعراض وعمر ونوع المريض، ثم اضغط "تحليل" للحصول على التشخيص.',
      timestamp: new Date()
    }];
  });

  // ---- Dynamic evidence options loaded from backend ----
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [evidencesLoading, setEvidencesLoading] = useState(true);
  const [evidencesError, setEvidencesError] = useState(false);

  // ---- Input state ----
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [age, setAge] = useState(patientInfo?.patientAge || '');
  const [sex, setSex] = useState(patientInfo?.gender === 'Male' ? 'M' : patientInfo?.gender === 'Female' ? 'F' : 'M');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load evidences from backend on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setEvidencesLoading(true);
        setEvidencesError(false);
        const data = await diagnosisService.getEvidences();
        if (!cancelled) {
          // data is Array<{code, name}>
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
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filtered symptoms - smart matching with prefix/stem support
  // e.g. "takes" matches "take", "drinks" matches "drink", "stimulant" matches "stimulant"
  const filteredSymptoms = searchQuery.trim().length < 2 ? [] :
    symptomOptions
      .filter(s => {
        const name = s.name.toLowerCase();
        // Split the question into individual words for stem comparison
        const nameWords = name.split(/[\s,?!.;:()/]+/).filter(w => w.length > 0);
        const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
        if (searchWords.length === 0) return false;
        const isMatch = searchWords.every(searchWord =>
          // 1. Direct substring: "stimulant" inside "stimulant effects"
          name.includes(searchWord) ||
          // 2. Prefix match: nameWord starts with searchWord → "take".startsWith("tak") ✓
          nameWords.some(nw => nw.startsWith(searchWord)) ||
          // 3. Reverse prefix: searchWord starts with nameWord → "takes".startsWith("take") ✓
          nameWords.some(nw => nw.length > 2 && searchWord.startsWith(nw))
        );
        return isMatch && !selectedSymptoms.find(sel => sel.code === s.code);
      })
      .slice(0, 12);

  const addSymptom = (symptom) => {
    setSelectedSymptoms(prev => [...prev, symptom]);
    setSearchQuery('');
    setShowDropdown(false);
    searchRef.current?.focus();
  };

  const removeSymptom = (code) => {
    setSelectedSymptoms(prev => prev.filter(s => s.code !== code));
  };

  const handleSend = async () => {
    if (selectedSymptoms.length === 0 || !age) return;

    const summaryMsg = {
      id: Date.now(), type: 'user',
      content: `🔍 تحليل أعراض: ${selectedSymptoms.map(s => s.name).join(' ، ')} | العمر: ${age} | النوع: ${sex === 'M' ? 'ذكر' : 'أنثى'}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, summaryMsg]);
    setIsLoading(true);

    try {
      const response = await diagnosisService.getDiagnosis(
        patientInfo?.patientId || 'unknown',
        '', // no free text
        parseInt(age),
        sex,
        selectedSymptoms.map(s => s.code)
      );

      const dto = response?.data ?? response;

      const aiResponse = {
        id: Date.now() + 1, type: 'ai',
        content: dto.suggestedDiagnosis,
        timestamp: new Date(),
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
      setMessages(prev => [...prev, {
        id: Date.now() + 1, type: 'ai', isError: true,
        content: '⚠️ حدث خطأ في التشخيص. يرجى المحاولة لاحقاً.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setSelectedSymptoms([]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">

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
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-50/30">
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

                  {!message.rawData ? (
                    <p className="text-slate-700 font-semibold text-sm leading-relaxed pt-2">{message.content}</p>
                  ) : (
                    <div className="space-y-6 pt-2">
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

        {isLoading && (
          <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 w-fit shadow-sm animate-pulse">
            <FaRobot className="text-[#0070CD] animate-spin text-lg" />
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">جاري التحليل...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== Smart Input Bar ===== */}
      <div className="p-5 border-t border-slate-50 bg-white space-y-4">

        {/* Age + Sex row */}
        <div className="flex items-center gap-3">
          {/* Age */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex-1 focus-within:border-[#0070CD] transition-colors">
            <FaBirthdayCake className="text-slate-400 text-sm shrink-0" />
            <input
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

        {/* Symptom tags */}
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

        {/* Symptom search + Send */}
        <div className="flex items-center gap-3 relative">
          <div className="flex-1 relative" ref={dropdownRef}>
            <input
              ref={searchRef}
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

            {/* Loading spinner inside input */}
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
            onClick={handleSend}
            disabled={selectedSymptoms.length === 0 || !age || isLoading}
            className="w-14 h-14 bg-[#0070CD] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#0070CD]/20 disabled:opacity-30 shrink-0"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisTab;
