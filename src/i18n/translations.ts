export type Language = 'en' | 'hi' | 'ta';

export interface Translations {
  // Common
  siteTitle: string;
  yamahaDay: string;
  kandoFromHome: string;
  copyright: string;
  home: string;
  terms: string;
  privacy: string;
  adminPortal: string;
  changeLanguage: string;
  
  // Landing Page
  createYour: string;
  kandoMoment: string;
  landingSubtitle: string;
  chooseLanguage: string;
  enterSite: string;
  footerQuote: string;
  
  // Home Page
  homeHeroTitle: string;
  homeHeroDesc: string;
  ceoMessageTitle: string;
  ceoMessageBody: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  startSubmissionBtn: string;
  submissionDeadlineText: string;
  
  // Form 1
  form1Title: string;
  form1Subtitle: string;
  empNameLabel: string;
  empNamePlaceholder: string;
  empIdLabel: string;
  empIdPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  familyCountLabel: string;
  familyCountPlaceholder: string;
  
  // Media Uploads
  mediaUploadTitle: string;
  mediaUploadSubtitle: string;
  videoUploadLabel: string;
  photo1UploadLabel: string;
  photo2UploadLabel: string;
  uploadDragDropText: string;
  uploadBrowseText: string;
  maxSizeText: string;
  fileSelectedText: string;
  
  // Consents & Submit
  dataConsentText: string;
  mediaConsentText: string;
  submitForm1Btn: string;
  
  // Thank You 1
  thankYou1Title: string;
  thankYou1Subtitle: string;
  refIdLabel: string;
  proceedToForm2Btn: string;
  
  // Form 2
  form2Title: string;
  form2Subtitle: string;
  authGateTitle: string;
  authGateDesc: string;
  verifyEmpBtn: string;
  verifiedBadgeText: string;
  ceoQuestionTitle: string;
  ceoQuestionText: string;
  reflectionPlaceholder: string;
  submitForm2Btn: string;
  
  // Thank You 2
  thankYou2Title: string;
  thankYou2Subtitle: string;
  finalRefIdLabel: string;
  certBadgeTitle: string;
  downloadCertBtn: string;
  backHomeBtn: string;
  
  // Legal
  privacyPolicyTitle: string;
  termsConditionsTitle: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    siteTitle: "Yamaha Day 2026 · Kando From Home",
    yamahaDay: "YAMAHA DAY 2026",
    kandoFromHome: "KANDO FROM HOME",
    copyright: "© 2026 Yamaha Motor India Group. All Rights Reserved.",
    home: "Home",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    adminPortal: "Admin Portal",
    changeLanguage: "Change Language",

    // Landing
    createYour: "Create Your",
    kandoMoment: "Kando Moment ♡",
    landingSubtitle: "A feeling of joy, pride and togetherness. This Yamaha Day, create a special moment with your family and share it with Yamaha.",
    chooseLanguage: "CHOOSE YOUR LANGUAGE",
    enterSite: "ENTER SITE >",
    footerQuote: "Behind every Yamaha action is a family that inspires it.",

    // Home
    homeHeroTitle: "Celebrate Yamaha Day 2026 at Home",
    homeHeroDesc: "Kando is a Japanese word for the simultaneous feelings of deep satisfaction and intense excitement that we experience when we encounter something of exceptional value. Build your DIY kit with your loved ones, share your creation, and join thousands of Yamaha families across India!",
    ceoMessageTitle: "A Special Message from Yamaha Leadership",
    ceoMessageBody: "Dear Yamaha Family, on this Yamaha Day, we honor your dedication and the incredible support of your families. The Kando From Home DIY kit is our tribute to your joint creativity. We look forward to seeing your family's unique Kando moments!",
    howItWorksTitle: "How to Participate",
    step1Title: "Assemble Your DIY Kit",
    step1Desc: "Unpack your Family Day DIY Kit and assemble the craft board together with your family.",
    step2Title: "Submit Form 1 (Details & Media)",
    step2Desc: "Upload 1 video and 2 photos of your completed DIY kit along with your employee details.",
    step3Title: "Answer CEO Reflective Question",
    step3Desc: "Validate your Employee ID in Form 2 and share your reflection on family togetherness.",
    step4Title: "Get Your Kando Certificate",
    step4Desc: "Receive your unique Reference ID and downloadable Yamaha Kando Family Certificate 2026.",
    startSubmissionBtn: "Start Submission Now",
    submissionDeadlineText: "Campaign Submission Window: 27 July 2026 – 15 August 2026",

    // Form 1
    form1Title: "Form 1: Personal Details & Media Upload",
    form1Subtitle: "Please fill out all mandatory fields and attach high-quality media of your completed DIY creation.",
    empNameLabel: "Employee Full Name *",
    empNamePlaceholder: "e.g. Rahul Sharma",
    empIdLabel: "Employee ID *",
    empIdPlaceholder: "e.g. YMI-1049",
    emailLabel: "Official Email Address *",
    emailPlaceholder: "rahul.sharma@yamaha-motor.co.in",
    phoneLabel: "Mobile Phone Number *",
    phonePlaceholder: "+91 98765 43210",
    cityLabel: "City / Plant Location *",
    cityPlaceholder: "e.g. Surajpur / Chennai / Kanchipuram / Gurgaon",
    familyCountLabel: "Number of Participating Family Members *",
    familyCountPlaceholder: "e.g. 4",

    // Media
    mediaUploadTitle: "DIY Creation Media Upload",
    mediaUploadSubtitle: "Upload 1 video (showing creation in action) and 2 clear photos (max 50MB per file).",
    videoUploadLabel: "DIY Video (1 Video File - Max 50MB) *",
    photo1UploadLabel: "DIY Creation Photo 1 (Max 50MB) *",
    photo2UploadLabel: "DIY Creation Photo 2 (Max 50MB) *",
    uploadDragDropText: "Drag & drop file here, or",
    uploadBrowseText: "Browse File",
    maxSizeText: "Accepted formats: MP4, MOV, JPG, PNG (Max 50MB)",
    fileSelectedText: "File attached successfully",

    // Consents
    dataConsentText: "I consent to Yamaha Motor India storing and processing my personal data for Yamaha Day 2026.",
    mediaConsentText: "I grant permission to Yamaha Motor India Group to feature my family's photos & video in internal and promotional showcases.",
    submitForm1Btn: "Submit Form 1 & Proceed to CEO Question",

    // Thank You 1
    thankYou1Title: "Form 1 Submitted Successfully!",
    thankYou1Subtitle: "Your employee details and media files have been safely uploaded to the server.",
    refIdLabel: "Form 1 Submission Reference ID",
    proceedToForm2Btn: "Proceed to Form 2 (CEO Reflective Question)",

    // Form 2
    form2Title: "Form 2: CEO Reflective Question",
    form2Subtitle: "Reflect on your family's journey while completing the Kando From Home DIY kit.",
    authGateTitle: "Employee Authentication Gate",
    authGateDesc: "Please enter your Employee ID to unlock and verify your Form 1 submission.",
    verifyEmpBtn: "Verify Employee ID",
    verifiedBadgeText: "Verified Employee Record",
    ceoQuestionTitle: "Reflective Question from Yamaha CEO & MD",
    ceoQuestionText: "\"What was the most special moment your family experienced while completing this DIY kit together, and how does it reflect Yamaha's spirit of Kando in your daily life?\"",
    reflectionPlaceholder: "Share your family's story, emotions, key takeaways, and how working together brought joy and excitement...",
    submitForm2Btn: "Complete Final Submission & Get Certificate",

    // Thank You 2
    thankYou2Title: "Congratulations! Your Submission is Complete",
    thankYou2Subtitle: "Thank you for participating in Yamaha Day 2026 Kando From Home. Your entry has been shortlisted for the admin review process.",
    finalRefIdLabel: "Final Campaign Reference ID",
    certBadgeTitle: "Yamaha Kando Family Certified 2026",
    downloadCertBtn: "Download Digital Kando Certificate (PDF)",
    backHomeBtn: "Back to Home Page",

    // Legal
    privacyPolicyTitle: "Data Privacy & PII Protection Policy",
    termsConditionsTitle: "Campaign Terms & Media Rights Conditions"
  },

  hi: {
    siteTitle: "यामाहा डे 2026 · कांदो फ्रॉम होम",
    yamahaDay: "यामाहा डे 2026",
    kandoFromHome: "कांदो फ्रॉम होम",
    copyright: "© 2026 यामाहा मोटर इंडिया ग्रुप। सर्वाधिकार सुरक्षित।",
    home: "होम",
    terms: "नियम और शर्तें",
    privacy: "गोपनीयता नीति",
    adminPortal: "एडमिन पोर्टल",
    changeLanguage: "भाषा बदलें",

    // Landing
    createYour: "बनाएं अपना",
    kandoMoment: "कांदो मोमेंट ♡",
    landingSubtitle: "आनंद, गर्व और एकजुटता की भावना। इस यामाहा डे पर, अपने परिवार के साथ एक विशेष क्षण बनाएं और इसे यामाहा के साथ साझा करें।",
    chooseLanguage: "अपनी भाषा चुनें",
    enterSite: "साइट में प्रवेश करें >",
    footerQuote: "यामाहा के हर कार्य के पीछे एक परिवार है जो इसे प्रेरित करता है।",

    // Home
    homeHeroTitle: "घर पर मनाएं यामाहा डे 2026",
    homeHeroDesc: "कांदो (Kando) एक जापानी शब्द है जिसका अर्थ है गहरा संतोष और उत्साह। अपने प्रियजनों के साथ DIY किट बनाएं, अपनी रचना साझा करें, और भारत भर के हजारों यामाहा परिवारों से जुड़ें!",
    ceoMessageTitle: "यामाहा नेतृत्व से एक विशेष संदेश",
    ceoMessageBody: "प्रिय यामाहा परिवार, इस यामाहा डे पर हम आपके समर्पण और आपके परिवारों के अद्भुत समर्थन का सम्मान करते हैं। कांदो फ्रॉम होम DIY किट आपकी संयुक्त रचनात्मकता को हमारी श्रद्धांजलि है।",
    howItWorksTitle: "भाग कैसे लें",
    step1Title: "अपनी DIY किट असेंबल करें",
    step1Desc: "अपनी फैमिली डे DIY किट खोलें और अपने परिवार के साथ मिलकर क्राफ्ट बोर्ड असेंबल करें।",
    step2Title: "फॉर्म 1 भरें (विवरण और मीडिया)",
    step2Desc: "अपने कर्मचारी विवरण के साथ अपनी तैयार DIY किट के 1 वीडियो और 2 फोटो अपलोड करें।",
    step3Title: "सीईओ के प्रश्न का उत्तर दें",
    step3Desc: "फॉर्म 2 में अपनी एम्प्लॉई आईडी सत्यापित करें और पारिवारिक एकजुटता पर अपने विचार साझा करें।",
    step4Title: "अपना कांदो प्रमाणपत्र प्राप्त करें",
    step4Desc: "अपनी विशिष्ट संदर्भ आईडी और डाउनलोड करने योग्य यामाहा कांदो फैमिली सर्टिफिकेट 2026 प्राप्त करें।",
    startSubmissionBtn: "सबमिशन शुरू करें",
    submissionDeadlineText: "अभियान जमा करने की अवधि: 27 जुलाई 2026 - 15 अगस्त 2026",

    // Form 1
    form1Title: "फॉर्म 1: व्यक्तिगत विवरण और मीडिया अपलोड",
    form1Subtitle: "कृपया सभी अनिवार्य फ़ील्ड भरें और अपनी पूर्ण DIY रचना के उच्च-गुणवत्ता वाले मीडिया संलग्न करें।",
    empNameLabel: "कर्मचारी का पूरा नाम *",
    empNamePlaceholder: "उदा. राहुल शर्मा",
    empIdLabel: "कर्मचारी आईडी *",
    empIdPlaceholder: "उदा. YMI-1049",
    emailLabel: "आधिकारिक ईमेल पता *",
    emailPlaceholder: "rahul.sharma@yamaha-motor.co.in",
    phoneLabel: "मोबाइल फोन नंबर *",
    phonePlaceholder: "+91 98765 43210",
    cityLabel: "शहर / प्लांट स्थान *",
    cityPlaceholder: "उदा. सूरजपुर / चेन्नई / कांचीपुरम / गुड़गांव",
    familyCountLabel: "भाग लेने वाले परिवार के सदस्यों की संख्या *",
    familyCountPlaceholder: "उदा. 4",

    // Media
    mediaUploadTitle: "DIY क्रिएशन मीडिया अपलोड",
    mediaUploadSubtitle: "1 वीडियो और 2 स्पष्ट फ़ोटो अपलोड करें (अधिकतम 50MB प्रति फ़ाइल)।",
    videoUploadLabel: "DIY वीडियो (1 वीडियो फ़ाइल - अधिकतम 50MB) *",
    photo1UploadLabel: "DIY निर्माण फोटो 1 (अधिकतम 50MB) *",
    photo2UploadLabel: "DIY निर्माण फोटो 2 (अधिकतम 50MB) *",
    uploadDragDropText: "फ़ाइल यहाँ खींचें और छोड़ें, या",
    uploadBrowseText: "फ़ाइल ब्राउज़ करें",
    maxSizeText: "स्वीकृत प्रारूप: MP4, MOV, JPG, PNG (अधिकतम 50MB)",
    fileSelectedText: "फ़ाइल सफलतापूर्वक संलग्न की गई",

    // Consents
    dataConsentText: "मैं यामाहा डे 2026 के लिए अपने व्यक्तिगत डेटा को संग्रहीत और संसाधित करने की सहमति देता हूं।",
    mediaConsentText: "मैं यामाहा मोटर इंडिया ग्रुप को आंतरिक और प्रचार प्रदर्शनों में अपने परिवार की तस्वीरों और वीडियो को प्रदर्शित करने की अनुमति देता हूं।",
    submitForm1Btn: "फॉर्म 1 जमा करें और सीईओ प्रश्न पर जाएं",

    // Thank You 1
    thankYou1Title: "फॉर्म 1 सफलतापूर्वक जमा हो गया!",
    thankYou1Subtitle: "आपके कर्मचारी विवरण और मीडिया फाइलें सर्वर पर सुरक्षित रूप से अपलोड कर दी गई हैं।",
    refIdLabel: "फॉर्म 1 सबमिशन संदर्भ आईडी",
    proceedToForm2Btn: "फॉर्म 2 (सीईओ चिंतनशील प्रश्न) पर आगे बढ़ें",

    // Form 2
    form2Title: "फॉर्म 2: सीईओ चिंतनशील प्रश्न",
    form2Subtitle: "कांदो फ्रॉम होम DIY किट को पूरा करते हुए अपने परिवार की यात्रा पर विचार करें।",
    authGateTitle: "कर्मचारी प्रमाणीकरण गेट",
    authGateDesc: "अपने फॉर्म 1 सबमिशन को अनलॉक और सत्यापित करने के लिए कृपया अपनी कर्मचारी आईडी दर्ज करें।",
    verifyEmpBtn: "कर्मचारी आईडी सत्यापित करें",
    verifiedBadgeText: "सत्यापित कर्मचारी रिकॉर्ड",
    ceoQuestionTitle: "यामाहा सीईओ और एमडी की ओर से प्रश्न",
    ceoQuestionText: "\"इस DIY किट को एक साथ पूरा करते समय आपके परिवार ने कौन सा सबसे विशेष क्षण अनुभव किया, और यह आपके दैनिक जीवन में यामाहा की कांदो भावना को कैसे दर्शाता है?\"",
    reflectionPlaceholder: "अपने परिवार की कहानी, भावनाओं और एक साथ काम करने के अनुभव को साझा करें...",
    submitForm2Btn: "अंतिम सबमिशन पूरा करें और प्रमाणपत्र प्राप्त करें",

    // Thank You 2
    thankYou2Title: "बधाई हो! आपका सबमिशन पूरा हो गया है",
    thankYou2Subtitle: "यामाहा डे 2026 कांदो फ्रॉम होम में भाग लेने के लिए धन्यवाद। आपकी प्रविष्टि को एडमिन समीक्षा के लिए शॉर्टलिस्ट कर लिया गया है।",
    finalRefIdLabel: "अंतिम अभियान संदर्भ आईडी",
    certBadgeTitle: "यामाहा कांदो फैमिली सर्टिफाइड 2026",
    downloadCertBtn: "डिजिटल कांदो प्रमाणपत्र डाउनलोड करें (PDF)",
    backHomeBtn: "मुख्य पृष्ठ पर वापस जाएं",

    // Legal
    privacyPolicyTitle: "डेटा गोपनीयता और PII सुरक्षा नीति",
    termsConditionsTitle: "अभियान नियम और मीडिया अधिकार शर्तें"
  },

  ta: {
    siteTitle: "யமஹா டே 2026 · காண்டோ ஃப்ரம் ஹோம்",
    yamahaDay: "யமஹா டே 2026",
    kandoFromHome: "காண்டோ ஃப்ரம் ஹோம்",
    copyright: "© 2026 யமஹா மோட்டார் இந்தியா குரூப். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    home: "முகப்பு",
    terms: "விதிமுறைகள் & நிபந்தனைகள்",
    privacy: "தனியுரிமைக் கொள்கை",
    adminPortal: "நிர்வாகி போர்டல்",
    changeLanguage: "மொழியை மாற்றவும்",

    // Landing
    createYour: "உருவாக்குங்கள் உங்கள்",
    kandoMoment: "காண்டோ தருணம் ♡",
    landingSubtitle: "மகிழ்ச்சி, பெருமை மற்றும் ஒற்றுமையின் உணர்வு. இந்த யமஹா தினத்தில், உங்கள் குடும்பத்துடன் ஒரு சிறப்பு தருணத்தை உருவாக்கி யமஹாவுடன் பகிர்ந்து கொள்ளுங்கள்.",
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    enterSite: "தளத்திற்குள் செல்லவும் >",
    footerQuote: "ஒவ்வொரு யமஹா செயலின் பின்னாலும் அதை ஊக்குவிக்கும் ஒரு குடும்பம் உள்ளது.",

    // Home
    homeHeroTitle: "வீட்டில் யமஹா டே 2026 ஐக் கொண்டாடுங்கள்",
    homeHeroDesc: "காண்டோ (Kando) என்பது ஜப்பானிய வார்த்தை, இது மிகுந்த திருப்தியையும் உற்சாகத்தையும் குறிக்கிறது. உங்கள் குடும்பத்துடன் DIY கிட் உருவாக்கி யமஹா குடும்பங்களுடன் இணையுங்கள்!",
    ceoMessageTitle: "யமஹா தலைமையின் சிறப்பு செய்தி",
    ceoMessageBody: "அன்பான யமஹா குடும்பமே, இந்த யமஹா நாளில் உங்கள் அர்ப்பணிப்பையும் உங்கள் குடும்பத்தினரின் ஆதரவையும் நாங்கள் கவுரவிக்கிறோம்.",
    howItWorksTitle: "பங்கேற்பது எப்படி",
    step1Title: "உங்கள் DIY கிட்டைக் கூடியுங்கள்",
    step1Desc: "உங்கள் குடும்ப தின DIY கிட்டைக் திறந்து கிராஃப்ட் போர்டை உங்கள் குடும்பத்தினருடன் ஒன்றுசேர்க்கவும்.",
    step2Title: "படிவம் 1 ஐச் சமர்ப்பிக்கவும்",
    step2Desc: "உங்கள் விவரங்களுடன் 1 வீடியோ மற்றும் 2 புகைப்படங்களைப் பதிவேற்றவும்.",
    step3Title: "சிஇஓ கேள்விக்கு பதிலளிக்கவும்",
    step3Desc: "படிவம் 2 இல் உங்கள் பணியாளர் ஐடியை சரிபார்த்து கருத்துக்களைப் பகிரவும்.",
    step4Title: "சான்றிதழைப் பெறுங்கள்",
    step4Desc: "உங்கள் தனித்துவமான குறிப்பு ஐடி மற்றும் யமஹா காண்டோ சான்றிதழ் 2026 ஐப் பெறுங்கள்.",
    startSubmissionBtn: "சமர்ப்பிக்கத் தொடங்குங்கள்",
    submissionDeadlineText: "சமர்ப்பிப்பு காலம்: 27 ஜூலை 2026 – 15 ஆகஸ்ட் 2026",

    // Form 1
    form1Title: "படிவம் 1: தனிப்பட்ட விவரங்கள் & ஊடகப் பதிவேற்றம்",
    form1Subtitle: "தேவையான விவரங்களை நிரப்பி உங்கள் படைப்பின் படங்களை பதிவேற்றவும்.",
    empNameLabel: "பணியாளர் முழுப் பெயர் *",
    empNamePlaceholder: "எ.கா. ராகுல் சர்மா",
    empIdLabel: "பணியாளர் ஐடி *",
    empIdPlaceholder: "எ.கா. YMI-1049",
    emailLabel: "அதிகாரப்பூர்வ மின்னஞ்சல் *",
    emailPlaceholder: "rahul.sharma@yamaha-motor.co.in",
    phoneLabel: "கைபேசி எண் *",
    phonePlaceholder: "+91 98765 43210",
    cityLabel: "நகரம் / ஆலை இருப்பிடம் *",
    cityPlaceholder: "எ.கா. சென்னை / காஞ்சிபுரம் / சூரஜ்பூர்",
    familyCountLabel: "பங்கேற்கும் குடும்ப உறுப்பினர்கள் எண்ணிக்கை *",
    familyCountPlaceholder: "எ.கா. 4",

    // Media
    mediaUploadTitle: "DIY படைப்பு ஊடகப் பதிவேற்றம்",
    mediaUploadSubtitle: "1 வீடியோ மற்றும் 2 படங்களைப் பதிவேற்றவும் (அதிகபட்சம் 50MB).",
    videoUploadLabel: "DIY வீடியோ (1 வீடியோ கோப்பு - அதிகபட்சம் 50MB) *",
    photo1UploadLabel: "DIY புகைப்பட 1 (அதிகபட்சம் 50MB) *",
    photo2UploadLabel: "DIY புகைப்பட 2 (அதிகபட்சம் 50MB) *",
    uploadDragDropText: "கோப்பை இங்கே இழுத்து விடவும், அல்லது",
    uploadBrowseText: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    maxSizeText: "ஏற்றுக்கொள்ளப்பட்ட வடிவங்கள்: MP4, MOV, JPG, PNG (அதிகபட்சம் 50MB)",
    fileSelectedText: "கோப்பு வெற்றிகரமாக இணைக்கப்பட்டது",

    // Consents
    dataConsentText: "யமஹா டே 2026 க்காக எனது தனிப்பட்ட தரவைச் சேமிக்க நான் ஒப்புக்கொள்கிறேன்.",
    mediaConsentText: "எனது குடும்பப் படங்களை விளம்பரங்களில் பயன்படுத்த யமஹா மோட்டார் இந்தியா குழுவிற்கு அனுமதி வழங்குகிறேன்.",
    submitForm1Btn: "படிவம் 1 சமர்ப்பித்து சிஇஓ கேள்விக்குச் செல்லவும்",

    // Thank You 1
    thankYou1Title: "படிவம் 1 வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    thankYou1Subtitle: "உங்கள் விவரங்கள் மற்றும் கோப்புகள் சேவையகத்தில் பாதுகாப்பாக பதிவேற்றப்பட்டுள்ளன.",
    refIdLabel: "படிவம் 1 சமர்ப்பிப்பு குறிப்பு ஐடி",
    proceedToForm2Btn: "படிவம் 2 (சிஇஓ கேள்வி) க்குச் செல்லவும்",

    // Form 2
    form2Title: "படிவம் 2: சிஇஓ பிரதிபலிப்பு கேள்வி",
    form2Subtitle: "DIY கிட்டினை நிறைவு செய்தபோது உங்கள் குடும்பத்தின் அனுபவத்தை சிந்தியுங்கள்.",
    authGateTitle: "பணியாளர் அங்கீகார வாயில்",
    authGateDesc: "உங்கள் படிவம் 1 சமர்ப்பிப்பைத் திறக்க பணியாளர் ஐடியை உள்ளிடவும்.",
    verifyEmpBtn: "பணியாளர் ஐடியை சரிபார்க்கவும்",
    verifiedBadgeText: "சரிபார்க்கப்பட்ட பணியாளர் பதிவு",
    ceoQuestionTitle: "யமஹா சிஇஓ அவர்களின் சிந்தனைக் கேள்வி",
    ceoQuestionText: "\"இந்த DIY கிட்டினை ஒன்றாகச் செய்து முடித்தபோது உங்கள் குடும்பம் அனுபவித்த மிகச் சிறப்பு வாய்ந்த தருணம் எது?\"",
    reflectionPlaceholder: "உங்கள் குடும்பத்தின் அனுபவத்தையும் உணர்வுகளையும் பகிர்ந்து கொள்ளுங்கள்...",
    submitForm2Btn: "இறுதி சமர்ப்பிப்பை முடித்து சான்றிதழைப் பெறுங்கள்",

    // Thank You 2
    thankYou2Title: "வாழ்த்துக்கள்! உங்கள் சமர்ப்பிப்பு முடிந்தது",
    thankYou2Subtitle: "யமஹா டே 2026 காண்டோ ஃப்ரம் ஹோமில் பங்கேற்றதற்கு நன்றி. உங்கள் பதிவு தேர்வுக்கு பரிசீலிக்கப்படும்.",
    finalRefIdLabel: "இறுதி பிரச்சார குறிப்பு ஐடி",
    certBadgeTitle: "யமஹா காண்டோ சான்றளிக்கப்பட்ட குடும்பம் 2026",
    downloadCertBtn: "டிஜிட்டல் சான்றிதழைப் பதிவிறக்கவும் (PDF)",
    backHomeBtn: "முகப்புப் பக்கத்திற்குத் திரும்பவும்",

    // Legal
    privacyPolicyTitle: "தரவு தனியுரிமை மற்றும் PII பாதுகாப்பு கொள்கை",
    termsConditionsTitle: "பிரச்சார விதிமுறைகள் மற்றும் ஊடக உரிமை நிபந்தனைகள்"
  }
};
