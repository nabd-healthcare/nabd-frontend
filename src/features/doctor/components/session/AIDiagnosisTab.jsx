import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaExclamationTriangle, FaTimes, FaPlus, FaUser, FaBirthdayCake } from 'react-icons/fa';
import diagnosisService from '../../../../api/services/diagnosis.service';

// ===== Evidence codes map (code -> English name) =====
const EVIDENCE_MAP = {
  "E_91": "Fever", "E_55": "Do you feel pain somewhere", "E_53": "Pain somewhere related to consulting reason",
  "E_57": "Does the pain radiate to another location", "E_54": "Characterize your pain", "E_59": "How fast did the pain appear",
  "E_56": "How intense is the pain", "E_58": "How precisely is the pain located", "E_159": "Lose consciousness",
  "E_133": "Chest pain", "E_129": "Lesions or redness on skin", "E_130": "What color is the rash",
  "E_134": "Pain caused by the rash", "E_132": "Is the rash swollen", "E_136": "Severity of the itching",
  "E_135": "Is the lesion larger than 1cm", "E_131": "Do your lesions peel off", "E_154": "Pale skin",
  "E_155": "Palpitations", "E_210": "Vomited blood or resembling coffee beans", "E_140": "Black stools",
  "E_51": "Diarrhea or increased stool frequency", "E_75": "Choking or suffocating feeling", "E_89": "Constantly fatigued or non-restful sleep",
  "E_114": "More irritable or unstable mood", "E_82": "Dizziness", "E_148": "Nausea", "E_94": "Chills",
  "E_220": "Pain on deep breath", "E_161": "Loss of appetite or get full quickly", "E_179": "Blood or blood clots in stool",
  "E_162": "Weight loss", "E_173": "Burning sensation from stomach to throat", "E_33": "Pain improves when leaning forward",
  "E_218": "Symptoms increased with exertion alleviated with rest", "E_93": "Numbness or tingling in the feet",
  "E_66": "Shortness of breath", "E_163": "Vaginal discharge", "E_30": "Bloated or distended abdomen",
  "E_127": "Eyes produce excessive tears", "E_181": "Nasal congestion or runny nose", "E_88": "Too tired to do usual activities",
  "E_43": "Lost consciousness with muscle contractions", "E_156": "Weakness or paralysis on one side of face",
  "E_144": "Diffuse muscle pain", "E_216": "Pain increased with movement", "E_201": "Cough",
  "E_217": "Symptoms worse when lying down", "E_215": "Symptoms get worse after eating", "E_64": "Out of breath with minimal effort",
  "E_96": "Gained weight recently", "E_16": "Feel anxious", "E_50": "Sweating", "E_97": "Sore throat",
  "E_9": "Swollen or painful lymph nodes", "E_76": "Feel slightly dizzy or lightheaded",
  "E_102": "High blood pressure consultation", "E_65": "Difficulty swallowing", "E_74": "Redness in one or both eyes",
  "E_205": "Difficulty opening mouth or jaw pain", "E_63": "Difficulty articulating words or speaking",
  "E_128": "Suffocating for a short time with inability to breathe", "E_190": "More saliva than usual",
  "E_39": "Confused or disorientated lately", "E_212": "Voice has become deeper softer or hoarse",
  "E_206": "Painful mouth ulcers or sores", "E_52": "Seeing double images", "E_203": "Intense coughing fits",
  "E_38": "Pain or weakness in your jaw", "E_172": "Hard time opening or raising eyelids",
  "E_84": "Weakness in both arms and or legs", "E_90": "Muscle weakness increases with fatigue",
  "E_211": "Vomited several times", "E_166": "Vomit after coughing", "E_112": "Wheeze while inhaling or noisy breathing",
  "E_178": "Unusual bleeding or bruising", "E_151": "Swelling in one or more body areas", "E_45": "Coughing up blood",
  "E_194": "High pitched sound when breathing in", "E_83": "Weakness in facial muscles or eyes",
  "E_157": "Numbness or tingling in both arms legs and around mouth", "E_214": "Wheezing sound when exhaling",
  "E_150": "Unable to pass stools or gas", "E_32": "Decrease in appetite",
  "E_221": "Symptoms increased with coughing lifting or bowel movement", "E_202": "Whooping cough",
  "E_219": "Symptoms more prominent at night", "E_196": "Surgery within the last month",
  "E_170": "Severe itching in one or both eyes", "E_77": "Cough produces colored or abundant sputum",
  "E_13": "Symptoms worsened over last 2 weeks", "E_14": "Chest pain at rest", "E_169": "Nose or throat itchy",
  "E_177": "Numbness or tingling anywhere on body", "E_175": "New fatigue muscle aches or change in wellbeing",
  "E_174": "Unintentionally losing weight or lost appetite", "E_145": "Very abundant or long menstruation periods",
  "E_92": "Cheeks suddenly turn red", "E_192": "Muscle spasms in neck preventing head turning",
  "E_188": "Pale stools and dark urine", "E_164": "Heart beating very irregularly",
  "E_193": "Annoying muscle spasms in face neck or body", "E_67": "Choking or shortness of breath at night",
  "E_78": "Drink alcohol excessively", "E_182": "Greenish or yellowish nasal discharge",
  "E_103": "Lost sense of smell", "E_23": "Stop breathing while asleep", "E_105": "Heart attack or angina",
  "E_104": "High blood pressure", "E_79": "Smoke cigarettes", "E_71": "High cholesterol",
  "E_41": "Contact with person with similar symptoms past 2 weeks", "E_100": "Currently take hormones",
  "E_69": "Diabetes", "E_167": "Think you are pregnant", "E_115": "Unprotected sex with multiple partners",
  "E_70": "Significantly overweight", "E_10": "Recently taken anti-inflammatory drugs",
  "E_42": "Allergy", "E_124": "Asthma", "E_116": "A cold in the last 2 weeks",
  "E_2": "HIV positive", "E_227": "Immunosuppressed", "E_61": "Intravenous drug use",
  "E_47": "Crohn disease or ulcerative colitis", "E_27": "Sexually transmitted infection",
  "E_143": "Exercise regularly 4 times per week", "E_191": "A former smoker",
  "E_208": "BMI less than 18.5 or underweight", "E_126": "Liver cirrhosis",
  "E_7": "Poor diet", "E_24": "Diagnosed with anemia", "E_26": "Family members diagnosed with anemia",
  "E_113": "Chronic kidney failure", "E_80": "Diagnosed with depression",
  "E_40": "Contact with someone who had pertussis", "E_0": "Viral infection",
  "E_34": "Active cancer", "E_209": "Vaccinations up to date", "E_139": "Known heart defect",
  "E_19": "Diagnosed with hyperthyroidism", "E_31": "Severe COPD", "E_22": "Known heart valve issue",
  "E_99": "Migraine", "E_107": "Stroke", "E_95": "Parkinson disease",
  "E_204": "Travel history", "E_37": "Metastatic cancer", "E_153": "Being treated for osteoporosis",
  "E_98": "Hiatal hernia", "E_48": "Live with 4 or more people", "E_49": "Attend or work in a daycare",
  "E_86": "Family members with allergies hay fever or eczema", "E_87": "Family members with asthma",
  "E_106": "Heart failure", "E_158": "Diagnosed with endocrine disease or hormone dysfunction",
  "E_6": "Chronic pancreatitis", "E_125": "Gastroesophageal reflux", "E_21": "Spontaneous pneumothorax",
  "E_222": "Exposed to secondhand cigarette smoke daily", "E_15": "Started antipsychotic medication last 7 days",
  "E_109": "DVT deep vein thrombosis", "E_110": "Unable to move for more than 3 days in last 4 weeks",
  "E_18": "Cystic fibrosis", "E_118": "Pneumonia", "E_123": "COPD",
  "E_119": "Chronic sinusitis", "E_121": "Deviated nasal septum", "E_120": "Polyps in nose",
  "E_101": "Hospitalized for asthma attack past year", "E_46": "2 or more asthma attacks past year",
  "E_5": "Fluid in your lungs", "E_200": "Work in mining sector", "E_199": "Work in construction",
  "E_198": "Work in agriculture", "E_224": "Family members with lung cancer",
  "E_223": "Family members diagnosed with pancreatic cancer", "E_225": "Family members with cardiovascular disease before 50",
  "E_55_@_V_101": "Chest pain (specific)"
};

// Build searchable array
const SYMPTOM_OPTIONS = Object.entries(EVIDENCE_MAP).map(([code, name]) => ({ code, name }));

/**
 * AIDiagnosisTab - Clinical Intelligence Hub
 * Smart symptom search with tag-based multi-select
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

  // Filtered symptoms - word-based matching for better paste/search support
  const filteredSymptoms = searchQuery.trim().length < 2 ? [] :
    SYMPTOM_OPTIONS
      .filter(s => {
        const name = s.name.toLowerCase();
        const words = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
        return words.every(word => name.includes(word)) && !selectedSymptoms.find(sel => sel.code === s.code);
      })
      .slice(0, 10);

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
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">

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
                // Allow the paste to complete, then force-show dropdown
                setTimeout(() => {
                  const val = e.target.value.trim();
                  if (val.length >= 2) setShowDropdown(true);
                }, 50);
              }}
              placeholder="ابحث عن عرض (مثلاً: Fever, Cough...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:border-[#0070CD] focus:ring-4 focus:ring-[#0070CD]/5 transition-all outline-none placeholder:text-slate-400 placeholder:font-normal"
            />

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
