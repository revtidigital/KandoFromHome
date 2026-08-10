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

  // Home Page Cards
  chooseSubmissionFormTitle: string;
  chooseSubmissionFormDesc: string;
  form1Badge: string;
  form1CardTitle: string;
  form1CardDesc: string;
  form1CardBtn: string;
  form2Badge: string;
  form2CardTitle: string;
  form2CardDesc: string;
  form2CardBtn: string;
  
  // Form 1 & Form 2 Fields
  form1Title: string;
  form1Subtitle: string;
  fullName: string;
  empId: string;
  officialEmail: string;
  phoneNumber: string;
  cityLocation: string;
  familyMembersCount: string;

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
  privacySubtitle: string;
  privacySec1Title: string;
  privacySec1Body: string;
  privacySec2Title: string;
  privacySec2Body: string;
  privacySec3Title: string;
  privacySec3Body: string;
  privacySec4Title: string;
  privacySec4Body: string;
  privacySec5Title: string;
  privacySec5Body: string;

  termsConditionsTitle: string;
  termsSubtitle: string;
  termsSec1Title: string;
  termsSec1Body: string;
  termsSec2Title: string;
  termsSec2Body: string;
  termsSec3Title: string;
  termsSec3Body: string;
  termsSec4Title: string;
  termsSec4Body: string;

  // Section Headings & Upload Labels
  sec1EmployeeDetailsTitle: string;
  sec2UploadPhotosTitle: string;
  sec2UploadPhotosDesc: string;
  photo1Label: string;
  photo2Label: string;
  sec2UploadVideoTitle: string;
  sec2UploadVideoDesc: string;

  // Validation Error Messages
  errEmpNameRequired: string;
  errEmpIdRequired: string;
  errEmailRequired: string;
  errEmailInvalid: string;
  errPhoneRequired: string;
  errPhone10Digits: string;
  errCityRequired: string;
  errPhoto1Required: string;
  errPhoto2Required: string;
  errVideoRequired: string;
  errConsentRequired: string;

  // New-UI static labels (Form1 & Form2)
  backBtn: string;
  companyNameLabel: string;
  noEmpIdNote: string;
  departmentLabel: string;
  locationLabel: string;
  form1PhoneNumberLabel: string;
  consentAgreePrefix: string;
  consentTermsLink: string;
  consentAndWord: string;
  consentPrivacyLink: string;
  privacyNoteTitle: string;
  form1PrivacyNoteBody: string;
  form1MediaConsentText: string;
  form1ThankYouTitle: string;
  form1ThankYouBody: string;
  form1FooterFamilyText: string;
  form2ChairmanTitle: string;
  form2ChairmanScript: string;
  form2ChairmanSub: string;
  form2EmpEinLabel: string;
  form2PhoneNumberLabel: string;
  form2EmployeeNameLabel: string;
  form2ShareThoughtsTitle: string;
  form2ShareThoughtsDesc: string;
  form2BrowseOptionalLabel: string;
  form2BrowseFileCta: string;
  form2ConsentSuffix: string;
  form2SubmitBtn: string;
  form2PrivacyNoteBody: string;
  form2MessageCardLead: string;
  form2MessageCardText: string;
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

    // Home Cards
    chooseSubmissionFormTitle: "Choose Your Submission Form",
    chooseSubmissionFormDesc: "Form 1 and Form 2 are independent. You can submit either or both forms for Yamaha Day 2026.",
    form1Badge: "FORM 1 SUBMISSION",
    form1CardTitle: "DIY Kit Creation & Photos",
    form1CardDesc: "Fill your employee details, upload up to 2 high-quality photos (Max 10MB each) of your assembled Family Day DIY Kit, and share your CEO reflection text.",
    form1CardBtn: "Open & Fill Form 1 →",
    form2Badge: "FORM 2 SUBMISSION",
    form2CardTitle: "Family Kando Video Submission",
    form2CardDesc: "Authenticate your Employee ID and upload 1 family video (Max 40MB) showcasing your family's creation in action and sharing your special Kando moment.",
    form2CardBtn: "Open & Fill Form 2 →",

    // Form 1 & Form 2 Fields
    form1Title: "Form 1: Personal Details & Media Upload",
    form1Subtitle: "Please fill out all mandatory fields and attach high-quality media of your completed DIY creation.",
    fullName: "Employee Full Name",
    empId: "Employee ID",
    officialEmail: "Official Email Address",
    phoneNumber: "Mobile Phone Number",
    cityLocation: "City / Plant Location",
    familyMembersCount: "Number of Participating Family Members",

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
    mediaUploadSubtitle: "Upload 1 video (showing creation in action) and 2 clear photos (max 10MB per image, 40MB per video).",
    videoUploadLabel: "DIY Video (1 Video File - Max 40MB) *",
    photo1UploadLabel: "DIY Creation Photo 1 (Max 10MB) *",
    photo2UploadLabel: "DIY Creation Photo 2 (Max 10MB) *",
    uploadDragDropText: "Drag & drop file here, or",
    uploadBrowseText: "Browse File",
    maxSizeText: "Accepted formats: MP4, MOV, JPG, PNG (Max 10MB photo, 40MB video)",
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
    privacySubtitle: "Last Updated: 27 July 2026 | Compliant with Digital Personal Data Protection (DPDP) Standards",
    privacySec1Title: "1. Scope of Data Collection",
    privacySec1Body: "For the Yamaha Day 2026 \"Kando From Home\" campaign, Yamaha Motor India Group collects employee personal information strictly required for identity validation and campaign administration. This includes Employee Full Name, Employee ID, Official Email Address, Contact Number, Plant/City Location, Family Participation Count, and uploaded media files (photos & video).",
    privacySec2Title: "2. Purpose & Media Consent",
    privacySec2Body: "Personal data collected is used solely for validating participation, shortlisting winning family DIY entries, issuing digital certificates, and organizing Yamaha Day 2026 events. Uploaded photos and videos will only be featured in internal communications and promotional showcases where explicit consent has been provided during Form 1 submission.",
    privacySec3Title: "3. Data Storage, Encryption & Security",
    privacySec3Body: "All submitted data is stored securely in encrypted MongoDB databases and server object storage with signed URL access controls. Access is strictly restricted to authorized administrative personnel with role-based access controls and detailed audit logging.",
    privacySec4Title: "4. Data Retention & Deletion",
    privacySec4Body: "Campaign submissions will be retained for 180 days following the conclusion of Yamaha Day 2026 for archiving and administrative reporting, after which non-featured personal media will be securely purged upon written request from the employee.",
    privacySec5Title: "5. Contact Data Protection Officer",
    privacySec5Body: "For privacy inquiries or data rights requests, please contact the Internal Data Protection Committee at privacy@yamaha-motor.co.in.",

    termsConditionsTitle: "Campaign Terms & Media Rights Conditions",
    termsSubtitle: "Yamaha Day 2026 \"Kando From Home\" Official Campaign Guidelines",
    termsSec1Title: "1. Eligibility",
    termsSec1Body: "The Kando From Home DIY Kit initiative is open to all active employees of Yamaha Motor India Group and their immediate family members across all corporate offices, manufacturing plants (Surajpur, Chennai, Kanchipuram), and regional sales locations.",
    termsSec2Title: "2. Submission Guidelines & File Specifications",
    termsSec2Body: "Each employee is permitted exactly one submission against their valid Employee ID. Submission includes Form 1 (Personal details & up to 2 photos max 10MB each) and Form 2 (1 video max 40MB & CEO Reflection).",
    termsSec3Title: "3. Originality & Safety",
    termsSec3Body: "All submissions must feature original DIY craft assembly completed by the employee and their family. Uploaded content must adhere to corporate conduct guidelines and contain no inappropriate material.",
    termsSec4Title: "4. Shortlisting & Recognition",
    termsSec4Body: "Entries will be evaluated by the Yamaha Day 2026 Admin Committee based on creativity, family participation, and reflection alignment with Yamaha's spirit of Kando.",

    // Section Headings & Upload Labels
    sec1EmployeeDetailsTitle: "1. Employee & Family Details",
    sec2UploadPhotosTitle: "2. Upload Photos (Max 2 Photos, Max 10MB each)",
    sec2UploadPhotosDesc: "Upload up to 2 high-resolution photos of your family Kando DIY Wall (All image formats supported).",
    photo1Label: "Photo 1 (Required, Max 5MB) *",
    photo2Label: "Photo 2 (Required, Max 5MB) *",
    sec2UploadVideoTitle: "Upload Kando Video (Required, Max 40MB) *",
    sec2UploadVideoDesc: "Upload 1 video of your family making the DIY Craft Wall (MP4, WEBM, MOV, etc. Max 40MB limit).",

    // Validation Error Messages
    errEmpNameRequired: "Full Employee Name is required.",
    errEmpIdRequired: "Employee ID is required.",
    errEmailRequired: "Official Yamaha Email address is required.",
    errEmailInvalid: "Please enter a valid email address (e.g. name@yamaha-motor.co.in).",
    errPhoneRequired: "Mobile phone number is required.",
    errPhone10Digits: "Phone number must be exactly 10 digits without country code.",
    errCityRequired: "City / Plant Location is required.",
    errPhoto1Required: "Photo 1 is required.",
    errPhoto2Required: "Photo 2 is required.",
    errVideoRequired: "Kando DIY Video submission is required.",
    errConsentRequired: "You must agree to data processing consent to submit.",

    backBtn: "Back",
    companyNameLabel: "Company Name",
    noEmpIdNote: "Don't have an Employee ID? Leave this blank and enter your Phone Number below.",
    departmentLabel: "Department",
    locationLabel: "Location",
    form1PhoneNumberLabel: "Phone Number",
    consentAgreePrefix: "I agree to the",
    consentTermsLink: "Terms & Conditions",
    consentAndWord: "and",
    consentPrivacyLink: "Privacy Policy",
    privacyNoteTitle: "Your privacy matters.",
    form1PrivacyNoteBody: "Your information, photos and video will be used only for Yamaha Day 2026 activities and will not be shared outside the organization.",
    form1MediaConsentText: "I grant Yamaha permission to feature my submission photos in internal publications.",
    form1ThankYouTitle: "Thank you!",
    form1ThankYouBody: "We can't wait to see your Kando Moment.",
    form1FooterFamilyText: "Together, we celebrate the families behind every Yamaha action.",
    form2ChairmanTitle: "CHAIRMAN INVITES",
    form2ChairmanScript: "Your Thoughts",
    form2ChairmanSub: "Your ideas help us grow better, together.",
    form2EmpEinLabel: "Employee EIN",
    form2PhoneNumberLabel: "Phone Number",
    form2EmployeeNameLabel: "Employee Name",
    form2ShareThoughtsTitle: "Share your thoughts:",
    form2ShareThoughtsDesc: "10 Years from now, what must our brand be doing to ensure (future) customer still choose us over anyone else.",
    form2BrowseOptionalLabel: "Browse (Optional) — Max Size: 50MB",
    form2BrowseFileCta: "Click to browse file (any format, max 50MB)",
    form2ConsentSuffix: "My response may be shared internally at Yamaha.",
    form2SubmitBtn: "SUBMIT — Chairman's Invitation",
    form2PrivacyNoteBody: "Your response will be used only for Yamaha Day 2026 activities and will not be shared outside the organization.",
    form2MessageCardLead: "The future is built by our ideas today.",
    form2MessageCardText: "Share your thoughts and help shape a stronger, more inspiring Yamaha for tomorrow."
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

    // Home Cards
    chooseSubmissionFormTitle: "अपना सबमिशन फॉर्म चुनें",
    chooseSubmissionFormDesc: "फॉर्म 1 और फॉर्म 2 स्वतंत्र हैं। आप यामाहा डे 2026 के लिए इनमें से कोई भी या दोनों फॉर्म जमा कर सकते हैं।",
    form1Badge: "फॉर्म 1 सबमिशन",
    form1CardTitle: "DIY किट निर्माण और तस्वीरें",
    form1CardDesc: "अपने कर्मचारी विवरण भरें, अपनी फैमिली डे DIY किट की अधिकतम 2 उच्च-गुणवत्ता वाली तस्वीरें (प्रत्येक अधिकतम 10MB) अपलोड करें, और अपने सीईओ विचार पाठ साझा करें।",
    form1CardBtn: "फॉर्म 1 खोलें और भरें →",
    form2Badge: "फॉर्म 2 सबमिशन",
    form2CardTitle: "फैमिली कांदो वीडियो सबमिशन",
    form2CardDesc: "अपनी कर्मचारी आईडी सत्यापित करें और अपने परिवार की रचना और विशेष कांदो क्षण प्रदर्शित करने वाला 1 पारिवारिक वीडियो (अधिकतम 40MB) अपलोड करें।",
    form2CardBtn: "फॉर्म 2 खोलें और भरें →",

    // Form 1
    form1Title: "फॉर्म 1: व्यक्तिगत विवरण और मीडिया अपलोड",
    form1Subtitle: "कृपया सभी अनिवार्य फ़ील्ड भरें और अपनी पूर्ण DIY रचना के उच्च-गुणवत्ता वाले मीडिया संलग्न करें।",
    fullName: "कर्मचारी का पूरा नाम",
    empId: "कर्मचारी आईडी",
    officialEmail: "आधिकारिक ईमेल पता",
    phoneNumber: "मोबाइल फोन नंबर",
    cityLocation: "शहर / प्लांट स्थान",
    familyMembersCount: "परिवार के सदस्यों की संख्या",

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
    mediaUploadSubtitle: "1 वीडियो (अधिकतम 40MB) और 2 फोटो (अधिकतम 10MB प्रति फ़ोटो) अपलोड करें।",
    videoUploadLabel: "DIY वीडियो (1 वीडियो फ़ाइल - अधिकतम 40MB) *",
    photo1UploadLabel: "DIY निर्माण फोटो 1 (अधिकतम 10MB) *",
    photo2UploadLabel: "DIY निर्माण फोटो 2 (अधिकतम 10MB) *",
    uploadDragDropText: "फ़ाइल यहाँ खींचें और छोड़ें, या",
    uploadBrowseText: "फ़ाइल ब्राउज़ करें",
    maxSizeText: "स्वीकृत प्रारूप: MP4, MOV, JPG, PNG (अधिकतम 10MB फोटो, 40MB वीडियो)",
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
    privacySubtitle: "अंतिम अद्यतन: 27 जुलाई 2026 | डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) मानकों के अनुरूप",
    privacySec1Title: "1. डेटा संग्रह का दायरा",
    privacySec1Body: "यामाहा डे 2026 \"कांदो फ्रॉम होम\" अभियान के लिए, यामाहा मोटर इंडिया ग्रुप केवल पहचान सत्यापन और अभियान प्रशासन के लिए आवश्यक कर्मचारी व्यक्तिगत जानकारी एकत्र करता है। इसमें कर्मचारी का पूरा नाम, कर्मचारी आईडी, आधिकारिक ईमेल पता, संपर्क नंबर, प्लांट/शहर का स्थान, परिवार की भागीदारी संख्या और अपलोड की गई मीडिया फ़ाइलें शामिल हैं।",
    privacySec2Title: "2. उद्देश्य और मीडिया सहमति",
    privacySec2Body: "एकत्रित व्यक्तिगत डेटा का उपयोग केवल भागीदारी को सत्यापित करने, विजेता पारिवारिक DIY प्रविष्टियों को शॉर्टलिस्ट करने, डिजिटल प्रमाणपत्र जारी करने और यामाहा डे 2026 कार्यक्रमों का आयोजन करने के लिए किया जाता है। अपलोड की गई तस्वीरें और वीडियो केवल आंतरिक संचार और प्रचार प्रदर्शनों में दिखाए जाएंगे जहां सहमति प्रदान की गई है।",
    privacySec3Title: "3. डेटा संग्रहण, एन्क्रिप्शन और सुरक्षा",
    privacySec3Body: "सभी सबमिट किया गया डेटा एन्क्रिप्टेड MongoDB डेटाबेस और सर्वर ऑब्जेक्ट स्टोरेज में सुरक्षित रूप से संग्रहीत किया जाता है। एक्सेस केवल अधिकृत प्रशासनिक कर्मियों तक ही सीमित है।",
    privacySec4Title: "4. डेटा अवधारण और विलोपन",
    privacySec4Body: "अभियान सबमिशन को यामाहा डे 2026 के समापन के बाद 180 दिनों के लिए संग्रहीत किया जाएगा, जिसके बाद कर्मचारी के लिखित अनुरोध पर मीडिया को सुरक्षित रूप से हटा दिया जाएगा।",
    privacySec5Title: "5. डेटा संरक्षण अधिकारी से संपर्क करें",
    privacySec5Body: "गोपनीयता पूछताछ या डेटा अधिकारों के अनुरोधों के लिए, कृपया आंतरिक डेटा संरक्षण समिति से privacy@yamaha-motor.co.in पर संपर्क करें।",

    termsConditionsTitle: "अभियान नियम और मीडिया अधिकार शर्तें",
    termsSubtitle: "यामाहा डे 2026 \"कांदो फ्रॉम होम\" आधिकारिक अभियान दिशानिर्देश",
    termsSec1Title: "1. पात्रता",
    termsSec1Body: "कांदो फ्रॉम होम DIY किट पहल यामाहा मोटर इंडिया ग्रुप के सभी सक्रिय कर्मचारियों और उनके निकटतम परिवार के सदस्यों के लिए खुली है।",
    termsSec2Title: "2. सबमिशन दिशानिर्देश और फ़ाइल विनिर्देश",
    termsSec2Body: "प्रत्येक कर्मचारी को अपनी वैध कर्मचारी आईडी के विरुद्ध केवल एक सबमिशन की अनुमति है। सबमिशन में फॉर्म 1 (अधिकतम 2 तस्वीरें, 10MB प्रत्येक) और फॉर्म 2 (1 वीडियो, अधिकतम 40MB और सीईओ विचार) शामिल हैं।",
    termsSec3Title: "3. मौलिकता और सुरक्षा",
    termsSec3Body: "सभी सबमिशन में कर्मचारी और उनके परिवार द्वारा पूरी की गई मूल DIY क्राफ्ट असेंबली होनी चाहिए।",
    termsSec4Title: "4. शॉर्टलिस्टिंग और मान्यता",
    termsSec4Body: "प्रविष्टियों का मूल्यांकन यामाहा डे 2026 एडमिन समिति द्वारा रचनात्मकता और पारिवारिक भागीदारी के आधार पर किया जाएगा।",

    // Section Headings & Upload Labels
    sec1EmployeeDetailsTitle: "1. कर्मचारी और परिवार विवरण",
    sec2UploadPhotosTitle: "2. तस्वीरें अपलोड करें (अधिकतम 2 तस्वीरें, 10MB प्रत्येक)",
    sec2UploadPhotosDesc: "अपने परिवार की कांदो DIY वॉल की 2 उच्च-गुणवत्ता वाली तस्वीरें अपलोड करें (सभी फोटो प्रारूप समर्थित)।",
    photo1Label: "फोटो 1 (अनिवार्य, अधिकतम 5MB) *",
    photo2Label: "फोटो 2 (अनिवार्य, अधिकतम 5MB) *",
    sec2UploadVideoTitle: "कांदो वीडियो अपलोड करें (अनिवार्य, अधिकतम 40MB) *",
    sec2UploadVideoDesc: "DIY क्राफ्ट वॉल बनाते हुए अपने परिवार का 1 वीडियो अपलोड करें (MP4, WEBM, MOV, अधिकतम 40MB)।",

    // Validation Error Messages
    errEmpNameRequired: "कर्मचारी का पूरा नाम आवश्यक है।",
    errEmpIdRequired: "कर्मचारी आईडी आवश्यक है।",
    errEmailRequired: "आधिकारिक यामाहा ईमेल पता आवश्यक है।",
    errEmailInvalid: "कृपया एक वैध ईमेल पता दर्ज करें (उदा. name@yamaha-motor.co.in)।",
    errPhoneRequired: "मोबाइल फोन नंबर आवश्यक है।",
    errPhone10Digits: "फोन नंबर बिना कंट्री कोड के ठीक 10 अंकों का होना चाहिए।",
    errCityRequired: "शहर / प्लांट स्थान आवश्यक है।",
    errPhoto1Required: "फोटो 1 अनिवार्य है।",
    errPhoto2Required: "फोटो 2 अनिवार्य है।",
    errVideoRequired: "कांदो DIY वीडियो जमा करना अनिवार्य है।",
    errConsentRequired: "सबमिट करने के लिए आपको डेटा प्रोसेसिंग सहमति स्वीकार करनी होगी।",

    backBtn: "वापस",
    companyNameLabel: "कंपनी का नाम",
    noEmpIdNote: "क्या आपके पास कर्मचारी आईडी नहीं है? इसे खाली छोड़ें और नीचे अपना फ़ोन नंबर दर्ज करें।",
    departmentLabel: "विभाग",
    locationLabel: "स्थान",
    form1PhoneNumberLabel: "फ़ोन नंबर",
    consentAgreePrefix: "मैं",
    consentTermsLink: "नियम एवं शर्तों",
    consentAndWord: "और",
    consentPrivacyLink: "गोपनीयता नीति",
    privacyNoteTitle: "आपकी गोपनीयता मायने रखती है।",
    form1PrivacyNoteBody: "आपकी जानकारी, तस्वीरें और वीडियो केवल यामाहा डे 2026 गतिविधियों के लिए उपयोग की जाएंगी और संगठन के बाहर साझा नहीं की जाएंगी।",
    form1MediaConsentText: "मैं यामाहा को आंतरिक प्रकाशनों में अपनी सबमिशन तस्वीरें प्रदर्शित करने की अनुमति देता हूं।",
    form1ThankYouTitle: "धन्यवाद!",
    form1ThankYouBody: "हमें आपके कांदो पल को देखने का इंतज़ार है।",
    form1FooterFamilyText: "हम हर यामाहा कार्रवाई के पीछे के परिवारों का जश्न मनाते हैं।",
    form2ChairmanTitle: "अध्यक्ष आमंत्रित करते हैं",
    form2ChairmanScript: "आपके विचार",
    form2ChairmanSub: "आपके विचार हमें बेहतर बनने में मदद करते हैं, साथ मिलकर।",
    form2EmpEinLabel: "कर्मचारी EIN",
    form2PhoneNumberLabel: "फ़ोन नंबर",
    form2EmployeeNameLabel: "कर्मचारी का नाम",
    form2ShareThoughtsTitle: "अपने विचार साझा करें:",
    form2ShareThoughtsDesc: "आज से 10 साल बाद, हमारे ब्रांड को क्या करना चाहिए ताकि ग्राहक हमेशा हमें ही चुनें।",
    form2BrowseOptionalLabel: "ब्राउज़ करें (वैकल्पिक) — अधिकतम आकार: 50MB",
    form2BrowseFileCta: "फ़ाइल ब्राउज़ करने के लिए क्लिक करें (कोई भी प्रारूप, अधिकतम 50MB)",
    form2ConsentSuffix: "मेरी प्रतिक्रिया यामाहा के भीतर आंतरिक रूप से साझा की जा सकती है।",
    form2SubmitBtn: "सबमिट करें — अध्यक्ष का निमंत्रण",
    form2PrivacyNoteBody: "आपकी प्रतिक्रिया केवल यामाहा डे 2026 गतिविधियों के लिए उपयोग की जाएगी और संगठन के बाहर साझा नहीं की जाएगी।",
    form2MessageCardLead: "भविष्य आज हमारे विचारों से बनता है।",
    form2MessageCardText: "अपने विचार साझा करें और यामाहा को कल के लिए और मजबूत, प्रेरणादायक बनाने में मदद करें।"
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

    // Home Cards
    chooseSubmissionFormTitle: "உங்கள் சமர்ப்பிப்பு படிவத்தைத் தேர்ந்தெடுக்கவும்",
    chooseSubmissionFormDesc: "படிவம் 1 மற்றும் படிவம் 2 ஆகியவை தனித்தனி. இரண்டையும் அல்லது ஒன்றினைச் சமர்ப்பிக்கலாம்.",
    form1Badge: "படிவம் 1 சமர்ப்பிப்பு",
    form1CardTitle: "DIY கிட் உருவாக்கம் & புகைப்படங்கள்",
    form1CardDesc: "உங்கள் விவரங்களை நிரப்பி, 2 புகைப்படங்கள் (அதிகபட்சம் 10MB) மற்றும் சிஇஓ சிந்தனையைப் பகிரவும்.",
    form1CardBtn: "படிவம் 1 ஐத் திறந்து நிரப்பவும் →",
    form2Badge: "படிவம் 2 சமர்ப்பிப்பு",
    form2CardTitle: "குடும்ப காண்டோ வீடியோ சமர்ப்பிப்பு",
    form2CardDesc: "பணியாளர் ஐடியை சரிபார்த்து 1 குடும்ப வீடியோவை (அதிகபட்சம் 40MB) பதிவேற்றவும்.",
    form2CardBtn: "படிவம் 2 ஐத் திறந்து நிரப்பவும் →",

    // Form 1
    form1Title: "படிவம் 1: தனிப்பட்ட விவரங்கள் & ஊடகப் பதிவேற்றம்",
    form1Subtitle: "தேவையான விவரங்களை நிரப்பி உங்கள் படைப்பின் படங்களை பதிவேற்றவும்.",
    fullName: "பணியாளர் முழுப் பெயர்",
    empId: "பணியாளர் ஐடி",
    officialEmail: "அதிகாரப்பூர்வ மின்னஞ்சல்",
    phoneNumber: "கைபேசி எண்",
    cityLocation: "நகரம் / ஆலை இருப்பிடம்",
    familyMembersCount: "குடும்ப உறுப்பினர்கள் எண்ணிக்கை",

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
    mediaUploadSubtitle: "1 வீடியோ மற்றும் 2 படங்களைப் பதிவேற்றவும் (அதிகபட்சம் 10MB photo, 40MB video).",
    videoUploadLabel: "DIY வீடியோ (1 வீடியோ கோப்பு - அதிகபட்சம் 40MB) *",
    photo1UploadLabel: "DIY புகைப்பட 1 (அதிகபட்சம் 10MB) *",
    photo2UploadLabel: "DIY புகைப்பட 2 (அதிகபட்சம் 10MB) *",
    uploadDragDropText: "கோப்பை இங்கே இழுத்து விடவும், அல்லது",
    uploadBrowseText: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    maxSizeText: "ஏற்றுக்கொள்ளப்பட்ட வடிவங்கள்: MP4, MOV, JPG, PNG (10MB photo, 40MB video)",
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
    privacyPolicyTitle: "தரவு தனியுரிமை கொள்கை",
    privacySubtitle: "கடைசியாகப் புதுப்பிக்கப்பட்டது: 27 ஜூலை 2026",
    privacySec1Title: "1. சேகரிக்கப்படும் தரவு",
    privacySec1Body: "யமஹா டே 2026 பிரச்சாரத்திற்காக பணியாளர் பெயர், ஐடி, மின்னஞ்சல், தொலைபேசி மற்றும் புகைப்படங்கள் சேகரிக்கப்படுகின்றன.",
    privacySec2Title: "2. நோக்கம்",
    privacySec2Body: "சான்றிதழ் வழங்கவும் தேர்வுகளை நடத்தவும் தரவு பயன்படுத்தப்படும்.",
    privacySec3Title: "3. பாதுகாப்பு",
    privacySec3Body: "அனைத்து தரவுகளும் பாதுகாப்பாக MongoDB சேமிப்பகத்தில் சேமிக்கப்படும்.",
    privacySec4Title: "4. தரவு நீக்கம்",
    privacySec4Body: "180 நாட்களுக்குப் பிறகு தரவு நீக்கப்படும்.",
    privacySec5Title: "5. தொடர்பு",
    privacySec5Body: "privacy@yamaha-motor.co.in ஐத் தொடர்பு கொள்ளவும்.",

    termsConditionsTitle: "பிரச்சார விதிமுறைகள்",
    termsSubtitle: "யமஹா டே 2026 அதிகாரப்பூர்வ வழிகாட்டுதல்கள்",
    termsSec1Title: "1. தகுதி",
    termsSec1Body: "யமஹா மோட்டார் இந்தியா குழுமத்தின் அனைத்து ஊழியர்களும் அவர்களின் குடும்பத்தினரும் பங்கேற்கலாம்.",
    termsSec2Title: "2. கோப்பு விவரங்கள்",
    termsSec2Body: "படிவம் 1 (2 படங்கள்) மற்றும் படிவம் 2 (1 வீடியோ) சமர்ப்பிக்கப்பட வேண்டும்.",
    termsSec3Title: "3. பாதுகாப்பு",
    termsSec3Body: "அனைத்து சமர்ப்பிப்புகளும் அசல் படைப்புகளாக இருக்க வேண்டும்.",
    termsSec4Title: "4. அங்கீகாரம்",
    termsSec4Body: "சிறந்த படைப்புகளுக்கு யமஹா தினத்தில் அங்கீகாரம் வழங்கப்படும்.",

    // Section Headings & Upload Labels
    sec1EmployeeDetailsTitle: "1. ஊழியர் மற்றும் குடும்ப விவரங்கள்",
    sec2UploadPhotosTitle: "2. புகைப்படங்களைப் பதிவேற்றவும் (அதிகபட்சம் 2 புகைப்படங்கள், தலா 10MB)",
    sec2UploadPhotosDesc: "உங்கள் குடும்ப காண்டோ DIY சுவரின் 2 உயர்தர புகைப்படங்களைப் பதிவேற்றவும்.",
    photo1Label: "புகைப்படம் 1 (தேவை, அதிகபட்சம் 5MB) *",
    photo2Label: "புகைப்படம் 2 (தேவை, அதிகபட்சம் 5MB) *",
    sec2UploadVideoTitle: "காண்டோ வீடியோவைப் பதிவேற்றவும் (தேவை, அதிகபட்சம் 40MB) *",
    sec2UploadVideoDesc: "DIY கைவினைச் சுவரை உருவாக்கும் உங்கள் குடும்பத்தின் 1 வீடியோவைப் பதிவேற்றவும் (MP4, WEBM, MOV, 40MB).",

    // Validation Error Messages
    errEmpNameRequired: "ஊழியரின் முழு பெயர் தேவை.",
    errEmpIdRequired: "ஊழியர் ஐடி தேவை.",
    errEmailRequired: "அதிகாரப்பூர்வ யமஹா மின்னஞ்சல் முகவரி தேவை.",
    errEmailInvalid: "செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும் (எ.கா. name@yamaha-motor.co.in).",
    errPhoneRequired: "கைபேசி எண் தேவை.",
    errPhone10Digits: "தொலைபேசி எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும்.",
    errCityRequired: "நகரம் / ஆலை இருப்பிடம் தேவை.",
    errPhoto1Required: "புகைப்படம் 1 தேவை.",
    errPhoto2Required: "புகைப்படம் 2 தேவை.",
    errVideoRequired: "காண்டோ DIY வீடியோ சமர்ப்பிப்பு தேவை.",
    errConsentRequired: "சமர்ப்பிக்க தரவு செயலாக்க ஒப்புதலை ஏற்க வேண்டும்.",

    backBtn: "பின்செல்",
    companyNameLabel: "நிறுவனத்தின் பெயர்",
    noEmpIdNote: "பணியாளர் ஐடி இல்லையா? இதை காலியாக விட்டு கீழே உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்.",
    departmentLabel: "துறை",
    locationLabel: "இடம்",
    form1PhoneNumberLabel: "தொலைபேசி எண்",
    consentAgreePrefix: "நான்",
    consentTermsLink: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    consentAndWord: "மற்றும்",
    consentPrivacyLink: "தனியுரிமைக் கொள்கை",
    privacyNoteTitle: "உங்கள் தனியுரிமை முக்கியம்.",
    form1PrivacyNoteBody: "உங்கள் தகவல், படங்கள் மற்றும் வீடியோ யமஹா டே 2026 நடவடிக்கைகளுக்காக மட்டுமே பயன்படுத்தப்படும், நிறுவனத்திற்கு வெளியே பகிரப்படாது.",
    form1MediaConsentText: "எனது சமர்ப்பிப்பு படங்களை உள் வெளியீடுகளில் காட்ட யமஹாவுக்கு அனுமதி வழங்குகிறேன்.",
    form1ThankYouTitle: "நன்றி!",
    form1ThankYouBody: "உங்கள் காண்டோ தருணத்தைப் பார்க்க காத்திருக்கிறோம்.",
    form1FooterFamilyText: "ஒவ்வொரு யமஹா செயலுக்குப் பின்னாலும் உள்ள குடும்பங்களை நாங்கள் கொண்டாடுகிறோம்.",
    form2ChairmanTitle: "தலைவர் அழைக்கிறார்",
    form2ChairmanScript: "உங்கள் கருத்துக்கள்",
    form2ChairmanSub: "உங்கள் கருத்துக்கள் நாங்கள் இணைந்து சிறப்பாக வளர உதவுகின்றன.",
    form2EmpEinLabel: "பணியாளர் EIN",
    form2PhoneNumberLabel: "தொலைபேசி எண்",
    form2EmployeeNameLabel: "பணியாளர் பெயர்",
    form2ShareThoughtsTitle: "உங்கள் கருத்துக்களைப் பகிரவும்:",
    form2ShareThoughtsDesc: "இன்று முதல் 10 ஆண்டுகளுக்குப் பிறகு, வாடிக்கையாளர்கள் எப்போதும் எங்களையே தேர்வு செய்ய எங்கள் பிராண்ட் என்ன செய்ய வேண்டும்.",
    form2BrowseOptionalLabel: "உலாவவும் (விருப்பத்தேர்வு) — அதிகபட்ச அளவு: 50MB",
    form2BrowseFileCta: "கோப்பை உலாவ கிளிக் செய்யவும் (எந்த வடிவமும், அதிகபட்சம் 50MB)",
    form2ConsentSuffix: "எனது பதில் யமஹாவுக்குள் பகிரப்படலாம்.",
    form2SubmitBtn: "சமர்ப்பிக்கவும் — தலைவரின் அழைப்பு",
    form2PrivacyNoteBody: "உங்கள் பதில் யமஹா டே 2026 நடவடிக்கைகளுக்காக மட்டுமே பயன்படுத்தப்படும், நிறுவனத்திற்கு வெளியே பகிரப்படாது.",
    form2MessageCardLead: "எதிர்காலம் இன்றைய நமது யோசனைகளால் கட்டமைக்கப்படுகிறது.",
    form2MessageCardText: "உங்கள் கருத்துக்களைப் பகிர்ந்து, நாளையை நோக்கி வலிமையான, ஊக்கமளிக்கும் யமஹாவை உருவாக்க உதவுங்கள்."
  }
};
