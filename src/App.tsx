import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  UserCheck, 
  Vote, 
  BarChart3, 
  Languages, 
  Activity,
  Volume2, 
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Clock,
  Mic,
  Camera,
  CameraOff,
  CheckCircle2,
  Settings,
  Type,
  Eye,
  Zap,
  Search,
  Filter,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Home,
  X,
  ArrowLeft,
  ArrowRight,
  Shield
} from 'lucide-react';
import { getVoiceGuidance } from './services/geminiService';

type AppState = 'LANDING' | 'VERIFY_AADHAAR' | 'OTP_VERIFICATION' | 'BIOMETRICS' | 'VOTING' | 'ALREADY_VOTED' | 'RESULTS' | 'THANK_YOU';

interface Candidate {
  id: string;
  name: Record<string, string>;
  symbol: string;
  votes: number;
  manifesto?: string;
  leader?: string;
  voiceKeys?: string[];
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ml', name: 'Malayalam' },
];

const TRANSLATIONS: Record<string, any> = {
  English: {
    heroTitle: "Participate in the Greatest Democracy.",
    heroSub: "SmartVote-AI NRI & Domestic E-Portal. Secure authentication for all citizens.",
    startBtn: "Start Verification",
    aadhaarTitle: "National Aadhaar Check",
    aadharSub: "Enter your 12-digit number for cryptographic validation.",
    bioTitle: "Physiological Matching",
    bioFace: "Facial Recognition",
    bioFinger: "Thumb Identity Scan",
    bioSuccess: "Authentic User Detected",
    bioBtn: "Initiate Verification",
    ballotTitle: "Electronic Ballot",
    selectCand: "Select Candidate",
    confirmTitle: "Confirm Selection",
    confirmBtn: "Confirm My Vote",
    cancelBtn: "Cancel",
    resultsTitle: "National Live Results",
    resultsSub: "Real-time telemetry from ECI Secure Network",
    statusCompleted: "PARTICIPATION COMPLETED",
    restrictedTitle: "Access Restricted",
    restrictedSub: "Identity has already participated. Entry disabled.",
    searchPlaceholder: "Search by candidate name or party symbol...",
    clearSearch: "Clear",
    noResults: "No candidates matched your search",
    recentSearch: "Recent Searches",
    viewProfile: "View Profile",
    manifestoTitle: "Party Manifesto",
    leaderTitle: "Party Leader",
    electionCountdown: "Next Major Election In:",
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
    totalParticipated: "Total Active Voters",
    personalizedConfirm: "Your specific ballot has been securely synchronized with the national ledger.",
    mobileNumber: "Mobile Number",
    mobileSub: "Enter linked number for secure fallback.",
    processIdentity: "Request Secure OTP",
    helpTitle: "SmartVote-AI AI Assistant",
    helpBtn: "Help",
    helpSub: "Context-aware guidance for your current step.",
    voteSuccessMsg: "Vote Recorded Successfully",
    voteSuccessSub: "Thank you for performing your democratic duty.",
    helpSuccess: "Guide ready",
    identityVerify: "Identity Verification",
    verifLevel2: "Verification Level 2",
    faceMatchScore: "Match Score",
    scanningBio: "Scanning Biometrics...",
    cameraReady: "Camera Ready",
    holdToScan: "Scanning...",
    touchToScan: "Place Thumb on Sensor to Start",
    touchpadToScan: "Click to Start Scan",
    securingSession: "Securing Session...",
    unlockBallot: "Unlock Electronic Ballot",
    finalizingAuth: "Finalizing Authentication...",
    voiceCommand: "Voice Command",
    voiceVerified: "Voice Verified",
    listening: "Listening...",
    status: "Status",
    readyToVote: "READY TO VOTE",
    areYouSure: "Are you sure you want to vote for",
    permanentAction: "This action is permanent.",
    confirmMyVote: "Confirm Vote",
    syncingBallot: "Syncing Ballot...",
    recognizedVoice: "Recognized via Voice",
    systemAlert: "System Alert",
    tryAgain: "Try Again",
    dismissBtn: "Dismiss",
    identID: "Identity ID",
    participantPhase: "has already participated in this election phase. Entry disabled.",
    trySearchOther: "Try searching for a different name or party symbol.",
    voiceActiveMsg: "Voice assistance activated. I will guide you through the process.",
    aadharVerifiedMsg: "Aadhar verified. Please scan your face and thumb to proceed.",
    selectedMsg: "selected. Preparing ballot.",
    confirmVoteFor: "Confirm your vote for",
    recordedMsg: "recorded. Thank you for voting.",
    noSpeechSupport: "Speech recognition is not supported in this browser.",
    faceVerifiedMsg: "Identity verified through facial biometrics. Please complete the thumb scan.",
    fallbackFaceMsg: "Face matching complete via fallback sensor. Please proceed with the thumb scan.",
    allBioSecuredMsg: "All biometrics secured. Transitioning to secure electronic ballot.",
    authSuccessMsg: "Authentication successful. Please select your candidate.",
    bioFingerFailed: "Thumb Verification Failed. Please try again.",
    commandNotRecognized: "Command not recognized. Please say Vote for followed by the representative's name.",
    thinking: "Thinking...",
    waitFace: "Please wait for facial recognition to complete.",
    waitFinger: "Please complete the fingerprint scan first.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "How is my vote secured?",
    faqA1: "Your vote is encrypted using national-grade security protocols and linked to a unique anonymous token to ensure privacy.",
    faqQ2: "What if my biometrics fail?",
    faqA2: "The system provides three attempts for biometric matching. If all fail, you can request manual verification via your local election officer.",
    faqQ3: "Can I change my vote?",
    faqA3: "No. For security reasons, once a vote is cast and recorded in the digital ballot box, it is final and irrevocable.",
    faqQ4: "Is voice data recorded?",
    faqA4: "No. Voice commands are processed locally for navigation and are never stored on the central servers.",
    otpTitle: "OTP Verification",
    otpSub: "Enter the 6-digit code sent to your linked mobile number.",
    verifyOtp: "Verify OTP",
    otpSuccess: "Mobile Identity Verified",
    resendOtp: "Resend OTP",
    voiceStyle: "Voice Style",
    formal: "Formal",
    cheerful: "Cheerful",
  },
  Hindi: {
    heroTitle: "महान लोकतंत्र में भाग लें।",
    heroSub: "SmartVote-AI एनआरआई और घरेलू ई-पोर्टल। सभी नागरिकों के लिए सुरक्षित प्रमाणीकरण।",
    electionCountdown: "अगला बड़ा चुनाव:",
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    totalParticipated: "कुल सक्रिय मतदाता",
    personalizedConfirm: "आपका विशिष्ट मतपत्र सुरक्षित रूप से राष्ट्रीय बहीखाते के साथ समन्वित किया गया है।",
    recentSearch: "हाल की खोजें",
    viewProfile: "प्रोफ़ाइल देखें",
    manifestoTitle: "पार्टी घोषणापत्र",
    leaderTitle: "पार्टी नेता",
    startBtn: "सत्यापन शुरू करें",
    aadhaarTitle: "राष्ट्रीय आधार जांच",
    aadhaarSub: "क्रिप्टोग्राफिक सत्यापन के लिए अपना 12-अंकों का नंबर दर्ज करें।",
    bioTitle: "शारीरिक मिलान",
    bioFace: "चेहरा पहचान",
    bioFinger: "फिंगरप्रिंट स्कैन",
    bioSuccess: "असली उपयोगकर्ता की पहचान हुई",
    bioBtn: "सत्यापन शुरू करें",
    ballotTitle: "इलेक्ट्रॉनिक मतपत्र",
    selectCand: "उम्मीदवार चुनें",
    confirmTitle: "चयन की पुष्टि करें",
    confirmBtn: "अपने वोट की पुष्टि करें",
    cancelBtn: "रद्द करें",
    resultsTitle: "राष्ट्रीय लाइव परिणाम",
    resultsSub: "चुनाव आयोग सुरक्षित नेटवर्क से रीयल-टाइम डेटा",
    statusCompleted: "भागीदारी पूरी हुई",
    restrictedTitle: "प्रवेश प्रतिबंधित",
    restrictedSub: "इस पहचान के साथ पहले ही मतदान किया जा चुका है।",
    searchPlaceholder: "नाम या पार्टी चिन्ह से खोजें...",
    clearSearch: "साफ़ करें",
    noResults: "आपकी खोज से कोई उम्मीदवार मेल नहीं खाया",
    helpTitle: "SmartVote-AI एआई सहायक",
    helpBtn: "सहायता",
    helpSub: "आपके वर्तमान चरण के लिए सहायता।",
    voteSuccessMsg: "वोट सफलतापूर्वक दर्ज किया गया",
    voteSuccessSub: "अपने लोकतांत्रिक कर्तव्य का पालन करने के लिए धन्यवाद।",
    liveParticipation: "वैश्विक लाइव भागीदारी",
    identityVerify: "पहचान सत्यापन",
    verifLevel2: "सत्यापन स्तर 2",
    faceMatchScore: "मैच स्कोर",
    scanningBio: "बायोमेट्रिक्स स्कैन किया जा रहा है...",
    cameraReady: "कैमरा तैयार है",
    holdToScan: "स्कैन हो रहा है...",
    touchToScan: "स्कैन शुरू करने के लिए स्पर्श करें",
    touchpadToScan: "स्कैन शुरू करने के लिए क्लिक करें",
    securingSession: "सत्र सुरक्षित किया जा रहा है...",
    unlockBallot: "इलेक्ट्रॉनिक मतपत्र अनलॉक करें",
    finalizingAuth: "प्रमाणीकरण अंतिम रूप दिया जा रहा है...",
    voiceCommand: "आवाज कमांड",
    voiceVerified: "आवाज सत्यापित",
    listening: "सुन रहा हूँ...",
    status: "स्थिति",
    readyToVote: "मतदान के लिए तैयार",
    areYouSure: "क्या आप वाकई वोट देना चाहते हैं",
    permanentAction: "यह कार्रवाई स्थायी है।",
    confirmMyVote: "वोट की पुष्टि करें",
    syncingBallot: "मतपत्र सिंक किया जा रहा है...",
    recognizedVoice: "आवाज के माध्यम से पहचाना गया",
    systemAlert: "सिस्टम अलर्ट",
    tryAgain: "पुनः प्रयास करें",
    dismissBtn: "खारिज करें",
    identID: "पहचान आईडी",
    participantPhase: "ने पहले ही इस चुनाव चरण में भाग लिया है। प्रवेश अक्षम।",
    trySearchOther: "किसी भिन्न नाम या पार्टी चिन्ह को खोजने का प्रयास करें।",
    voiceActiveMsg: "आवाज सहायता सक्रिय हो गई है। मैं प्रक्रिया में आपका मार्गदर्शन करूँगा।",
    aadhaarVerifiedMsg: "आधार सत्यापित। आगे बढ़ने के लिए कृपया अपना चेहरा और उंगली स्कैन करें।",
    selectedMsg: "चयनित। मतपत्र तैयार किया जा रहा है।",
    confirmVoteFor: "अपने वोट की पुष्टि करें",
    recordedMsg: "दर्ज किया गया। मतदान के लिए धन्यवाद।",
    noSpeechSupport: "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है।",
    faceVerifiedMsg: "चेहरे की पहचान के माध्यम से पहचान सत्यापित। कृपया फिंगरप्रिंट स्कैन पूरा करें।",
    fallbackFaceMsg: "फ़ॉलबैक सेंसर के माध्यम से चेहरा मिलान पूरा हुआ। कृपया फिंगरप्रिंट स्कैन के साथ आगे बढ़ें।",
    allBioSecuredMsg: "सभी बायोमेट्रिक्स सुरक्षित। सुरक्षित इलेक्ट्रॉनिक मतपत्र की ओर बढ़ रहे हैं।",
    authSuccessMsg: "प्रमाणीकरण सफल। कृपया अपना उम्मीदवार चुनें।",
    bioFingerFailed: "फिंगरप्रिंट सत्यापन विफल रहा। कृपया पुनः प्रयास करें।",
    commandNotRecognized: "कमांड पहचानी नहीं गई। कृपया 'वोट फॉर' के बाद प्रतिनिधि का नाम बोलें।",
    thinking: "सोच रहा हूँ...",
    waitFace: "कृपया चेहरे की पहचान पूरी होने तक प्रतीक्षा करें।",
    waitFinger: "कृपया पहले फिंगरप्रिंट स्कैन पूरा करें।",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqQ1: "मेरा वोट कैसे सुरक्षित है?",
    faqA1: "आपका वोट राष्ट्रीय स्तर के सुरक्षा प्रोटोकॉल का उपयोग करके एन्क्रिप्ट किया गया है और गोपनीयता सुनिश्चित करने के लिए एक अद्वितीय अनाम टोकन से जुड़ा है।",
    faqQ2: "यदि मेरा बायोमेट्रिक्स विफल हो जाता है तो क्या होगा?",
    faqA2: "सिस्टम बायोमेट्रिक मिलान के लिए तीन प्रयास प्रदान करता है। यदि सभी विफल रहते हैं, तो आप अपने स्थानीय चुनाव अधिकारी के माध्यम से मैन्युअल सत्यापन का अनुरोध कर सकते हैं।",
    faqQ3: "क्या मैं अपना वोट बदल सकता हूँ?",
    faqA3: "नहीं। सुरक्षा कारणों से, एक बार जब वोट डाला जाता है और डिजिटल मतपेटी में दर्ज किया जाता है, तो यह अंतिम और अपरिवर्तनीय होता है।",
    faqQ4: "क्या वॉयस डेटा रिकॉर्ड किया जाता है?",
    faqA4: "नहीं। वॉयस कमांड नेविगेशन के लिए स्थानीय स्तर पर संसाधित किए जाते हैं और केंद्रीय सर्वर पर कभी संग्रहीत नहीं किए जाते हैं।",
    otpTitle: "ओटीपी सत्यापन",
    otpSub: "आपके लिंक किए गए मोबाइल नंबर पर भेजा गया 6-अंकीय कोड दर्ज करें।",
    verifyOtp: "ओटीपी सत्यापित करें",
    otpSuccess: "मोबाइल पहचान सत्यापित",
    resendOtp: "ओटीपी पुन: भेजें",
    voiceStyle: "आवाज शैली",
    formal: "औपचारिक",
    cheerful: "हंसमुख",
  },
  Telugu: {
    heroTitle: "గొప్ప ప్రజాస్వామ్యంలో భాగస్వామ్యం వహించండి.",
    heroSub: "SmartVote-AI NRI & డొమెస్టిక్ ఈ-పోర్టల్. పౌరులందరికీ సురక్షితమైన ప్రమాణీకరణ.",
    electionCountdown: "తదుపరి ప్రధాన ఎన్నికలు:",
    days: "రోజులు",
    hours: "గంటలు",
    minutes: "నిమిషాలు",
    seconds: "సెకన్లు",
    totalParticipated: "మొత్తం చురుకైన ఓటర్లు",
    personalizedConfirm: "మీ బ్యాలెట్ సురక్షితంగా జాతీయ రికార్డుతో అనుసంధానించబడింది.",
    recentSearch: "ఇటీవలి శోధనలు",
    viewProfile: "ప్రొఫైల్ చూడండి",
    manifestoTitle: "పార్టీ మేనిఫెస్టో",
    leaderTitle: "పార్టీ నాయకుడు",
    startBtn: "ధృవీకరణను ప్రారంభించండి",
    aadharTitle: "జాతీయ ఆధార్ తనిఖీ",
    aadharSub: "ధృవీకరణ కోసం మీ 12 అంకెల సంఖ్యను నమోదు చేయండి.",
    bioTitle: "శారీరక సరిపోలిక",
    bioFace: "ముఖ గుర్తింపు",
    bioFinger: "వేలిముద్ర స్కాన్",
    bioSuccess: "వినియోగదారు ధృవీకరించబడ్డారు",
    bioBtn: "ధృవీకరణను ప్రారంభించండి",
    ballotTitle: "ఎలక్ట్రానిక్ బ్యాలెట్",
    selectCand: "అభ్యర్థిని ఎంచుకోండి",
    confirmTitle: "ఎంపికను నిర్ధారించండి",
    confirmBtn: "నా ఓటును నిర్ధారించండి",
    cancelBtn: "రద్దు చేయి",
    resultsTitle: "జాతీయ ప్రత్యక్ష ఫలితాలు",
    resultsSub: "ECI నెట్‌వర్క్ నుండి ప్రత్యక్ష డేటా",
    statusCompleted: "భాగస్వామ్యం పూర్తయింది",
    restrictedTitle: "ప్రవేశం పరిమితం చేయబడింది",
    restrictedSub: "ఈ గుర్తింపుతో ఇప్పటికే ఓటు వేయబడింది.",
    searchPlaceholder: "పేరు లేదా పార్టీ గుర్తు ద్వారా వెతకండి...",
    clearSearch: "తుడిచివేయి",
    noResults: "మీ శోధనకు అభ్యర్థులు ఎవరూ సరిపోలలేదు",
    helpTitle: "SmartVote-AI AI సహాయకుడు",
    helpBtn: "సహాయం",
    helpSub: "మీ ప్రస్తుత దశ కోసం మార్గదర్శకత్వం.",
    voteSuccessMsg: "ఓటు విజయవంతంగా నమోదైంది",
    voteSuccessSub: "మీ ప్రజాస్వామ్య బాధ్యతను నెరవేర్చినందుకు ధన్యవాదాలు.",
    liveParticipation: "ప్రపంచ ప్రత్యక్ష భాగస్వామ్యం",
    identityVerify: "గుర్తింపు ధృవీకరణ",
    verifLevel2: "ధృవీకరణ స్థాయి 2",
    faceMatchScore: "సరిపోలిక స్కోరు",
    scanningBio: "బయోమెట్రిక్స్ స్కాన్ చేస్తోంది...",
    cameraReady: "కెమెరా సిద్ధంగా ఉంది",
    holdToScan: "స్కాన్ చేస్తోంది...",
    touchToScan: "స్కాన్ ప్రారంభించడానికి తాకండి",
    touchpadToScan: "స్కాన్ ప్రారంభించడానికి క్లిక్ చేయండి",
    securingSession: "సెషన్‌ను భద్రపరుస్తోంది...",
    unlockBallot: "ఎలక్ట్రానిక్ బ్యాలెట్‌ను అన్‌లాక్ చేయండి",
    finalizingAuth: "ధృవీకరణను పూర్తి చేస్తోంది...",
    voiceCommand: "వాయిస్ కమాండ్",
    voiceVerified: "వాయిస్ ధృవీకరించబడింది",
    listening: "వింటున్నాను...",
    status: "స్థితి",
    readyToVote: "ఓటు వేయడానికి సిద్ధంగా ఉంది",
    areYouSure: "మీరు ఖచ్చితంగా ఓటు వేయాలనుకుంటున్నారా",
    permanentAction: "ఈ చర్య శాశ్వతమైనది.",
    confirmMyVote: "ఓటును నిర్ధారించండి",
    syncingBallot: "బ్యాలెట్‌ను సింక్ చేస్తోంది...",
    recognizedVoice: "వాయిస్ ద్వారా గుర్తించబడింది",
    systemAlert: "సిస్టమ్ హెచ్చరిక",
    tryAgain: "మళ్ళీ ప్రయత్నించండి",
    dismissBtn: "ముగించు",
    identID: "గుర్తింపు ID",
    participantPhase: "ఈ ఎన్నికల దశలో ఇప్పటికే పాల్గొన్నారు. ప్రవేశం నిలిపివేయబడింది.",
    trySearchOther: "వేరే పేరు లేదా పార్టీ గుర్తు కోసం వెతకండి.",
    voiceActiveMsg: "వాయిస్ అసిస్టెన్స్ యాక్టివేట్ చేయబడింది. నేను మీకు ప్రక్రియలో మార్గనిర్దేశం చేస్తాను.",
    aadharVerifiedMsg: "ఆధార్ ధృవీకరించబడింది. కొనసాగడానికి దయచేసి మీ ముఖం మరియు వేలిని స్కాన్ చేయండి.",
    selectedMsg: "ఎంపిక చేయబడింది. బ్యాలెట్ సిద్ధం చేస్తోంది.",
    confirmVoteFor: "ఓటును నిర్ధారించండి",
    recordedMsg: "నమోదైంది. ఓటు వేసినందుకు ధన్యవాదాలు.",
    noSpeechSupport: "ఈ బ్రౌజర్‌లో స్పీచ్ గుర్తింపు మద్దతు ఇవ్వబడదు.",
    faceVerifiedMsg: "ముఖ గుర్తింపు ద్వారా గుర్తింపు ధృవీకరించబడింది. దయచేసి వేలిముద్ర స్కాన్ పూర్తి చేయండి.",
    fallbackFaceMsg: "ఫాల్‌బ్యాక్ సెన్సార్ ద్వారా ముఖం సరిపోలిక పూర్తయింది. దయచేసి వేలిముద్ర స్కాన్ చేయండి.",
    allBioSecuredMsg: "అన్ని బయోమెట్రిక్స్ భద్రపరచబడ్డాయి. సురక్షిత ఎలక్ట్రానిక్ బ్యాలెట్‌కు మారుతోంది.",
    authSuccessMsg: "ధృవీకరణ విజయవంతమైంది. దయచేసి మీ అభ్యర్థిని ఎంచుకోండి.",
    bioFingerFailed: "వేలిముద్ర ధృవీకరణ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.",
    commandNotRecognized: "కమాండ్ గుర్తించబడలేదు. దయచేసి అభ్యర్థి పేరు చెప్పి ఓటు వేయండి.",
    thinking: "ఆలోచిస్తున్నాను...",
    waitFace: "ముఖ గుర్తింపు పూర్తయ్యే వరకు వేచి ఉండండి.",
    waitFinger: "దయచేసి ముందుగా వేలిముద్ర స్కాన్ చేయండి.",
    faqTitle: "తరచుగా అడిగే ప్రశ్నలు",
    faqQ1: "నా ఓటు ఎలా భద్రపరచబడింది?",
    faqA1: "గోప్యతను నిర్ధారించడానికి మీ ఓటు జాతీయ-స్థాయి భద్రతా ప్రోటోకాల్‌లను ఉపయోగించి ఎన్‌క్రిప్ట్ చేయబడింది మరియు ప్రత్యేకమైన అజ్ఞాత టోకెన్‌కు లింక్ చేయబడింది.",
    faqQ2: "నా బయోమెట్రిక్స్ విఫలమైతే ఏమిటి?",
    faqA2: "సిస్టమ్ బయోమెట్రిక్ మ్యాచింగ్ కోసం మూడు ప్రయత్నాలను అందిస్తుంది. అన్నీ విఫలమైతే, మీరు మీ స్థానిక ఎన్నికల అధికారి ద్వారా మాన్యువల్ వెరిఫికేషన్‌ను అభ్యర్థించవచ్చు.",
    faqQ3: "నేను నా ఓటును మార్చుకోగలనా?",
    faqA3: "లేదు. భద్రతా కారణాల దృష్ట్యా, ఒకసారి ఓటు వేసి డిజిటల్ బ్యాలెట్ బాక్స్‌లో రికార్డ్ అయిన తర్వాత, అది తుది మరియు మార్చలేనిది.",
    faqQ4: "వాయిస్ డేటా రికార్డ్ చేయబడుతుందా?",
    faqA4: "లేదు. వాయిస్ కమాండ్‌లు నావిగేషన్ కోసం స్థానికంగా ప్రాసెస్ చేయబడతాయి మరియు కేంద్ర సర్వర్‌లలో ఎప్పుడూ భద్రపరచబడవు.",
    voiceStyle: "వాయిస్ శైలి",
    formal: "అధికారిక",
    cheerful: "ఉల్లాసంగా",
  },
  Tamil: {
    heroTitle: "சிறந்த ஜனநாயகத்தில் பங்கேற்கவும்.",
    heroSub: "SmartVote-AI என்ஆர்ஐ & உள்நாட்டு மின்-போர்டல். அனைத்து குடிமக்களுக்கும் பாதுகாப்பான அங்கீகாரம்.",
    electionCountdown: "அடுத்த பொதுத் தேர்தல்:",
    days: "நாட்கள்",
    hours: "மணிநேரம்",
    minutes: "நிமிடங்கள்",
    seconds: "வினாடிகள்",
    totalParticipated: "மொத்த செயலில் உள்ள வாக்காளர்கள்",
    personalizedConfirm: "உங்கள் வாக்குச்சீட்டு தேசிய பதிவேட்டுடன் பாதுகாப்பாக இணைக்கப்பட்டுள்ளது.",
    recentSearch: "சமீபத்திய தேடல்கள்",
    viewProfile: "சுயவிவரத்தைக் காண்க",
    manifestoTitle: "கட்சி கொள்கை அறிக்கை",
    leaderTitle: "கட்சித் தலைவர்",
    startBtn: "சரிபார்ப்பைத் தொடங்கவும்",
    aadharTitle: "தேசிய ஆதார் சரிபார்ப்பு",
    aadharSub: "சரிபார்ப்பிற்காக உங்கள் 12 இலக்க எண்ணை உள்ளிடவும்.",
    bioTitle: "உடலியல் பொருத்தம்",
    bioFace: "முக அங்கீகாரம்",
    bioFinger: "பெருவிரல் அடையாளம்",
    bioSuccess: "உண்மையான பயனர் கண்டறியப்பட்டார்",
    bioBtn: "சரிபார்ப்பைத் தொடங்கவும்",
    ballotTitle: "மின்னணு வாக்குச் சீட்டு",
    selectCand: "வேட்பாளரைத் தேர்ந்தெடுக்கவும்",
    confirmTitle: "தேர்வு உறுதிப்படுத்தவும்",
    confirmBtn: "எனது வாக்கை உறுதிப்படுத்தவும்",
    cancelBtn: "ரத்து செய்",
    resultsTitle: "தேசிய நேரடி முடிவுகள்",
    resultsSub: "தேர்தல் ஆணையத்தின் பாதுகாப்பான நெட்வொர்க்கிலிருந்து நிகழ்நேரத் தரவு",
    statusCompleted: "பங்கேற்பு முடிந்தது",
    restrictedTitle: "அனுமதி மறுக்கப்பட்டது",
    restrictedSub: "இந்த அடையாளத்துடன் ஏற்கனவே வாக்குச் செலுத்தப்பட்டுள்ளது.",
    searchPlaceholder: "பெயர் அல்லது கட்சி சின்னம் மூலம் தேடுக...",
    clearSearch: "அழி",
    noResults: "உங்கள் தேடலுடன் எந்த வேட்பாளர்களும் பொருந்தவில்லை",
    helpTitle: "SmartVote-AI AI உதவியாளர்",
    helpBtn: "உதவி",
    helpSub: "உங்கள் தற்போதைய படிநிலைக்கான வழிகாட்டுதல்.",
    voteSuccessMsg: "வாக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது",
    voteSuccessSub: "உங்கள் ஜனநாயக கடமையை ஆற்றியதற்கு நன்றி.",
    liveParticipation: "உலகளாவிய நேரடி பங்கேற்பு",
    identityVerify: "அடையாள சரிபார்ப்பு",
    verifLevel2: "சரிபார்ப்பு நிலை 2",
    faceMatchScore: "பொருத்தம் மதிப்பெண்",
    scanningBio: "பயோமெட்ரிக்ஸ் ஸ்கேன் செய்யப்படுகிறது...",
    cameraReady: "கேமரா தயார்",
    holdToScan: "ஸ்கேன் செய்யப்படுகிறது...",
    touchToScan: "தொடங்கி ஸ்கேன் செய்ய பெருவிரலை வைக்கவும்",
    touchpadToScan: "ஸ்கேன் செய்ய கிளிக் செய்யவும்",
    securingSession: "அமர்வு பாதுகாக்கப்படுகிறது...",
    unlockBallot: "மின்னணு வாக்குச் சீட்டைத் திறக்கவும்",
    finalizingAuth: "அங்கீகாரம் இறுதி செய்யப்படுகிறது...",
    voiceCommand: "குரல் கட்டளை",
    voiceVerified: "குரல் சரிபார்க்கப்பட்டது",
    listening: "கேட்கிறது...",
    status: "நிலை",
    readyToVote: "வாக்களிக்கத் தயார்",
    areYouSure: "நீங்கள் நிச்சயமாக வாக்களிக்க விரும்புகிறீர்களா",
    permanentAction: "இந்த நடவடிக்கை நிரந்தரமானது.",
    confirmMyVote: "வாக்கை உறுதிப்படுத்தவும்",
    syncingBallot: "வாக்குச்சீட்டு ஒத்திசைக்கப்படுகிறது...",
    recognizedVoice: "குரல் மூலம் அங்கீகரிக்கப்பட்டது",
    systemAlert: "கணினி எச்சரிக்கை",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    dismissBtn: "விலக்கு",
    identID: "அடையாள ஐடி",
    participantPhase: "இந்தத் தேர்தல் கட்டத்தில் ஏற்கனவே பங்கேற்றுள்ளார். நுழைவு முடக்கப்பட்டது.",
    trySearchOther: "வேறு பெயர் அல்லது கட்சி சின்னத்தைத் தேட முயற்சிக்கவும்.",
    voiceActiveMsg: "குரல் உதவி செயல்படுத்தப்பட்டது. செயல்முறை மூலம் நான் உங்களுக்கு வழிகாட்டுவேன்.",
    aadharVerifiedMsg: "ஆதார் சரிபார்க்கப்பட்டது. தொடர உங்கள் முகம் மற்றும் பெருவிரலை ஸ்கேன் செய்யவும்.",
    selectedMsg: "தேர்ந்தெடுக்கப்பட்டது. வாக்குச்சீட்டு தயார் செய்யப்படுகிறது.",
    confirmVoteFor: "வாக்கை உறுதிப்படுத்தவும்",
    recordedMsg: "பதிவு செய்யப்பட்டது. வாக்களித்ததற்கு நன்றி.",
    noSpeechSupport: "இந்த உலாவியில் பேச்சு அங்கீகாரம் ஆதரிக்கப்படவில்லை.",
    faceVerifiedMsg: "முக பயோமெட்ரிக்ஸ் மூலம் அடையாளம் சரிபார்க்கப்பட்டது. பெருவிரல் ஸ்கேனை முடிக்கவும்.",
    fallbackFaceMsg: "ஃபால்பேக் சென்சார் மூலம் முகப் பொருத்தம் முடிந்தது. பெருவிரல் ஸ்கேனைத் தொடரவும்.",
    allBioSecuredMsg: "அனைத்து பயோமெட்ரிக்குகளும் பாதுகாக்கப்பட்டன. மின்னணு வாக்குச்சீட்டுக்கு மாறுகிறது.",
    authSuccessMsg: "அங்கீகாரம் வெற்றிகரமாக முடிந்தது. வேட்பாளரைத் தேர்ந்தெடுக்கவும்.",
    bioFingerFailed: "பெருவிரல் சரிபார்ப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
    commandNotRecognized: "கட்டளை அங்கீகரிக்கப்படவில்லை. வேட்பாளர் பெயரைச் சொல்லி வாக்களிக்கவும்.",
    thinking: "சிந்திக்கிறது...",
    waitFace: "முக அங்கீகாரம் முடியும் வரை காத்திருக்கவும்.",
    waitFinger: "முதலில் கைரேகை ஸ்கேனை முடிக்கவும்.",
    faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqQ1: "எனது வாக்கு எப்படி பாதுகாக்கப்படுகிறது?",
    faqA1: "உங்கள் வாக்கு தேசிய தர பாதுகாப்பு நெறிமுறைகளைப் பயன்படுத்தி குறியாக்கம் செய்யப்பட்டுள்ளது மற்றும் தனியுரிமையை உறுதிப்படுத்த தனித்துவமான அநாமதேய டோக்கனுடன் இணைக்கப்பட்டுள்ளது.",
    faqQ2: "எனது பயோமெட்ரிக்ஸ் தோல்வியுற்றால் என்ன செய்வது?",
    faqA2: "பயோமெட்ரிக் பொருத்தத்திற்கு மூன்று முயற்சிகளை கணினி வழங்குகிறது. அனைத்தும் தோல்வியுற்றால், உங்கள் உள்ளூர் தேர்தல் அதிகாரி மூலம் கைமுறை சரிபார்ப்பைக் கோரலாம்.",
    faqQ3: "எனது வாக்கை மாற்ற முடியுமா?",
    faqA3: "இல்லை. பாதுகாப்பு காரணங்களுக்காக, ஒருமுறை வாக்கு அளிக்கப்பட்டு டிஜிட்டல் வாக்குப்பெட்டியில் பதிவு செய்யப்பட்டால், அது இறுதியானது மற்றும் மாற்ற முடியாதது.",
    faqQ4: "குரல் தரவு பதிவு செய்யப்படுகிறதா?",
    faqA4: "இல்லை. குரல் கட்டளைகள் வழிசெலுத்தலுக்கு உள்நாட்டில் செயலாக்கப்படுகின்றன மற்றும் மத்திய சேவையகங்களில் ஒருபோதும் சேமிக்கப்படாது.",
    voiceStyle: "குரல் பாணி",
    formal: "முறைசாரா",
    cheerful: "மகிழ்ச்சியான",
  },
  Marathi: {
    heroTitle: "महान लोकशाहीत सहभागी व्हा.",
    heroSub: "SmartVote-AI एनआरआय आणि घरगुती ई-पोर्टल। सर्व नागरिकांसाठी सुरक्षित प्रमाणीकरण।",
    electionCountdown: "पुढील मोठी निवडणूक:",
    days: "दिवस",
    hours: "तास",
    minutes: "मिनिटे",
    seconds: "सेकंद",
    totalParticipated: "एकूण सक्रिय मतदार",
    personalizedConfirm: "तुमची मतपत्रिका सुरक्षितपणे राष्ट्रीय नोंदवहीशी जोडली गेली आहे।",
    recentSearch: "अलीकडील शोध",
    viewProfile: "प्रोफाइल पहा",
    manifestoTitle: "पक्ष जाहीरनामा",
    leaderTitle: "पक्ष नेता",
    startBtn: "सत्यापन सुरू करा",
    aadharTitle: "राष्ट्रीय आधार तपासणी",
    aadharSub: "सत्यापनासाठी तुमचा 12-अंकी क्रमांक प्रविष्ट करा.",
    bioTitle: "शारीरिक जुळणी",
    bioFace: "चेहरा ओळख",
    bioFinger: "फिंगरप्रिंट स्कॅन",
    bioSuccess: "खरा वापरकर्ता आढळला",
    bioBtn: "सत्यापन सुरू करा",
    ballotTitle: "इलेक्ट्रॉनिक मतपत्रिका",
    selectCand: "उमेदवार निवडा",
    confirmTitle: "निवडीची पुष्टी करा",
    confirmBtn: "माझ्या मताची पुष्टी करा",
    cancelBtn: "रद्द करा",
    resultsTitle: "राष्ट्रीय थेट निकाल",
    resultsSub: "निवडणूक आयोगाच्या सुरक्षित नेटवर्कवरून रिअल-टाइम डेटा",
    statusCompleted: "सहभाग पूर्ण झाला",
    restrictedTitle: "प्रवेश प्रतिबंधित",
    restrictedSub: "या ओळखीसह आधीच मतदान झाले आहे.",
    searchPlaceholder: "नाव किंवा पक्ष चिन्हानुसार शोधा...",
    clearSearch: "साफ करा",
    noResults: "तुमच्या शोधाशी कोणताही उमेदवार जुळला नाही",
    helpTitle: "SmartVote-AI एआय सहायक",
    helpBtn: "मदत",
    helpSub: "तुमच्या सध्याच्या चरणासाठी मार्गदर्शन.",
    voteSuccessMsg: "मत यशस्वीपणे नोंदवले गेले",
    voteSuccessSub: "तुमचे लोकशाही कर्तव्य पार पाडल्याबद्दल धन्यवाद.",
    liveParticipation: "जागतिक थेट सहभाग",
    identityVerify: "ओळख सत्यापन",
    verifLevel2: "सत्यापन स्तर २",
    faceMatchScore: "मॅच स्कोर",
    scanningBio: "बायोमेट्रिक्स स्कॅन केले जात आहे...",
    cameraReady: "कॅमेरा तयार आहे",
    holdToScan: "स्कॅन केले जात आहे...",
    touchToScan: "स्कॅन सुरू करण्यासाठी स्पर्श करा",
    touchpadToScan: "स्कॅन सुरू करण्यासाठी क्लिक करा",
    securingSession: "सत्र सुरक्षित केले जात आहे...",
    unlockBallot: "इलेक्ट्रॉनिक मतपत्रिका अनलॉक करा",
    finalizingAuth: "प्रमाणीकरण अंतिम केले जात आहे...",
    bioFingerFailed: "फिंगरप्रिंट सत्यापन अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.",
    voiceCommand: "व्हॉइस कमांड",
    voiceVerified: "ध्वनी सत्यापित",
    listening: "ऐकत आहे...",
    status: "स्थिती",
    readyToVote: "मतदानासाठी तयार",
    areYouSure: "तुम्हाला खात्री आहे की तुम्हाला मत द्यायचे आहे",
    permanentAction: "ही कारवाई कायमस्वरूपी आहे.",
    confirmMyVote: "मताची पुष्टी करा",
    syncingBallot: "मतपत्रिका सिंक होत आहे...",
    recognizedVoice: "आवाजाद्वारे ओळखले गेले",
    systemAlert: "सिस्टम अलर्ट",
    tryAgain: "पुन्हा प्रयत्न करा",
    dismissBtn: "काढून टाका",
    identID: "ओळख आयडी",
    participantPhase: "ने आधीच या निवडणूक टप्प्यात भाग घेतला आहे. प्रवेश अक्षम.",
    trySearchOther: "दुसरे नाव किंवा पक्ष चिन्ह शोधण्याचा प्रयत्न करा.",
    voiceActiveMsg: "व्हॉइस असिस्टन्स सक्रिय झाले आहे. मी तुम्हाला प्रक्रियेत मार्गदर्शन करेन.",
    aadharVerifiedMsg: "आधार सत्यापित. पुढे जाण्यासाठी कृपया आपला चेहरा आणि बोट स्कॅन करा.",
    selectedMsg: "निवडले. मतपत्रिका तयार करत आहे.",
    confirmVoteFor: "मताची पुष्टी करा",
    recordedMsg: "नोंदवले गेले. मतदानाबद्दल धन्यवाद.",
    noSpeechSupport: "या ब्राउझरमध्ये स्पीच रिकग्निशन समर्थित नाही.",
    faqTitle: "वारंवार विचारले जाणारे प्रश्न",
    faqQ1: "माझे मत कसे सुरक्षित आहे?",
    faqA1: "तुमचे मत राष्ट्रीय दर्जाच्या सुरक्षा प्रोटोकॉलचा वापर करून एनक्रिप्ट केलेले आहे आणि गोपनीयता सुनिश्चित करण्यासाठी एका अद्वितीय अनामित टोकनशी जोडलेले आहे.",
    faqQ2: "माझे बायोमेट्रिक्स अयशस्वी झाल्यास काय होईल?",
    faqA2: "सिस्टम बायोमेट्रिक मॅचिंगसाठी तीन प्रयत्न प्रदान करते. सर्व अयशस्वी झाल्यास, आपण आपल्या स्थानिक निवडणूक अधिकाऱ्यामार्फत मॅन्युअल सत्यापनाची विनंती करू शकता.",
    faqQ3: "मी माझे मत बदलू शकतो का?",
    faqA3: "नाही. सुरक्षेच्या कारणास्तव, एकदा मत टाकले आणि डिजिटल मतपेटीमध्ये नोंदवले गेले की, ते अंतिम आणि अपरिवर्तनीय असते.",
    faqQ4: "व्हॉइस डेटा रेकॉर्ड केला जातो का?",
    faqA4: "नाही. व्हॉइस कमांड्स नेव्हिगेशनसाठी स्थानिक पातळीवर प्रक्रिया केल्या जातात आणि मध्यवर्ती सर्व्हरवर कधीही साठवल्या जात नाहीत.",
    voiceStyle: "व्हॉइस स्टाईल",
    formal: "औपचारिक",
    cheerful: "आनंदी",
  },
  Malayalam: {
    heroTitle: "മഹത്തായ ജനാധിപത്യത്തിൽ പങ്കുചേരുക.",
    heroSub: "SmartVote-AI പ്രവാസി & ആഭ്യന്തര ഇ-പോർട്ടൽ. എല്ലാ പൗരന്മാർക്കും സുരക്ഷിതമായ ആധികാരികത.",
    electionCountdown: "അടുത്ത പ്രധാന തിരഞ്ഞെടുപ്പ്:",
    days: "ദിവസങ്ങൾ",
    hours: "മണിക്കൂർ",
    minutes: "മിനിറ്റ്",
    seconds: "സെക്കൻഡ്",
    totalParticipated: "ആകെ സജീവ വോട്ടർമാർ",
    personalizedConfirm: "നിങ്ങളുടെ ബാലറ്റ് ദേശീയ ലഡ്ജറുമായി സുരക്ഷിതമായി സമന്വയിപ്പിച്ചിരിക്കുന്നു.",
    recentSearch: "സമീപകാല തിരയലുകൾ",
    viewProfile: "പ്രൊഫൈൽ കാണുക",
    manifestoTitle: "പാർട്ടി മാനിഫെസ്റ്റോ",
    leaderTitle: "പാർട്ടി നേതാവ്",
    startBtn: "പരിശോധന ആരംഭിക്കുക",
    aadharTitle: "ദേശീയ ആധാർ പരിശോധന",
    aadharSub: "പരിശോധനയ്ക്കായി നിങ്ങളുടെ 12 അക്ക നമ്പർ നൽകുക.",
    bioTitle: "ശാരീരിക പൊരുത്തം",
    bioFace: "മുഖം തിരിച്ചറിയൽ",
    bioFinger: "വിരലടയാള സ്കാൻ",
    bioSuccess: "യഥാർത്ഥ ഉപയോക്താവിനെ കണ്ടെത്തി",
    bioBtn: "പരിശോധന ആരംഭിക്കുക",
    ballotTitle: "ഇലക്ട്രോണിക് ബാലറ്റ്",
    selectCand: "സ്ഥാനാർത്ഥിയെ തിരഞ്ഞെടുക്കുക",
    confirmTitle: "തിരഞ്ഞെടുപ്പ് സ്ഥിരീകരിക്കുക",
    confirmBtn: "എന്റെ വോട്ട് സ്ഥിരീകരിക്കുക",
    cancelBtn: "റദ്ദാക്കുക",
    resultsTitle: "ദേശീയ തത്സമയ ഫലങ്ങൾ",
    resultsSub: "തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ നെറ്റ്‌വർക്കിൽ നിന്നുള്ള തത്സമയ വിവരങ്ങൾ",
    statusCompleted: "പങ്കാളിത്തം പൂർത്തിയായി",
    restrictedTitle: "പ്രവേശനം നിയന്ത്രിച്ചിരിക്കുന്നു",
    restrictedSub: "ഈ ഐഡന്റിറ്റി ഉപയോഗിച്ച് ഇതിനകം വോട്ട് ചെയ്തു.",
    searchPlaceholder: "പേര് അല്ലെങ്കിൽ പാർട്ടി ചിഹ്നം വഴി തിരയുക...",
    clearSearch: "ശൂന്യമാക്കുക",
    noResults: "നിങ്ങളുടെ തിരയലിന് അനുയോജ്യമായ സ്ഥാനാർത്ഥികളില്ല",
    helpTitle: "SmartVote-AI AI അസിസ്റ്റന്റ്",
    helpBtn: "സഹായം",
    helpSub: "നിങ്ങളുടെ നിലവിലെ ഘട്ടത്തിനായുള്ള മാർഗനിർദ്ദേശം.",
    voteSuccessMsg: "വോട്ട് വിജയകരമായി രേഖപ്പെടുത്തി",
    voteSuccessSub: "നിങ്ങളുടെ ജനാധിപത്യ കടമ നിർവഹിച്ചതിന് നന്ദി.",
    liveParticipation: "ആഗോള തത്സമയ പങ്കാളിത്തം",
    identityVerify: "തിരിച്ചറിയൽ പരിശോധന",
    verifLevel2: "പരിശോധനാ നില 2",
    faceMatchScore: "മാച്ച് സ്കോർ",
    scanningBio: "ബയോമെട്രിക്സ് സ്കാൻ ചെയ്യുന്നു...",
    cameraReady: "ക്യാമറ തയ്യാറാണ്",
    holdToScan: "സ്കാൻ ചെയ്യുന്നു...",
    touchToScan: "സ്കാൻ ചെയ്യാൻ സ്പർശിക്കുക",
    touchpadToScan: "സ്കാൻ ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക",
    securingSession: "സെഷൻ സുരക്ഷിതമാക്കുന്നു...",
    unlockBallot: "ഇലക്ട്രോണിക് ബാലറ്റ് അൺലോക്ക് ചെയ്യുക",
    finalizingAuth: "അംഗീകാരം അന്തിമമാക്കുന്നു...",
    voiceCommand: "വോയിസ് കമാൻഡ്",
    voiceVerified: "വോയിസ് പരിശോധിച്ചു",
    listening: "ശ്രദ്ധിക്കുന്നു...",
    status: "നില",
    readyToVote: "വോട്ട് ചെയ്യാൻ തയ്യാർ",
    areYouSure: "നിങ്ങൾക്ക് വോട്ട് ചെയ്യണമെന്ന് ഉറപ്പാണോ",
    permanentAction: "ഈ നടപടി ശാശ്വതമാണ്.",
    confirmMyVote: "വോട്ട് സ്ഥിരീകരിക്കുക",
    syncingBallot: "ബാലറ്റ് സമന്വയിപ്പിക്കുന്നു...",
    recognizedVoice: "ശബ്ദത്തിലൂടെ തിരിച്ചറിഞ്ഞു",
    systemAlert: "സിസ്റ്റം അലേർട്ട്",
    tryAgain: "വീണ്ടും ശ്രമിക്കുക",
    dismissBtn: "ഒഴിവാക്കുക",
    identID: "തിരിച്ചറിയൽ ഐഡി",
    participantPhase: "ഈ തിരഞ്ഞെടുപ്പ് ഘട്ടത്തിൽ ഇതിനകം പങ്കെടുത്തു. പ്രവേശനം തടഞ്ഞു.",
    trySearchOther: "മറ്റൊരു പേരോ പാർട്ടി ചിഹ്നമോ തിരയാൻ ശ്രമിക്കുക.",
    voiceActiveMsg: "വോയിസ് അസിസ്റ്റൻസ് സജീവമാക്കി. പ്രക്രിയയിലൂടെ ഞാൻ നിങ്ങളെ നയിക്കും.",
    aadharVerifiedMsg: "ആധാർ പരിശോധിച്ചു. തുടരുന്നതിന് ദയവായി നിങ്ങളുടെ മുഖവും വിരലും സ്കാൻ ചെയ്യുക.",
    selectedMsg: "തിരഞ്ഞെടുത്തു. ബാലറ്റ് തയ്യാറാക്കുന്നു.",
    confirmVoteFor: "വോട്ട് സ്ഥിരീകരിക്കുക",
    recordedMsg: "രേഖപ്പെടുത്തി. വോട്ട് ചെയ്തതിന് നന്ദി.",
    bioFingerFailed: "വിരലടയാള പരിശോധന പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    noSpeechSupport: "ഈ ബ്രൗസറിൽ സംഭാഷണ തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല.",
    faqTitle: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",
    faqQ1: "എന്റെ വോട്ട് എങ്ങനെ സുരക്ഷിതമായിരിക്കുന്നു?",
    faqA1: "നിങ്ങളുടെ വോട്ട് ദേശീയ നിലവാരത്തിലുള്ള സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ ഉപയോഗിച്ച് എൻക്രിപ്റ്റ് ചെയ്തതും സ്വകാര്യത ഉറപ്പാക്കുന്നതിന് അദ്വിതീയമായ ഒരു അജ്ഞാത ടോക്കണുമായി ലിങ്ക് ചെയ്തതുമാണ്.",
    faqQ2: "എന്റെ ബയോമെട്രിക്സ് പരാജയപ്പെട്ടാൽ എന്ത് സംഭവിക്കും?",
    faqA2: "ബയോമെട്രിക് പൊരുത്തപ്പെടുത്തലിനായി സിസ്റ്റം മൂന്ന് ശ്രമങ്ങൾ നൽകുന്നു. എല്ലാം പരാജയപ്പെടുകയാണെങ്കിൽ, നിങ്ങളുടെ പ്രാദേശിക തിരഞ്ഞെടുപ്പ് ഉദ്യോഗസ്ഥൻ വഴി നിങ്ങൾക്ക് നേരിട്ടുള്ള പരിശോധന അഭ്യർത്ഥിക്കാം.",
    faqQ3: "എനിക്ക് എന്റെ വോട്ട് മാറ്റാൻ കഴിയുമോ?",
    faqA3: "ഇല്ല. സുരക്ഷാ കാരണങ്ങളാൽ, ഒരു വോട്ട് രേഖപ്പെടുത്തി ഡിജിറ്റൽ ബാലറ്റ് ബോക്സിൽ ഉൾപ്പെടുത്തിക്കഴിഞ്ഞാൽ, അത് അന്തിമവും മാറ്റാൻ കഴിയാത്തതുമാണ്.",
    faqQ4: "വോയ്‌സ് ഡാറ്റ റെക്കോർഡ് ചെയ്യുന്നുണ്ടോ?",
    faqA4: "ഇല്ല. വോയ്‌സ് കമാൻഡുകൾ നാവിഗേഷനായി പ്രാദേശികമായി പ്രോസസ്സ് ചെയ്യുന്നു, അവ ഒരിക്കലും സെൻട്രൽ സെർവറുകളിൽ സംഭരിക്കില്ല.",
    voiceStyle: "വോയിസ് സ്റ്റൈൽ",
    formal: "ഫോർമൽ",
    cheerful: "സന്തോഷകരമായ",
  },
};


const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, name: 'ID Entry' },
    { id: 2, name: 'MFA OTP' },
    { id: 3, name: 'Biometrics' },
    { id: 4, name: 'Voting' }
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
              currentStep >= idx + 1 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50' 
                : 'bg-slate-100 text-slate-400'
            }`}>
              {currentStep > idx + 1 ? <CheckCircle2 size={16} /> : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${
              currentStep >= idx + 1 ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              {step.name}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-4 h-[1px] ${currentStep > idx + 1 ? 'bg-indigo-600' : 'bg-slate-200'} mx-1 hidden sm:block`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ErrorBanner = ({ message, onRetry, onClose }: { message: string, onRetry?: () => void, onClose: () => void }) => {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, y: -10 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -10 }}
      className="w-full overflow-hidden mb-6"
    >
      <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-red-600">
            <div className="p-2.5 bg-red-100 rounded-2xl shrink-0">
              <AlertCircle size={22} className="shrink-0" />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-0.5">System Alert</p>
              <p className="text-sm font-bold leading-tight">{message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            {onRetry && (
              <button 
                type="button"
                onClick={onRetry}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-red-600 px-6 py-3.5 rounded-2xl hover:bg-red-700 active:scale-[0.97] transition-all shadow-lg shadow-red-100 shrink-0"
              >
                <Clock size={14} />
                Try Again
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="p-3.5 bg-white/50 text-red-600 rounded-2xl hover:bg-white transition-all active:scale-95"
              title="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CandidateModal = ({ candidate, onClose, t, cardClass, labelClass, subTextClass, highContrast, getCandidateName }: { 
  candidate: Candidate, 
  onClose: () => void,
  t: any,
  cardClass: string,
  labelClass: string,
  subTextClass: string,
  highContrast: boolean,
  getCandidateName: (c: Candidate) => string
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/40"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`w-full max-w-lg rounded-[48px] shadow-2xl border overflow-hidden relative ${cardClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center text-4xl shadow-xl shadow-indigo-100">
                {candidate.symbol}
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">{getCandidateName(candidate)}</h3>
                <p className={`text-sm font-bold mt-1 ${subTextClass}`}>{candidate.leader || "Democratic Representative"}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className={`text-[11px] font-black uppercase tracking-widest mb-3 ${labelClass}`}>{t.manifestoTitle}</h4>
              <div className={`p-6 rounded-3xl border border-dashed leading-relaxed ${subTextClass} italic font-medium`}>
                "{candidate.manifesto || "To build a stronger, more inclusive nation through innovation and shared prosperity."}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border ${highContrast ? 'bg-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                 <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${labelClass}`}>{t.leaderTitle}</p>
                 <p className="font-bold text-lg">{candidate.leader || "Party Council"}</p>
              </div>
              <div className={`p-6 rounded-3xl border ${highContrast ? 'bg-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                 <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${labelClass}`}>{t.status}</p>
                 <p className="font-bold text-lg text-indigo-600">Verified</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
          >
            {t.dismissBtn}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const getCandidateName = (candidate: Candidate | null, language: string) => {
  if (!candidate) return '';
  return typeof candidate.name === 'object' 
    ? (candidate.name[language] || candidate.name.English || '') 
    : candidate.name;
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [language, setLanguage] = useState('English');
  const _getCandidateName = (c: Candidate | null) => getCandidateName(c, language);

  const [isMobile, setIsMobile] = useState(false);
  const [aadhar, setAadhar] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [bioStatus, setBioStatus] = useState({ face: 'idle', finger: 'idle' });
  const [isListening, setIsListening] = useState(false);
  const [selectionFeedbackCandidate, setSelectionFeedbackCandidate] = useState<Candidate | null>(null);
  const [recognizedCandidate, setRecognizedCandidate] = useState<Candidate | null>(null);
  const [fingerHoldProgress, setFingerHoldProgress] = useState(0);
  const [fingerAttempts, setFingerAttempts] = useState(0);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpContent, setHelpContent] = useState('');
  const [isHelpLoading, setIsHelpLoading] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('voterSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const fingerIntervalRef = useRef<any>(null);
  const faceVideoRef = useRef<HTMLVideoElement>(null);
  const speakRepeatTimeoutRef = useRef<any>(null);
  const faceScanTriggeredRef = useRef(false);
  const [faceStream, setFaceStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Accessibility States
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voiceStyle, setVoiceStyle] = useState<'formal' | 'cheerful'>('formal');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const cardClass = highContrast 
    ? "bg-zinc-900 border-zinc-700 text-white" 
    : "bg-white border-slate-200 text-slate-900";
  
  const inputClass = highContrast
    ? "bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400";

  const subTextClass = highContrast ? "text-zinc-400" : "text-slate-500";
  const labelClass = highContrast ? "text-zinc-500" : "text-slate-400";
  
  const handleHelp = async () => {
    setIsHelpOpen(true);
    setIsHelpLoading(true);
    setError('');
    
    try {
      const contexts: Record<AppState, string> = {
        'LANDING': 'The user is on the landing page of SmartVote-AI. They should start the verification process.',
        'VERIFY_AADHAAR': 'The user needs to enter their 12-digit Aadhar number for national identification.',
        'OTP_VERIFICATION': 'The user needs to enter the 6-digit OTP sent to their mobile for multi-factor authentication.',
        'BIOMETRICS': 'The user is undergoing physiological matching with face and fingerprint scans.',
        'VOTING': 'The user is on the electronic ballot screen. They should select a candidate and confirm their vote.',
        'ALREADY_VOTED': 'The user has already participated and can only view results.',
        'RESULTS': 'The user is viewing the live national election results.',
        'THANK_YOU': 'The user has successfully voted and is on the thank you page.'
      };
      
      const guidance = await getVoiceGuidance(contexts[appState], language);
      setHelpContent(guidance);
      speak(guidance);
    } catch (err) {
      setHelpContent(t.helpSub);
    } finally {
      setIsHelpLoading(false);
    }
  };

  const getFriendlyErrorMessage = (error: any, context: string) => {
    if (!window.navigator.onLine) {
      return "You're currently offline. Please reconnect to the internet to continue your verification.";
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "The secure server is temporarily unreachable. Please check your network or try again in a moment.";
    }

    if (error?.status === 429) {
      return "Security pause: too many requests detected. Please wait a minute before trying again.";
    }

    if (error?.status >= 500) {
      return "The voter portal is experiencing heavy traffic. Let's try again in a few seconds.";
    }

    if (error?.status === 400) {
      return "The information provided is in an unrecognized format. Please double-check and retry.";
    }

    if (error?.status === 403) {
      return "Our records show that a ballot has already been cast for this Aadhar identity.";
    }

    return `A technical issue occurred while ${context}. Please try again.`;
  };



  const CountdownDisplay = () => {
    return (
      <div className="flex justify-center gap-4 py-8">
        {[
          { label: t.days, value: timeLeft.days },
          { label: t.hours, value: timeLeft.hours },
          { label: t.minutes, value: timeLeft.minutes },
          { label: t.seconds, value: timeLeft.seconds },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-sm border ${cardClass}`}>
              {String(item.value).padStart(2, '0')}
            </div>
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mt-2 ${labelClass}`}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (viewingCandidate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewingCandidate]);



  useEffect(() => {
    // Detect mobile/touch device for specific instructions
    const checkMobile = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isTouch || isMobileAgent);
    };
    checkMobile();
    
    fetchResults();
    
    // Set up real-time polling for the results dashboard
    const interval = setInterval(() => {
      if (appState === 'RESULTS' || appState === 'ALREADY_VOTED') {
        fetchResults();
      }
    }, 3000); // Poll every 3 seconds for active UI

    return () => clearInterval(interval);
  }, [appState]);

  useEffect(() => {
    const electionDate = new Date('2026-05-15T00:00:00').getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = electionDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('voterSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    if (!isVoiceActive || appState === 'RESULTS' || appState === 'ALREADY_VOTED') return;

    /* Automatic help trigger disabled as per user request to stop unnecessary popups
    const checkInactivity = setInterval(() => {
      const now = Date.now();
      if (now - lastActionTime > 10000) {
        handleHelp();
        setLastActionTime(now);
      }
    }, 2000);

    return () => clearInterval(checkInactivity);
    */
  }, [isVoiceActive, lastActionTime, appState]);

  useEffect(() => {
    const updateActivity = () => setLastActionTime(Date.now());
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, []);

  useEffect(() => {
    const actualTotal = candidates.reduce((sum, c) => sum + c.votes, 0);
    if (animatedTotal === 0 && actualTotal > 0) {
      setAnimatedTotal(actualTotal);
      return;
    }

    if (actualTotal > animatedTotal) {
      const diff = actualTotal - animatedTotal;
      const step = Math.max(1, Math.floor(diff / 10));
      const timer = setInterval(() => {
        setAnimatedTotal(prev => {
          if (prev + step >= actualTotal) {
            clearInterval(timer);
            return actualTotal;
          }
          return prev + step;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [candidates]);

  // Background activity animation is now driven by server-side simulation
  // and interval polling in fetchResults

const fetchResults = async () => {
  try {
    setCandidates([
      {
        id: "1",
        name: { en: "Candidate A" },
        symbol: "🌟",
        votes: 120
      },
      {
        id: "2",
        name: { en: "Candidate B" },
        symbol: "🔥",
        votes: 90
      }
    ]);
    setLastUpdated(new Date());
  } catch (err) {
    console.error('Fetch results error:', err);
  }

  };

  const speak = (text: string) => {
    if (!isVoiceActive) return;
    
    // Clear any pending repeat timers
    if (speakRepeatTimeoutRef.current) {
      clearTimeout(speakRepeatTimeoutRef.current);
      speakRepeatTimeoutRef.current = null;
    }

    // No more "Thinking..." status for instant feedback
    const cleanText = (text || '').replace(/[*_#~`[\]()]/g, ''); // Strip utility symbols
    setVoiceText(cleanText);
    
    const langMap: Record<string, string> = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Telugu': 'te-IN',
      'Tamil': 'ta-IN',
      'Marathi': 'mr-IN',
      'Malayalam': 'ml-IN'
    };

    const speakActual = () => {
      const voices = window.speechSynthesis.getVoices();
      
      const findVoice = (langCode: string, nameKeywords: string[] = []) => {
        const baseLang = langCode.split('-')[0].toLowerCase();
        
        // Priority 1: Exact lang match AND name matches specific high-quality keywords (Google, Microsoft, etc.)
        // Plus specific regional names like Pallavi, Heera, etc.
        const bestMatch = voices.find(v => {
          if (!v || !v.lang || !v.name) return false;
          const vLang = v.lang.toLowerCase().replace('_', '-');
          const vName = v.name.toLowerCase();
          const isRegional = vLang.includes(langCode.toLowerCase()) || vLang.startsWith(baseLang);
          const isHq = vName.includes('natural') || vName.includes('premium') || vName.includes('online') || vName.includes('google') || vName.includes('microsoft') || vName.includes('apple');
          const hasKeyword = nameKeywords.some(k => vName.includes(k.toLowerCase()));
          return isRegional && (isHq || hasKeyword);
        });
        if (bestMatch) return bestMatch;

        // Priority 2: Any voice that matches the language code and is high quality
        const fallbackHq = voices.find(v => {
          if (!v || !v.lang || !v.name) return false;
          const vLang = v.lang.toLowerCase().replace('_', '-');
          const vName = v.name.toLowerCase();
          return (vLang.includes(langCode.toLowerCase()) || vLang.startsWith(baseLang)) && 
                 (vName.includes('natural') || vName.includes('google') || vName.includes('microsoft'));
        });
        if (fallbackHq) return fallbackHq;

        // Priority 3: Any matching language
        const anyMatch = voices.find(v => {
          if (!v || !v.lang) return false;
          const vLang = v.lang.toLowerCase().replace('_', '-');
          return vLang.includes(langCode.toLowerCase()) || vLang.startsWith(baseLang);
        });
        return anyMatch || null;
      };

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = langMap[language] || 'en-IN';
      utterance.lang = targetLang;

      // Tuning for "Traditional & Native" feel: Slightly slower, calm, and respectful pitch
      // Style adjustments
      const styleRateMod = voiceStyle === 'cheerful' ? 1.15 : 1.0;
      const stylePitchMod = voiceStyle === 'cheerful' ? 1.2 : 0.95;

      if (language === 'Tamil') {
        utterance.voice = findVoice('ta-IN', ['pallavi', 'karthik', 'valluvar']);
        utterance.rate = 0.8 * styleRateMod; 
        utterance.pitch = 1.0 * stylePitchMod; 
      } else if (language === 'Hindi') {
        utterance.voice = findVoice('hi-IN', ['heera', 'kalpana', 'hemant', 'swara']);
        utterance.rate = 0.8 * styleRateMod;
        utterance.pitch = 0.95 * stylePitchMod; // Slightly lower for a more mature/traditional sound
      } else if (language === 'Telugu') {
        utterance.voice = findVoice('te-IN', ['chaitra', 'geeta', 'sruthi', 'mohan']);
        utterance.rate = 0.8 * styleRateMod;
        utterance.pitch = 1.0 * stylePitchMod;
      } else if (language === 'Marathi') {
        utterance.voice = findVoice('mr-IN', ['ananya', 'aarohi', 'manohar']);
        utterance.rate = 0.8 * styleRateMod;
        utterance.pitch = 1.0 * stylePitchMod;
      } else if (language === 'Malayalam') {
        utterance.voice = findVoice('ml-IN', ['midhun', 'ammu', 'vaniya']);
        utterance.rate = 0.8 * styleRateMod;
        utterance.pitch = 1.0 * stylePitchMod;
      } else {
        // Indian English
        utterance.voice = findVoice('en-IN', ['isha', 'neerja', 'prabhat', 'ravi']);
        utterance.rate = 0.85 * speechRate * styleRateMod;
        utterance.pitch = 1.0 * stylePitchMod;
      }

      utterance.volume = 1.0;
      (window as any)._currentUtterance = utterance;
      
      window.speechSynthesis.cancel();
      
      // Small pause before speaking to allow cleanup and ensure voice selection is applied
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 250);
    };

    // Chrome/Safari voice loading handling
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakActual;
    } else {
      speakActual();
    }

    // Optional: Only repeat if the user explicitly asked for a loop, 
    // but the user currently wants "tell once".
  };

  const handleAadharSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (aadhar.length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsProcessing(true);
    setRetryAction(() => () => handleAadharSubmit());
    
    try {
      const handleAadharSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (aadhar.length !== 12) {
    setError('Please enter a valid 12-digit Aadhaar number');
    return;
  }

  if (mobile.length !== 10) {
    setError('Please enter a valid 10-digit mobile number');
    return;
  }

  setError('');
  setIsProcessing(true);
  setRetryAction(() => () => handleAadharSubmit());

  try {
    // ✅ DEMO LOGIC (NO API CALL)

    if (aadhar === "111122223333") {
      // simulate already voted case
      setAppState('ALREADY_VOTED');
      const t = TRANSLATIONS[language];
      speak(t.restrictedSub);
    } else {
      // normal flow
      setAppState('OTP_VERIFICATION');
      setResendTimer(30);
      const t = TRANSLATIONS[language];
      speak(t.otpSub);
    }

  } catch (err) {
    setError(getFriendlyErrorMessage(err, 'verifying your identity'));
  } finally {
    setIsProcessing(false);
  }
};

 const handleOtpSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (otp.length !== 6) {
    setError('Please enter a valid 6-digit OTP');
    return;
  }

  setError('');
  setIsProcessing(true);
  setRetryAction(() => () => handleOtpSubmit());

  try {
    // ✅ DEMO LOGIC (NO API CALL)

    if (otp === '123456') {
      setAppState('BIOMETRICS');
      const t = TRANSLATIONS[language];
      speak(t.aadharVerifiedMsg);
    } else {
      setError('Invalid OTP');
    }

  } catch (err) {
    setError(getFriendlyErrorMessage(err, 'verifying your OTP'));
  } finally {
    setIsProcessing(false);
  }
};

  useEffect(() => {
    if (appState === 'OTP_VERIFICATION' && !otp) {
      const timer = setTimeout(() => {
        setOtp('123456');
        speak("OTP received and auto-verifying");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [appState, otp]);

  useEffect(() => {
    if (appState === 'OTP_VERIFICATION' && otp === '123456') {
      const timer = setTimeout(() => {
        handleOtpSubmit();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [appState, otp, handleOtpSubmit]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (appState === 'BIOMETRICS') {
      if (!faceScanTriggeredRef.current) {
        startFaceScan();
        faceScanTriggeredRef.current = true;
      }
    } else {
      stopCamera();
      faceScanTriggeredRef.current = false;
    }
  }, [appState]);

  const startFaceScan = async () => {
    // Check for secure context and API availability
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Voter hardware check: Camera API unavailable. Origin security or frame constraints active.');
      setCameraError('Hardware Check: Integrated camera service is unavailable. Proceeding with Alternative Identity Verification...');
      
      setTimeout(() => {
        if (appState === 'BIOMETRICS' && bioStatus.face !== 'verified') {
          setBioStatus(prev => ({ ...prev, face: 'verified' }));
          speak(t.fallbackFaceMsg);
        }
      }, 3000);
      return;
    }

    setBioStatus(prev => ({ ...prev, face: 'scanning' }));
    setCameraError(null);
    
    try {
      // Primary attempt: High-fidelity biometric simulation
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
      } catch (innerErr) {
        // Resilient fallback: Any available video device
        console.warn('Standard biometric feed restricted, attempting basic optical relay.');
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setFaceStream(stream);
      if (faceVideoRef.current) {
        faceVideoRef.current.srcObject = stream;
      }
      
      // Real-time face detection simulation loop
      let progress = 0;
      let detectionFails = 0;
      const progressInterval = setInterval(() => {
        // Simple probability of "detecting" a face each cycle
        const isFaceContextMatcheed = Math.random() > (detectionFails > 2 ? 0.1 : 0.3); 
        
        if (!isFaceContextMatcheed) {
          detectionFails++;
          setCameraError("Subject Out of Focus: Please align face within brackets.");
          return;
        }

        // Only increment if "face" is found in this frame
        progress += Math.random() * 12;
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          setBioStatus(prev => {
            if (prev.face === 'verified') return prev;
            speak(t.faceVerifiedMsg);
            return { ...prev, face: 'verified' };
          });
          setCameraError(null);
        } else {
          // More specific facial biometric stages
          const stage = progress < 15 ? "Searching for Optic Signature..."
                    : progress < 35 ? "Mapping 128 Facial Landmarks..." 
                    : progress < 60 ? "Verifying Subject Vitality..." 
                    : progress < 85 ? "Syncing Biometric ID with Aadhaar Database..." 
                    : "Final Matching Protocol...";
          setCameraError(stage);
        }
      }, 800);
      
    } catch (err: any) {
      console.warn('Camera access restriction encountered:', err);
      
      const isPermissionError = 
        err.name === 'NotAllowedError' || 
        err.name === 'PermissionDeniedError' || 
        err.message?.toLowerCase().includes('permission denied') ||
        err.message?.toLowerCase().includes('denied');

      const isNotFound = 
        err.name === 'NotFoundError' || 
        err.name === 'DevicesNotFoundError';

      // If it's a definitive permission deny, don't leave the user in a "failed" state. 
      // Proactively switch to fallback mode which is a standard procedure for secured environments.
      if (isPermissionError) {
        // Instead of a traditional "Error", we treat this as an intentional security choice by the user/system.
        // We switch to the established "Fallback Identity Mode" which uses secondary sensors/tokens.
        setCameraError('System Info: Manual Privacy Mode detected. Transitioning to Secondary Identity Verification (ID-Sensor Fallback)...');
        setBioStatus(prev => ({ ...prev, face: 'scanning' })); // Keep visual feedback active
        
        setTimeout(() => {
          if (appState === 'BIOMETRICS' && bioStatus.face !== 'verified') {
            setBioStatus(prev => ({ ...prev, face: 'verified' }));
            speak(t.fallbackFaceMsg);
          }
        }, 2000);
        return;
      }

      let errMsg = 'Identity Check: Unable to access optical sensor. Please ensure no other secure application is using your camera.';
      if (isNotFound) {
        errMsg = 'Identity Check: No integrated camera detected. Initializing Alternative Verification procedures.';
      }
      
      setCameraError(errMsg);
      
      const fallbackDelay = isNotFound ? 1000 : 5000;
      
      setTimeout(() => {
        setBioStatus(prev => {
          if (prev.face === 'verified' || (prev.face === 'scanning' && faceStream)) return prev;
          speak(t.fallbackFaceMsg);
          return { ...prev, face: 'verified' };
        });
      }, fallbackDelay);
    }
  };

  const stopCamera = () => {
    if (faceStream) {
      faceStream.getTracks().forEach(track => track.stop());
      setFaceStream(null);
    }
  };

  const toggleCamera = () => {
    if (faceStream) {
      stopCamera();
      setIsCameraOff(true);
    } else {
      setIsCameraOff(false);
      startFaceScan();
    }
  };

  const handleBiometricsComplete = () => {
    if (bioStatus.finger !== 'verified' || bioStatus.face !== 'verified') {
      const msg = bioStatus.face !== 'verified' 
        ? t.waitFace
        : t.waitFinger;
      setError(msg);
      speak(msg);
      return;
    }

    setError('');
    setIsProcessing(true);
    setBioStatus(prev => ({ ...prev, face: 'verified', finger: 'verified' }));
    
    speak(t.allBioSecuredMsg);
    
    setTimeout(() => {
      setAppState('VOTING');
      setIsProcessing(false);
      speak(t.authSuccessMsg);
    }, 1200);
  };

  const startFingerScan = () => {
    if (bioStatus.finger === 'verified' || bioStatus.finger === 'scanning' || isProcessing) return;
    setError('');
    setBioStatus(prev => ({ ...prev, finger: 'scanning' }));
    
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10]);
    }
    
    let progress = 0;
    if (fingerIntervalRef.current) clearInterval(fingerIntervalRef.current);
    
    fingerIntervalRef.current = setInterval(() => {
      progress += 0.5; // Adjusted for 10 second duration (0.5% every 50ms = 100% in 10000ms)
      setFingerHoldProgress(Math.min(progress, 100));
      
      if (progress % 24 === 0 && 'vibrate' in navigator) {
        navigator.vibrate(5);
      }
      
      if (progress >= 100) {
        if (fingerIntervalRef.current) {
          clearInterval(fingerIntervalRef.current);
          fingerIntervalRef.current = null;
        }
        
        // Mock failure on first attempt to demonstrate "Try Again"
        if (fingerAttempts === 0) {
          setBioStatus(prev => ({ ...prev, finger: 'failed' }));
          setFingerAttempts(1);
          speak(t.bioFingerFailed);
          if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50, 100]);
          }
          return;
        }

        if ('vibrate' in navigator) {
          navigator.vibrate([10, 50, 10, 50, 20]);
        }
        
        setBioStatus(prev => ({ ...prev, finger: 'verified' }));
        speak(t.bioSuccess);
      }
    }, 50);
  };

  // Simplified cancel is no longer needed for click-to-scan
  // but we keep the ref cleanup
  const cleanupFingerScan = () => {
    if (fingerIntervalRef.current) {
      clearInterval(fingerIntervalRef.current);
      fingerIntervalRef.current = null;
    }
  };

  const handleVote = async (candidateId: string) => {
    setIsProcessing(true);
    setRetryAction(() => () => handleVote(candidateId));
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhar, candidateId }),
      });
      
      if (res.ok) {
        setVotedCandidateId(candidateId);
        setAppState('THANK_YOU');
        setSelectedCandidate(null);
        fetchResults();
        speak(t.recordedMsg);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || getFriendlyErrorMessage(res, 'casting your vote'));
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'casting your vote'));
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.noSpeechSupport || 'Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Telugu': 'te-IN',
      'Tamil': 'ta-IN',
      'Marathi': 'mr-IN',
      'Malayalam': 'ml-IN'
    };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errors: Record<string, string> = {
        'network': 'Network connection failed. Please check your signal and try speaking again.',
        'not-allowed': 'Microphone access is required for voice commands. Please check your browser permissions.',
        'no-speech': 'We didn\'t catch that. Could you please try speaking a bit louder or closer to the mic?',
        'aborted': 'Voice recognition was interrupted. Please try again.'
      };
      setError(errors[event.error] || 'We had trouble hearing you. Please try again or use the manual touch controls.');
    };

    recognition.start();
  };



  const handleVoiceCommand = (command: string) => {
    const transcript = command.toLowerCase().trim();
    if (appState !== 'VOTING') return;

    // Handle context-specific commands if a candidate is already selected for confirmation
    if (selectedCandidate) {
      const confirmKeywords = ['yes', 'confirm', 'okay', 'ha', 'haan', 'sari', 'vote', 'cast'];
      const cancelKeywords = ['no', 'cancel', 'back', 'vapas', 'vadhiv', 'venda', 'nhi'];
      
      if (confirmKeywords.some(k => transcript.includes(k))) {
        handleVote(selectedCandidate.id);
        return;
      }
      if (cancelKeywords.some(k => transcript.includes(k))) {
        setSelectedCandidate(null);
        speak("Cancelled selection.");
        return;
      }
    }

    // Search for match in candidate names or symbols or voice keys
    const match = candidates.find(c => {
      const currentName = _getCandidateName(c).toLowerCase();
      const englishName = (typeof c.name === 'object' ? c.name.English : c.name).toLowerCase();
      const symbol = c.symbol.toLowerCase();
      const keys = c.voiceKeys || [];
      
      return transcript.includes(currentName) || 
             transcript.includes(englishName) || 
             transcript.includes(symbol) ||
             keys.some(k => transcript.includes(k.toLowerCase()));
    });

    if (match) {
      setRecognizedCandidate(match);
      const name = _getCandidateName(match);
      speak(`${t.recognizedVoice}: ${name}. ${t.confirmTitle}. Say 'Yes' to confirm or 'No' to cancel.`);
      
      // Select the candidate automatically (open modal)
      setSelectedCandidate(match);
      
      // Clear recognition feedback after a while
      setTimeout(() => {
        setRecognizedCandidate(null);
      }, 3000);
    } else {
      speak(t.commandNotRecognized || "Command not recognized. Please try saying the party name or symbol clearly.");
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col p-4 md:p-6 transition-all duration-300 overflow-x-hidden ${
      highContrast ? 'bg-black text-white' : 'bg-slate-100 text-slate-900'
    } ${
      fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
    }`}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10 max-w-6xl mx-auto w-full px-2 md:px-0">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            {appState !== 'LANDING' ? (
              <button 
                onClick={() => {
                  if (window.confirm("Return to front page? Unsaved progress will be lost.")) {
                    setAppState('LANDING');
                    setAadhar('');
                    setMobile('');
                    setBioStatus({ face: 'idle', finger: 'idle' });
                  }
                }}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                title="Back to Login"
              >
                <ArrowLeft size={16} />
              </button>
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">V</div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">SmartVote-AI</h1>
              <p className="text-[9px] md:text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1 shrink-0">ECI • E-Portal</p>
            </div>
          </div>
          
          <div className="flex md:hidden items-center gap-2">
             <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 rounded-full border transition-all ${isSettingsOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-slate-200 text-slate-700'}`}
              >
                <Settings size={20} />
              </button>
          </div>
        </div>

        <div className="hidden md:flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm shrink-0">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">Phase: 04</span>
          </div>
          
          <button 
            onClick={() => setIsFAQOpen(true)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all bg-white border-slate-200 text-slate-700 hover:bg-slate-50`}
          >
            <HelpCircle size={14} className="opacity-60" />
            {t.faqTitle}
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">
              <Languages size={14} className="opacity-60" />
              {language}
            </button>
            <div className={`absolute right-0 top-full mt-2 border rounded-2xl shadow-xl py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 scale-95 group-hover:scale-100 z-[100] ${
              highContrast ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-100'
            }`}>
              {LANGUAGES.map(lang => (
                <button 
                  key={lang.code}
                  onClick={() => setLanguage(lang.name)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    highContrast ? 'hover:bg-zinc-800 hover:text-indigo-400' : 'hover:bg-indigo-50 hover:text-indigo-600 text-slate-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              setIsVoiceActive(!isVoiceActive);
              if (!isVoiceActive) speak(t.voiceActiveMsg);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${isVoiceActive ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm shadow-indigo-100' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Mic size={14} className={isVoiceActive ? 'animate-pulse' : 'opacity-60'} />
            {isVoiceActive ? 'Mic System: ON' : 'Mic System: OFF'}
          </button>

          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-full border transition-all ${isSettingsOpen ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            title="Accessibility Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Accessibility Settings Dropdown */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-20 right-6 md:right-auto md:left-auto z-[300] w-72 p-6 rounded-[32px] border shadow-2xl ${
                highContrast ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-100'
              }`}
            >
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">Accessibility Hub</h3>
              
              <div className="space-y-6">
                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <Type size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Font Scaling</span>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          fontSize === size ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <Languages size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">System Language</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.name);
                          speak(`Language changed to ${lang.name}`);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          language === lang.name 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <Eye size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Display Mode</span>
                  </div>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition-all ${
                      highContrast ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">High Contrast</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${highContrast ? 'bg-white/20' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${highContrast ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </button>
                </div>

                {/* Speech Rate */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Speech Velocity</span>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1" 
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] font-bold opacity-40">
                      <span>0.5X</span>
                      <span className="text-indigo-600 opacity-100">{speechRate}X</span>
                      <span>2.0X</span>
                    </div>
                  </div>
                </div>

                {/* Voice & Mic Assist */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <Mic size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Voice & Mic Controls</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">Microphone</span>
                      <span className="text-[10px] text-slate-500">Enable voice commands for voting</span>
                    </div>
                    <button 
                      onClick={() => {
                        setIsVoiceActive(!isVoiceActive);
                        if (!isVoiceActive) speak("Voice and microphone enabled");
                      }}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isVoiceActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isVoiceActive ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Voice Style */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <Volume2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t.voiceStyle}</span>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    {(['formal', 'cheerful'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setVoiceStyle(style)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          voiceStyle === style ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {t[style]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitles */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 opacity-60">
                    <MessageSquare size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Subtitles</span>
                  </div>
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-between transition-all ${
                      showSubtitles ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">Show Voice Text</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${showSubtitles ? 'bg-white/20' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${showSubtitles ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto w-full flex-grow">
        <AnimatePresence mode="wait">
          {appState === 'LANDING' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-3xl mx-auto text-center pt-8 md:pt-20 px-4"
            >
              <div className="mb-8 inline-block">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-600 rounded-[28px] md:rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <ShieldCheck size={32} className="md:w-12 md:h-12" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
                {t.heroTitle}
              </h2>
              <p className={`${subTextClass} max-w-xl mx-auto mb-10 text-base md:text-xl font-medium leading-relaxed opacity-80`}>
                {t.heroSub}
              </p>
              
              <div className="mb-12">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70 ${labelClass}`}>{t.electionCountdown}</p>
                <CountdownDisplay />
              </div>
              <button 
                onClick={() => setAppState('VERIFY_AADHAAR')}
                className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center gap-4 mx-auto uppercase tracking-wide"
              >
                {t.startBtn}
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {appState === 'VERIFY_AADHAAR' && (
            <motion.div 
              key="aadhar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`max-w-lg mx-auto p-6 md:p-10 rounded-[32px] md:rounded-[40px] border shadow-sm ${cardClass}`}
            >
              <StepIndicator currentStep={1} />
              <div className="mb-10">
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${labelClass}`}>{t.identityVerify}</h2>
                <h3 className="text-2xl font-bold tracking-tight">{t.aadharTitle}</h3>
                <p className={`${subTextClass} text-sm mt-1`}>{t.aadharSub}</p>
              </div>
              <form onSubmit={handleAadharSubmit}>
                  <div className="space-y-8">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${labelClass}`}>{t.aadharTitle}</label>
                        <input 
                          type="text" 
                          value={aadhar}
                          onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                          placeholder="0000 0000 0000"
                          className={`w-full px-6 py-5 border rounded-2xl focus:border-indigo-500 outline-none transition-all text-2xl font-mono tracking-[0.2em] text-center ${inputClass}`}
                          required
                          autoFocus
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${labelClass}`}>{t.mobileNumber}</label>
                        <input 
                          type="text" 
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="+91 XXXXX XXXXX"
                          className={`w-full px-6 py-5 border rounded-2xl focus:border-indigo-500 outline-none transition-all text-2xl font-mono tracking-widest text-center ${inputClass}`}
                          required
                        />
                         <p className={`text-[10px] font-bold ${subTextClass} ml-1`}>{t.mobileSub}</p>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {error && <ErrorBanner message={error} onClose={() => setError('')} onRetry={retryAction || undefined} />}
                    </AnimatePresence>
                    
                    <button 
                      disabled={isProcessing}
                    className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase"
                  >
                    {isProcessing ? <Clock className="animate-spin" size={22} /> : t.processIdentity}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {appState === 'OTP_VERIFICATION' && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`max-w-lg mx-auto p-6 md:p-10 rounded-[32px] md:rounded-[40px] border shadow-sm ${cardClass}`}
            >
              <StepIndicator currentStep={2} />
              <div className="mb-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${labelClass}`}>{t.verifLevel2}</h2>
                    <h3 className="text-2xl font-bold tracking-tight">{t.otpTitle}</h3>
                    <p className={`${subTextClass} text-sm mt-1`}>{t.otpSub}</p>
                  </div>
                  <button 
                    onClick={() => setAppState('VERIFY_AADHAAR')}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleOtpSubmit}>
                <div className="space-y-8">
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000 000"
                        className={`w-full px-6 py-5 border rounded-2xl focus:border-indigo-500 outline-none transition-all text-4xl font-mono tracking-[0.5em] text-center ${inputClass}`}
                        required
                        autoFocus
                      />
                      
                      <div className="flex justify-between items-center px-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${labelClass}`}>
                          {mobile.replace(/(\d{5})(\d{5})/, '+91 $1 $2')}
                        </span>
                        <button 
                          type="button"
                          disabled={resendTimer > 0}
                          onClick={() => {
                            setOtp('');
                            setResendTimer(30);
                            speak("OTP Resent");
                          }}
                          className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            resendTimer > 0 ? 'text-slate-400' : 'text-indigo-600 hover:text-indigo-700'
                          }`}
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : t.resendOtp}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {error && <ErrorBanner message={error} onClose={() => setError('')} onRetry={retryAction || undefined} />}
                  </AnimatePresence>
                  
                  <button 
                    disabled={isProcessing || otp.length !== 6}
                    className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase shadow-lg shadow-indigo-100"
                  >
                    {isProcessing ? <Clock className="animate-spin" size={22} /> : t.verifyOtp}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {appState === 'BIOMETRICS' && (
            <div className="space-y-10">
              <div className="max-w-lg mx-auto">
                <StepIndicator currentStep={3} />
              </div>
              <motion.div 
              key="biometrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              <div className="md:col-span-2 text-center mb-6 md:mb-10">
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${labelClass}`}>{t.verifLevel2}</h2>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight">{t.bioTitle}</h3>
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div className="md:col-span-2 w-full">
                    <ErrorBanner message={error} onClose={() => setError('')} onRetry={retryAction || undefined} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className={`p-6 md:p-10 rounded-[32px] md:rounded-[40px] border transition-all ${bioStatus.face === 'verified' ? 'border-green-500 bg-green-500/10' : bioStatus.face === 'scanning' ? 'border-indigo-500 bg-indigo-50/10' : cardClass} shadow-sm text-center space-y-6 relative overflow-hidden group`}>
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bioStatus.face === 'scanning' ? 'bg-indigo-500 animate-pulse' : bioStatus.face === 'verified' ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${bioStatus.face === 'scanning' ? 'text-indigo-600' : bioStatus.face === 'verified' ? 'text-green-600' : 'text-slate-400'}`}>
                    {bioStatus.face === 'scanning' ? 'Optical Sensor Active' : bioStatus.face === 'verified' ? 'Identity Consistently Matched' : 'Awaiting Sensor'}
                  </span>
                </div>
                {bioStatus.face === 'verified' && <div className="absolute top-6 right-6 text-green-600"><CheckCircle2 className="w-6 h-6" /></div>}
                
                {/* Face Scan Mesh Simulation */}
                {bioStatus.face === 'scanning' && (
                  <motion.div 
                    initial={{ top: '-100%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-indigo-400/40 blur-md z-20 shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                  />
                )}

                <div className={`w-64 h-64 relative ${bioStatus.face === 'scanning' ? 'bg-indigo-600 text-white ring-8 ring-indigo-500/20' : bioStatus.face === 'verified' ? 'bg-green-600 text-white' : highContrast ? 'bg-zinc-800 text-indigo-400' : 'bg-slate-50 text-indigo-600 shadow-inner'} rounded-[40px] flex items-center justify-center mx-auto transition-all duration-500 overflow-hidden`}>
                  {bioStatus.face === 'scanning' && faceStream && (
                    <>
                      <video 
                        ref={faceVideoRef}
                        autoPlay 
                        muted 
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
                      />
                      {/* Detection Frame Overlay */}
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 ${cameraError?.includes('Subject') ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-indigo-400/60 shadow-[0_0_15px_rgba(129,140,248,0.4)]'} rounded-3xl transition-all duration-300 z-10`}>
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-inherit rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-inherit rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-inherit rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-inherit rounded-br-lg" />
                        
                        {/* Status Dot */}
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${cameraError?.includes('Subject') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full z-10 backdrop-blur-sm" />
                    </>
                  )}
                  {bioStatus.face === 'scanning' && (
                     <div className="absolute inset-0 pointer-events-none z-10">
                        {[...Array(4)].map((_, i) => (
                           <motion.div 
                              key={i}
                              animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                              className="absolute inset-0 border border-indigo-400 rounded-[40px]"
                           />
                        ))}
                     </div>
                  )}
                  <Camera size={72} className={`${(bioStatus.face === 'scanning' && faceStream) ? "opacity-0" : "opacity-100"} transition-opacity relative z-10`} />
                  
                  {bioStatus.face === 'scanning' && (
                    <button
                      onClick={toggleCamera}
                      className="absolute bottom-4 right-4 z-30 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/20 active:scale-90"
                      title={faceStream ? "Turn Camera Off" : "Turn Camera On"}
                    >
                      {faceStream ? <CameraOff size={20} /> : <Camera size={20} />}
                    </button>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xl">{t.bioFace}</h4>
                  <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${labelClass}`}>
                    {bioStatus.face === 'verified' ? `${t.faceMatchScore}: 99.8%` : bioStatus.face === 'scanning' ? t.scanningBio : t.cameraReady}
                  </p>
                  {cameraError && bioStatus.face !== 'verified' && (
                    <div className={`mt-4 p-4 rounded-3xl border flex items-center gap-4 transition-all ${cameraError.includes('Analyzing') || cameraError.includes('Detected') || cameraError.includes('Authenticating') ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                      <Activity size={18} className={cameraError.includes('...') ? 'animate-pulse' : ''} />
                      <div className="flex flex-col">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Optical Engine Status</p>
                        <p className="text-[11px] font-bold leading-tight">{cameraError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-6 md:p-10 rounded-[32px] md:rounded-[40px] border transition-all ${bioStatus.finger === 'verified' ? 'border-green-500 bg-green-500/10' : bioStatus.finger === 'failed' ? 'border-red-500 bg-red-50/10' : bioStatus.finger === 'scanning' ? 'border-indigo-500 bg-indigo-50/10' : cardClass} shadow-sm text-center space-y-6 relative overflow-hidden`}>
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bioStatus.finger === 'scanning' ? 'bg-indigo-500 animate-pulse' : bioStatus.finger === 'verified' ? 'bg-green-500' : bioStatus.finger === 'failed' ? 'bg-red-500' : 'bg-slate-300'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${bioStatus.finger === 'scanning' ? 'text-indigo-600' : bioStatus.finger === 'verified' ? 'text-green-600' : bioStatus.finger === 'failed' ? 'text-red-600' : 'text-slate-400'}`}>
                    {bioStatus.finger === 'scanning' ? 'Capturing Ridge Data' : bioStatus.finger === 'verified' ? 'Biometric Signature Valid' : bioStatus.finger === 'failed' ? 'Capture Disrupted' : 'Sensor Ready'}
                  </span>
                </div>
                {bioStatus.finger === 'verified' && <div className="absolute top-6 right-6 text-green-600"><CheckCircle2 className="w-6 h-6" /></div>}
                
                <div 
                  onClick={startFingerScan}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`w-36 h-36 cursor-pointer relative ${bioStatus.finger === 'scanning' ? 'bg-indigo-600 text-white shadow-[0_0_40px_rgba(79,70,229,0.5)] scale-110' : bioStatus.finger === 'verified' ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : bioStatus.finger === 'failed' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : highContrast ? 'bg-zinc-800 text-indigo-400' : 'bg-slate-50 text-indigo-600 shadow-inner'} rounded-[48px] flex items-center justify-center mx-auto transition-all duration-300 touch-none active:scale-95 group/finger`}
                >
                  {(bioStatus.finger === 'scanning' || bioStatus.finger === 'verified') && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                      <circle
                        cx="72"
                        cy="72"
                        r="66"
                        stroke={bioStatus.finger === 'verified' ? "rgba(255,255,255,0.4)" : "white"}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="415"
                        strokeDashoffset={415 - (415 * (bioStatus.finger === 'verified' ? 100 : fingerHoldProgress)) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-100"
                      />
                    </svg>
                  )}
                  
                  {bioStatus.finger === 'scanning' && (
                    <motion.div 
                      className="absolute inset-4 rounded-[36px] bg-indigo-400/20 z-0"
                      animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    <motion.div
                      animate={bioStatus.finger === 'scanning' ? {
                        scale: [1, 1.15, 1],
                        filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 8px #fff)", "drop-shadow(0 0 0px #fff)"]
                      } : {}}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Fingerprint size={72} className={bioStatus.finger === 'verified' ? "text-white" : bioStatus.finger === 'failed' ? "text-white" : "group-hover/finger:scale-110 transition-transform"} />
                    </motion.div>
                    
                    {bioStatus.finger === 'scanning' && (
                      <motion.div 
                        initial={{ top: '25%' }}
                        animate={{ top: ['25%', '75%', '25%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-[20%] right-[20%] h-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 pointer-events-none rounded-full"
                      />
                    )}
                    
                    {bioStatus.finger === 'scanning' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${fingerHoldProgress}%` }}
                        className="absolute bottom-[20%] left-[20%] right-[20%] bg-white/10 -z-10 rounded-xl transition-all"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xl">{t.bioFinger}</h4>
                  <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${bioStatus.finger === 'failed' ? 'text-red-600' : labelClass}`}>
                    {bioStatus.finger === 'verified' 
                      ? t.bioSuccess 
                      : bioStatus.finger === 'failed'
                        ? t.bioFingerFailed
                        : bioStatus.finger === 'scanning' 
                          ? t.holdToScan 
                          : isMobile ? t.touchToScan : t.touchpadToScan}
                  </p>
                  {bioStatus.finger === 'failed' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 space-y-3"
                    >
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-4 py-2 bg-red-100/50 rounded-lg inline-block">
                        Attempt 1 Failed: Poor Capture
                      </p>
                      <div className="flex justify-center">
                        <button 
                          onClick={() => {
                            setBioStatus(prev => ({ ...prev, finger: 'idle' }));
                            setFingerHoldProgress(0);
                            setTimeout(startFingerScan, 150);
                          }}
                          className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-100 active:scale-95"
                        >
                          <Zap size={14} />
                          {t.tryAgain}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 pt-6">
                <button 
                  onClick={handleBiometricsComplete}
                  disabled={isProcessing || bioStatus.face !== 'verified' || bioStatus.finger !== 'verified'}
                  className={`w-full py-6 rounded-3xl font-bold text-xl transition-all uppercase tracking-wide flex items-center justify-center gap-3 ${
                    (isProcessing || bioStatus.face !== 'verified' || bioStatus.finger !== 'verified') 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                  }`}
                >
                  {isProcessing ? <Clock className="animate-spin" /> : null}
                  {isProcessing 
                    ? t.securingSession 
                    : (bioStatus.face === 'verified' && bioStatus.finger === 'verified') 
                      ? t.unlockBallot 
                      : (t.bioBtn || t.finalizingAuth)}
                </button>
              </div>
            </motion.div>
            </div>
          )}

          {appState === 'VOTING' && (
            <div className="space-y-10">
              <div className="max-w-xl mx-auto">
                <StepIndicator currentStep={4} />
              </div>
              <motion.div 
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="bg-indigo-600 text-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">{t.ballotTitle}</h3>
                  <p className="text-indigo-200 font-medium text-sm md:text-base">Session token: SEC_{aadhar.slice(-4)}_89x</p>
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                  <button 
                    onClick={startListening}
                    disabled={isListening || !!recognizedCandidate || !!selectedCandidate}
                    className={`flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl font-bold transition-all text-sm md:text-base ${
                      isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : (recognizedCandidate || selectedCandidate)
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    <Mic size={isMobile ? 16 : 20} className={isListening ? 'animate-bounce' : ''} />
                    {isListening ? t.listening : t.voiceCommand}
                  </button>

                  <div className="bg-white/10 px-6 py-4 rounded-3xl border border-white/20 hidden sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t.status}</p>
                    <p className="text-lg font-bold">{t.readyToVote}</p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <div className="max-w-2xl mx-auto w-full mb-8">
                    <ErrorBanner message={error} onClose={() => setError('')} onRetry={retryAction || undefined} />
                  </div>
                )}
              </AnimatePresence>

              <div className="relative group max-w-2xl mx-auto w-full">
                <Search className={`absolute left-6 top-1/2 -translate-y-1/2 ${labelClass} group-focus-within:text-indigo-600 transition-colors`} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`w-full pl-16 pr-6 py-5 rounded-3xl border focus:border-indigo-500 outline-none transition-all shadow-sm ${inputClass}`}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                    >
                      {t.clearSearch}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {searchHistory.length > 0 && !searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto w-full flex flex-wrap gap-2 mb-8"
                >
                  <p className={`w-full text-[10px] font-black uppercase tracking-widest mb-1 opacity-50 ${labelClass}`}>{t.recentSearch}</p>
                  {searchHistory.map((query, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSearchQuery(query)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all hover:bg-indigo-50 ${highContrast ? 'bg-zinc-800 text-zinc-300' : 'bg-white border text-slate-600'}`}
                    >
                      {query}
                    </button>
                  ))}
                  <button 
                    onClick={() => setSearchHistory([])}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600 opacity-70 hover:opacity-100"
                  >
                    {t.clearSearch}
                  </button>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const filtered = candidates.filter(c => {
                    const currentName = _getCandidateName(c).toLowerCase();
                    const englishName = (typeof c.name === 'object' ? c.name.English : c.name).toLowerCase();
                    const symbol = c.symbol.toLowerCase();
                    const query = searchQuery.toLowerCase();
                    return currentName.includes(query) || englishName.includes(query) || symbol.includes(query);
                  });
                  
                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-full py-20 text-center animate-in fade-in slide-in-from-bottom-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${highContrast ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-400'}`}>
                          <Filter size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-2">{t.noResults}</h4>
                        <p className={subTextClass}>{t.trySearchOther}</p>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="mt-6 text-indigo-600 font-bold hover:underline"
                        >
                          {t.clearSearch}
                        </button>
                      </div>
                    );
                  }

                  return filtered.map(candidate => {
                    const isRecognized = recognizedCandidate?.id === candidate.id;
                    const isFeedbackActive = selectionFeedbackCandidate?.id === candidate.id;
                    
                    return (
                      <div
                        key={candidate.id}
                        role="button"
                        tabIndex={0}
                        aria-disabled={!!selectedCandidate || isProcessing}
                        onClick={() => {
                          if (!!selectedCandidate || isProcessing) return;
                          if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
                            setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 5));
                          }
                          setSelectionFeedbackCandidate(candidate);
                          speak(`${_getCandidateName(candidate)} ${t.selectedMsg}`);
                          
                          // Slight delay for visual feedback before modal
                          setTimeout(() => {
                            setSelectedCandidate(candidate);
                            setSelectionFeedbackCandidate(null);
                            speak(`${t.confirmVoteFor} ${_getCandidateName(candidate)}`);
                          }, 500);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!!selectedCandidate || isProcessing) return;
                            // Trigger the same click logic
                            if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
                              setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 5));
                            }
                            setSelectionFeedbackCandidate(candidate);
                            speak(`${_getCandidateName(candidate)} ${t.selectedMsg}`);
                            setTimeout(() => {
                              setSelectedCandidate(candidate);
                              setSelectionFeedbackCandidate(null);
                              speak(`${t.confirmVoteFor} ${_getCandidateName(candidate)}`);
                            }, 500);
                          }
                        }}
                        className={`p-10 rounded-[40px] border shadow-sm transition-all text-left group flex items-center gap-8 relative overflow-hidden cursor-pointer ${
                          isRecognized 
                            ? 'border-green-500 ring-4 ring-green-500/20 bg-green-50 scale-[1.02]' 
                            : isFeedbackActive
                              ? 'border-indigo-600 ring-4 ring-indigo-500/20 bg-indigo-50 scale-[0.98]'
                              : `hover:border-indigo-500 ${cardClass} hover:scale-[1.01]`
                        } ${!!selectedCandidate || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <AnimatePresence>
                          {isFeedbackActive && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/10 pointer-events-none flex items-center justify-center"
                            >
                              <motion.div 
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="w-20 h-20 bg-indigo-500 rounded-full"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {isRecognized && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-500/5 pointer-events-none"
                          />
                        )}
                        <div className={`text-6xl ${isRecognized ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'} transition-all shrink-0`}>{candidate.symbol}</div>
                        <div>
                          <h4 className={`text-2xl font-bold tracking-tight ${isRecognized ? 'text-green-700' : ''}`}>{_getCandidateName(candidate)}</h4>
                          <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${isRecognized ? 'text-green-600' : `group-hover:text-indigo-600 ${labelClass}`}`}>
                            {isRecognized ? t.recognizedVoice : t.selectCand}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                          <button 
                            disabled={isProcessing}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingCandidate(candidate);
                            }}
                            className={`p-3.5 rounded-2xl transition-all shadow-sm flex items-center gap-2 group/btn ${highContrast ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 hover:text-indigo-600'}`}
                          >
                            <Eye size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{t.viewProfile}</span>
                          </button>

                          {isRecognized && (
                            <div className="bg-green-600 text-white p-3 rounded-2xl animate-bounce shadow-lg shadow-green-100">
                              <CheckCircle2 size={24} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Voice Recognition Notification Overlay */}
              <AnimatePresence>
                {recognizedCandidate && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center p-6 z-[300] bg-indigo-900/40 backdrop-blur-xl"
                  >
                    <motion.div 
                      initial={{ scale: 0.5, y: 100, rotate: -5 }}
                      animate={{ 
                        scale: [0.5, 1.1, 1], 
                        y: 0, 
                        rotate: 0 
                      }}
                      transition={{ 
                        duration: 0.6,
                        times: [0, 0.7, 1],
                        ease: "easeOut"
                      }}
                      className="bg-white rounded-[40px] md:rounded-[60px] shadow-[0_0_100px_rgba(79,70,229,0.4)] p-8 md:p-16 max-w-xl w-full text-center relative border-8 border-indigo-100/50 overflow-hidden"
                    >
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2 
                        }}
                        className="text-7xl md:text-9xl mb-6 md:mb-10 block"
                      >
                        {recognizedCandidate.symbol}
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-4">{t.voiceVerified}</p>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 md:mb-8 leading-none">
                          {_getCandidateName(recognizedCandidate)}
                        </h2>
                        
                        <div className="flex items-center justify-center gap-3 md:gap-4 bg-slate-100 py-4 md:py-6 px-6 md:px-10 rounded-[28px] md:rounded-[30px] border-2 border-slate-200">
                          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xl font-bold text-slate-600 tracking-tight">{t.syncingBallot}</p>
                        </div>
                      </motion.div>

                      {/* Success Checkmark Burst */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute top-10 right-10 bg-green-500 text-white p-4 rounded-full shadow-lg"
                      >
                        <CheckCircle2 size={40} />
                      </motion.div>

                      {/* Particle decorative elements */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -100],
                              x: [0, (i % 2 === 0 ? 50 : -50)],
                              opacity: [1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.3
                            }}
                            className="absolute bg-indigo-500 rounded-full w-4 h-4"
                            style={{
                              left: `${20 + i * 15}%`,
                              bottom: '-10px'
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirmation Modal */}
              <AnimatePresence>
                {selectedCandidate && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className={`w-full max-w-md rounded-[32px] md:rounded-[40px] shadow-2xl border overflow-hidden ${cardClass}`}
                    >
                      <div className="p-6 md:p-10 text-center">
                        <div className="text-5xl md:text-6xl mb-6">{selectedCandidate.symbol}</div>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight">{t.confirmTitle}</h3>
                        <p className={`${subTextClass} font-medium mb-8 md:mb-10 leading-relaxed text-sm`}>
                          {t.areYouSure} <strong className={highContrast ? 'text-white' : 'text-slate-900'}>{_getCandidateName(selectedCandidate)}</strong>? {t.permanentAction}
                        </p>
                        <div className="space-y-3">
                          <button 
                            disabled={isProcessing}
                            onClick={() => handleVote(selectedCandidate.id)}
                            className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-indigo-700 transition-all"
                          >
                            {isProcessing ? "..." : t.confirmMyVote}
                          </button>
                          <button 
                            disabled={isProcessing}
                            onClick={() => setSelectedCandidate(null)}
                            className={`w-full py-4 rounded-3xl font-bold text-sm tracking-widest uppercase transition-all ${
                              highContrast ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {t.cancelBtn}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            </div>
          )}

          {appState === 'ALREADY_VOTED' && (
            <motion.div 
              key="already-voted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`max-w-2xl mx-auto p-8 md:p-16 rounded-[32px] md:rounded-[40px] border shadow-sm text-center ${cardClass}`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 ${highContrast ? 'bg-zinc-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight uppercase">{t.restrictedTitle}</h3>
              <p className={`${subTextClass} mb-10 text-lg leading-relaxed`}>
                {t.identID} <span className={`font-bold tracking-tighter ${highContrast ? 'text-white' : 'text-slate-800'}`}>{aadhar.slice(0,4)}...</span> {t.participantPhase}
              </p>
              <button 
                onClick={() => setAppState('RESULTS')}
                className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold flex items-center gap-3 mx-auto shadow-xl shadow-indigo-100 uppercase tracking-widest text-sm"
              >
                View Live Results
              </button>
            </motion.div>
          )}

          {appState === 'THANK_YOU' && (
            <motion.div 
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
              <motion.div 
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-32 h-32 bg-green-500 rounded-[40px] flex items-center justify-center text-white mx-auto mb-10 shadow-3xl shadow-green-200"
              >
                <CheckCircle2 size={64} />
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">{t.voteSuccessMsg}</h2>
              <p className={`text-base md:text-xl font-medium mb-12 ${subTextClass}`}>
                {t.voteSuccessSub}
              </p>
              
              <div className={`p-8 rounded-[40px] border mb-12 text-left space-y-4 ${cardClass}`}>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className={`text-xs font-bold uppercase tracking-widest ${labelClass}`}>Receipt ID</span>
                  <span className="font-mono text-indigo-600 font-bold">BV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <p className={`text-sm leading-relaxed ${subTextClass}`}>
                  {t.personalizedConfirm}
                </p>
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                  <ShieldCheck size={16} />
                  <span>Ballot Securely Transmitted</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setAppState('RESULTS')}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold flex items-center gap-3 shadow-xl hover:bg-black transition-all uppercase tracking-widest text-sm"
                >
                  View Election Insights <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => setAppState('LANDING')}
                  className="bg-white border text-slate-800 px-10 py-5 rounded-3xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-sm"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          )}

          {appState === 'RESULTS' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-12 grid-rows-6 gap-6 h-full min-h-[700px]"
            >
              {/* Personalized Success Banner */}
              {justVoted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="col-span-12 bg-green-600 text-white p-8 rounded-[40px] flex items-center justify-between gap-6 shadow-2xl shadow-green-100 overflow-hidden relative mb-4"
                >
                  <div className="absolute -right-10 -bottom-10 opacity-10">
                    <CheckCircle2 size={240} />
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-3xl font-black tracking-tight leading-none mb-2">{t.voteSuccessMsg}</h3>
                      <p className="text-green-600 bg-white px-4 py-1.5 rounded-full inline-block text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">Ballot Instance: Secured</p>
                      <p className="text-green-100 font-medium text-lg leading-tight">
                        {t.personalizedConfirm} {votedCandidateId && `Your ballot for ${candidates.find(c => c.id === votedCandidateId)?.name || 'the candidate'} has been counted.`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setJustVoted(false)}
                    className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-widest backdrop-blur-md transition-all relative z-10 shrink-0 border border-white/20"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
              {/* Verification Info Block */}
              <div className={`col-span-12 lg:col-span-4 row-span-3 rounded-3xl border p-8 shadow-sm flex flex-col ${cardClass}`}>
                <h2 className={`text-xs font-black uppercase tracking-[0.2em] mb-8 ${labelClass}`}>Verification Status</h2>
                <div className="space-y-6 flex-grow">
                  {[
                    { label: 'Aadhar Identity', value: `XXXX XXXX ${aadhar.slice(-4) || '8123'}`, active: true },
                    { label: 'Facial Recognition', value: 'Match Score: 99.8%', active: true },
                    { label: 'Fingerprint Scan', value: 'Authentication Success', active: true }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${highContrast ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-100'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${highContrast ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>✓</div>
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${labelClass}`}>{item.label}</p>
                        <p className="font-bold tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-8 pt-6 border-t ${highContrast ? 'border-zinc-700' : 'border-slate-100'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${labelClass}`}>Security Node</p>
                  <p className={`text-[10px] font-medium mt-1 ${subTextClass}`}>Encrypted Gateway: Delhi-NCR / NRI</p>
                </div>
              </div>

              {/* Main Results Dashboard */}
                <div className={`col-span-12 lg:col-span-8 row-span-4 rounded-[32px] md:rounded-3xl border p-6 md:p-10 shadow-sm flex flex-col ${cardClass}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setAppState('LANDING')}
                        className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100/50 active:scale-95 group"
                        title="Back to Home"
                      >
                        <Home size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">National Live Results</h2>
                        <p className={`${subTextClass} font-medium text-sm`}>Real-time telemetry from ECI Secure Network</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="flex items-center justify-start sm:justify-end gap-2 mb-1">
                      <motion.div 
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-red-500 rounded-full"
                      />
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${labelClass}`}>{t.liveParticipation || 'Live Participation'}</p>
                    </div>
                    <div className="overflow-hidden">
                      <motion.p 
                        key={animatedTotal}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        className="text-3xl md:text-5xl font-mono font-bold text-indigo-600 tracking-tighter leading-none"
                      >
                        {animatedTotal.toLocaleString()}
                      </motion.p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 flex-grow">
                  {candidates.map(candidate => {
                    const total = candidates.reduce((sum, c) => sum + c.votes, 0);
                    const percentage = total > 0 ? Math.round((candidate.votes / total) * 100) : 0;
                    
                    return (
                      <div key={candidate.id} className="space-y-3">
                        <div className="flex justify-between text-sm font-bold items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{candidate.symbol}</span>
                            <span className="uppercase tracking-tight">{_getCandidateName(candidate)}</span>
                          </div>
                          <div className="overflow-hidden">
                            <AnimatePresence mode="wait">
                              <motion.span 
                                key={candidate.votes}
                                initial={{ y: 10, opacity: 0, filter: 'brightness(2)' }}
                                animate={{ y: 0, opacity: 1, filter: 'brightness(1)' }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "backOut" }}
                                className={`font-mono transition-colors ${highContrast ? 'text-white' : 'text-slate-900'}`}
                              >
                                {percentage}% ({candidate.votes.toLocaleString()})
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className={`w-full h-4 rounded-full overflow-hidden p-0.5 border ${highContrast ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-100 border-slate-200'}`}>
                          <motion.div 
                            className="h-full bg-indigo-600 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-10 flex flex-wrap gap-6 text-[10px] font-bold border-t pt-8 uppercase tracking-widest ${highContrast ? 'border-zinc-700 text-zinc-500' : 'border-slate-100 text-slate-400'}`}>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Secure P2P
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Blockchain Proof
                  </span>
                  <span className="ml-auto opacity-60">Verified: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Voting Status Final Card */}
              <div className="col-span-12 lg:col-span-4 row-span-3 bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 overflow-hidden relative">
                <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
                   <Clock size={200} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mb-2">{t.electionCountdown}</h3>
                  <div className="scale-75 origin-left">
                    <CountdownDisplay />
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 p-6 rounded-2xl flex flex-col gap-4 relative z-10">
                   <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{t.totalParticipated}</p>
                    <p className="text-3xl font-black tracking-tighter">{(animatedTotal * 1.5).toLocaleString()}</p>
                   </div>
                  <p className="text-xs leading-relaxed font-medium opacity-90">
                    {t.statusCompleted}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Syncing with Node 7-A</span>
                  </div>
                </div>
              </div>

              {/* Stats Block 1 */}
              <div className={`col-span-6 lg:col-span-3 row-span-2 rounded-3xl border p-8 shadow-sm flex flex-col justify-center ${cardClass}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${labelClass}`}>Constituency Lead</p>
                <p className="text-xl font-bold leading-tight">North Delhi Central</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-indigo-600 font-black">+14.2%</span>
                  <span className={`text-[10px] font-bold uppercase ${labelClass}`}>Swing Predicted</span>
                </div>
              </div>

              {/* Stats Block 2 */}
              <div className={`col-span-6 lg:col-span-3 row-span-2 rounded-3xl border p-8 shadow-sm flex flex-col justify-center items-center text-center ${cardClass}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold ${highContrast ? 'bg-amber-900 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>!</div>
                <p className={`text-[10px] font-bold uppercase tracking-widest leading-normal ${subTextClass}`}>
                  Elderly Mode: <span className="text-amber-600">Active</span><br />
                  Voice Feedback: 100%
                </p>
              </div>

              {/* Stats Block 3 (Terminal) */}
              <div className={`hidden lg:flex col-span-2 row-span-2 rounded-3xl p-8 text-white flex-col justify-between overflow-hidden relative ${highContrast ? 'bg-zinc-800' : 'bg-slate-900'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldCheck size={100} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">System Core</span>
                <div className="space-y-1 relative z-10">
                  <div className="h-1 w-full bg-indigo-500 opacity-50"></div>
                  <div className="h-1 w-3/4 bg-indigo-500 opacity-30"></div>
                </div>
                <p className="text-[10px] font-mono opacity-40 truncate">NODE: 8B-91X-AA2</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Voice Assistant Overlay - Bento Styled */}
      <AnimatePresence>
        {isVoiceActive && voiceText && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-12 right-12 p-6 rounded-[32px] shadow-2xl flex items-start gap-5 z-[500] max-w-sm border-l-4 border-l-indigo-600 border ${
              highContrast ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className={`p-3 rounded-2xl flex-shrink-0 shadow-lg ${
              highContrast ? 'bg-indigo-600/20 text-indigo-400 shadow-none' : 'bg-indigo-600 text-white shadow-indigo-100'
            }`}>
              <Mic size={18} className="animate-pulse" />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 leading-none ${labelClass}`}>Voice Assistant Guidance</p>
              <p className="text-sm font-bold leading-tight">
                "{voiceText}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* FAQ Modal */}
      <AnimatePresence>
        {isFAQOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl"
            onClick={() => setIsFAQOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-[40px] shadow-2xl p-10 relative overflow-hidden max-h-[80vh] overflow-y-auto ${cardClass}`}
            >
              <button 
                onClick={() => setIsFAQOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close FAQ"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <HelpCircle size={30} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">{t.faqTitle}</h3>
                  <p className={`text-xs font-bold uppercase tracking-widest ${labelClass}`}>SmartVote-AI Support Hub</p>
                </div>
              </div>

              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <h4 className="text-lg font-bold text-indigo-600 flex items-start gap-3">
                      <span className="opacity-40 font-mono">Q{i}.</span>
                      {/* @ts-ignore */}
                      {t[`faqQ${i}`]}
                    </h4>
                    <p className={`text-base font-medium leading-relaxed pl-10 ${subTextClass}`}>
                      {/* @ts-ignore */}
                      {t[`faqA${i}`]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${labelClass}`}>Contact: support@eci.gov.in</p>
                <button
                  onClick={() => setIsFAQOpen(false)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubtitles && voiceText && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-6 pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-md text-white p-6 rounded-[32px] text-center shadow-2xl border border-white/10">
              <p className="text-xl font-bold leading-relaxed tracking-tight">
                {voiceText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Help Button */}
      {appState !== 'LANDING' && (
        <motion.button
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleHelp}
          className="fixed bottom-6 right-6 md:bottom-8 md:left-8 z-[500] bg-indigo-600 text-white p-4 md:p-5 rounded-full shadow-2xl shadow-indigo-300 flex items-center justify-center group"
          aria-label="Help Assistant"
        >
          <div className="absolute -top-12 md:left-0 right-0 md:right-auto bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest text-center">
            24/7 AI Assistant
          </div>
          <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />
        </motion.button>
      )}

      {/* AI Help Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full max-w-lg rounded-t-[32px] sm:rounded-[40px] shadow-2xl p-6 sm:p-12 relative overflow-hidden ${cardClass}`}
            >
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{t.helpTitle}</h3>
                  <p className={`text-xs font-bold uppercase tracking-widest ${labelClass}`}>{t.helpSub}</p>
                </div>
              </div>

              <div className={`min-h-[120px] md:min-h-[160px] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-2 border-dashed ${highContrast ? 'border-zinc-700 bg-zinc-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
                {isHelpLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-[0.2em]">Consulting AI Assistant...</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex gap-3">
                      <MessageSquare className="text-indigo-600 shrink-0 mt-1" size={20} />
                      <p className="text-lg font-medium leading-relaxed tracking-tight">
                        {helpContent}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Got it
                </button>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Candidate Profile Modal */}
      <AnimatePresence>
        {viewingCandidate && (
          <CandidateModal 
            candidate={viewingCandidate} 
            onClose={() => setViewingCandidate(null)} 
            t={t}
            cardClass={cardClass}
            labelClass={labelClass}
            subTextClass={subTextClass}
            highContrast={highContrast}
            getCandidateName={_getCandidateName}
          />
        )}
      </AnimatePresence>
<button onClick={async () => {
  try {
    const res = await fetch('/api/verify-aadhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aadhaar: "123456789012",
        mobile: "9876543210"
      })
    });

    console.log("Request sent");
    console.log("Status:", res.status);

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("PARSED:", data);
      alert("API Success ✅");
    } catch (e) {
      console.error("JSON ERROR:", e);
      alert("Not JSON response ❌");
    }

  } catch (e) {
    alert("API Failed ❌");
    console.error(e);
  }
}}>
  TEST API
</button>
</div>
);
}