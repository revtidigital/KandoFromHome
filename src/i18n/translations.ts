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
  mandatoryField: string;
  
  // Landing Page
  createYour: string;
  kandoMoment: string;
  welcomeToYour: string;
  kandoSpace: string;
  heroWelcomeSuffix: string;
  landingSubtitle: string;
  chooseLanguage: string;
  enterSite: string;
  footerQuote: string;

  // Thank You (Form 1)
  ty1Title: string;
  ty1Lead: string;
  ty1CopyLine1: string;
  ty1CopyLine2: string;
  ty1NoteText: string;
  ty1Keep: string;
  ty1Together: string;
  ty1Card1Title: string;
  ty1Card1Text: string;
  ty1Card2Title: string;
  ty1Card2Text: string;

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
  form1Step1: string;
  form1Step2: string;
  form1Step3: string;
  form1CardTitle: string;
  form1CardDesc: string;
  form1CardBtn: string;
  form2Badge: string;
  form2Step1: string;
  form2Step2: string;
  form2Step3: string;
  orDivider: string;
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
  form2SkipBtn: string;
  noFileSelected: string;
  companyNamePlaceholder: string;
  einPlaceholder: string;
  phoneNoEinPlaceholder: string;
  employeeNamePlaceholder: string;
  departmentPlaceholder: string;
  locationPlaceholder: string;
  thoughtsPlaceholder: string;

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
  photoFormatsHint: string;
  sec2UploadVideoTitle: string;
  sec2UploadVideoDesc: string;
  videoFormatsHint: string;

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
  form1SubmitBtn: string;
  form1MediaConsentText: string;
  form1ThankYouTitle: string;
  form1ThankYouBody: string;
  form1FooterFamilyText: string;
  form2ChairmanTitle: string;
  form2ChairmanScript: string;
  form2ChairmanSub: string;
  form2ChairmanQuoteLine1: string;
  form2ChairmanQuoteLine2: string;
  form2ChairmanQuoteText: string;
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
    mandatoryField: "* Mandatory field",

    // Landing
    createYour: "Create Your",
    kandoMoment: "Create. Share. Inspire.",
    welcomeToYour: "Welcome to Your",
    kandoSpace: "Kando Space",
    heroWelcomeSuffix: "",
    landingSubtitle: "This Yamaha Day, let's celebrate the families behind every Yamaha action.",
    chooseLanguage: "CHOOSE YOUR LANGUAGE",
    enterSite: "ENTER SITE >",
    footerQuote: "Behind every Yamaha action is a family that inspires it.",

    // Thank You (Form 1)
    ty1Title: "THANK YOU!",
    ty1Lead: "Your Kando entry has been received.",
    ty1CopyLine1: "Your moment of love, pride and togetherness",
    ty1CopyLine2: "means a lot to us.",
    ty1NoteText: "We will review your entry and may reach out if we need any additional information.",
    ty1Keep: "Keep creating beautiful Kando Moments!",
    ty1Together: "Together, we inspire.",
    ty1Card1Title: "What's next?",
    ty1Card1Text: "Stay tuned! We will share the highlights of your Kando Moments soon.",
    ty1Card2Title: "Spread the Kando!",
    ty1Card2Text: "Encourage your colleagues to create and share their Kando Moments too.",

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
    form1Badge: "SUBMIT YOUR KANDO ENTRY",
    form1CardTitle: "DIY Kit Creation & Photos",
    form1CardDesc: "Share your family's Kando Moment with us.",
    form1CardBtn: "SUBMIT ENTRY >",
    form1Step1: "Create your Kando display at home",
    form1Step2: "Click a family photo",
    form1Step3: "Upload and share your Kando Moment",
    form2Badge: "CHAIRMAN INVITES YOUR THOUGHTS",
    form2CardTitle: "Family Kando Video Submission",
    form2CardDesc: "Share your ideas and suggestions. Your thoughts help us to grow better, together.",
    form2CardBtn: "SHARE YOUR THOUGHTS >",
    form2Step1: "Share your thoughts",
    form2Step2: "Ideas for a better Yamaha",
    form2Step3: "Together, we build the future",
    orDivider: "OR",

    // Form 1 & Form 2 Fields
    form1Title: "SUBMIT YOUR KANDO ENTRY",
    form1Subtitle: "Share your family's kando moment with us.",
    fullName: "Employee Full Name",
    empId: "Employee EIN",
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
    form2SkipBtn: "Skip >",
    noFileSelected: "No file selected",
    companyNamePlaceholder: "Enter company name",
    einPlaceholder: "Enter EIN",
    phoneNoEinPlaceholder: "Only if you have no Employee ID",
    employeeNamePlaceholder: "Enter employee name",
    departmentPlaceholder: "Enter department",
    locationPlaceholder: "Enter location",
    thoughtsPlaceholder: "Write your thoughts here...",

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
    sec2UploadPhotosTitle: "Upload Photos (Max 2 Photos and 1 Video, Max 40MB)",
    sec2UploadPhotosDesc: "Upload up to 2 high-resolution photos and video of your family Kando DIY Wall (All formats supported).",
    photo1Label: "Photo 1 (Required, Max 5MB)*",
    photo2Label: "Photo 2 (Required, Max 5MB)*",
    photoFormatsHint: "All photo formats supported · Max 5MB",
    sec2UploadVideoTitle: "Video (Required, Max 40MB)*",
    videoFormatsHint: "All video formats supported · Max 40MB",
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
    noEmpIdNote: "Don't have an Employee ID? Leave this blank and enter your Phone Number.",
    departmentLabel: "Department",
    locationLabel: "Location",
    form1PhoneNumberLabel: "Phone Number",
    consentAgreePrefix: "I agree to the",
    consentTermsLink: "Terms & Conditions",
    consentAndWord: "and",
    consentPrivacyLink: "Privacy Policy",
    privacyNoteTitle: "Your privacy matters.",
    form1PrivacyNoteBody: "Your information, photos and video will be used only for Yamaha Day 2026 activities and will not be shared outside the organization.",
    form1SubmitBtn: "Submit DIY Kando Kit",
    form1MediaConsentText: "I grant Yamaha permission to feature my submission photos in internal publications.",
    form1ThankYouTitle: "Thank you!",
    form1ThankYouBody: "We can't wait to see your Kando Moment.",
    form1FooterFamilyText: "Together, we celebrate the families behind every Yamaha action.",
    form2ChairmanTitle: "CHAIRMAN INVITES",
    form2ChairmanScript: "your Thoughts",
    form2ChairmanSub: "Your ideas help us grow better, together.",
    form2ChairmanQuoteLine1: "The future is built",
    form2ChairmanQuoteLine2: "by our ideas today.",
    form2ChairmanQuoteText: "Share your thoughts and help shape a stronger, more inspiring Yamaha for tomorrow.",
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
  },

  hi: {
    siteTitle: "यामाहा दिवस 2026 · कांडो फ्रॉम होम",
    yamahaDay: "यामाहा दिवस 2026",
    kandoFromHome: "कांडो फ्रॉम होम",
    copyright: "© 2026 यामाहा मोटर इंडिया ग्रुप। सर्वाधिकार सुरक्षित।",
    home: "होम",
    terms: "नियम और शर्तें",
    privacy: "गोपनीयता नीति",
    adminPortal: "प्रशासन पोर्टल",
    changeLanguage: "भाषा बदलें",
    mandatoryField: "* अनिवार्य फ़ील्ड",

    // Landing
    createYour: "बनाएं अपना",
    kandoMoment: "बनाएं। साझा करें। प्रेरित करें।",
    welcomeToYour: "आपके",
    kandoSpace: "कांडो स्पेस",
    heroWelcomeSuffix: "में स्वागत है",
    landingSubtitle: "आनंद, गर्व और एकजुटता की भावना। इस यामाहा दिवस पर, अपने परिवार के साथ एक विशेष क्षण बनाएं और इसे यामाहा के साथ साझा करें।",
    chooseLanguage: "अपनी भाषा चुनें",
    enterSite: "साइट में प्रवेश करें >",
    footerQuote: "यामाहा के हर कार्य के पीछे एक परिवार है जो इसे प्रेरित करता है।",

    // Thank You (Form 1)
    ty1Title: "धन्यवाद!",
    ty1Lead: "आपकी कांडो प्रविष्टि प्राप्त हो गई है।",
    ty1CopyLine1: "प्यार, गर्व और एकजुटता का आपका यह पल",
    ty1CopyLine2: "हमारे लिए बहुत मायने रखता है।",
    ty1NoteText: "हम आपकी प्रविष्टि की समीक्षा करेंगे और यदि किसी अतिरिक्त जानकारी की आवश्यकता हुई तो संपर्क कर सकते हैं।",
    ty1Keep: "खूबसूरत कांडो मोमेंट्स बनाते रहें!",
    ty1Together: "साथ मिलकर, हम प्रेरित करते हैं।",
    ty1Card1Title: "आगे क्या?",
    ty1Card1Text: "बने रहें! हम जल्द ही आपके कांडो मोमेंट्स की झलकियां साझा करेंगे।",
    ty1Card2Title: "कांडो को फैलाएं!",
    ty1Card2Text: "अपने सहयोगियों को भी अपने कांडो मोमेंट्स बनाने और साझा करने के लिए प्रोत्साहित करें।",

    // Home
    homeHeroTitle: "घर पर मनाएं यामाहा दिवस 2026",
    homeHeroDesc: "कांडो (Kando) एक जापानी शब्द है जिसका अर्थ है गहरा संतोष और उत्साह। अपने प्रियजनों के साथ DIY किट बनाएं, अपनी रचना साझा करें, और भारत भर के हजारों यामाहा परिवारों से जुड़ें!",
    ceoMessageTitle: "यामाहा नेतृत्व से एक विशेष संदेश",
    ceoMessageBody: "प्रिय यामाहा परिवार, इस यामाहा दिवस पर हम आपके समर्पण और आपके परिवारों के अद्भुत समर्थन का सम्मान करते हैं। कांडो फ्रॉम होम DIY किट आपकी संयुक्त रचनात्मकता को हमारी श्रद्धांजलि है।",
    howItWorksTitle: "भाग कैसे लें",
    step1Title: "अपनी DIY किट असेंबल करें",
    step1Desc: "अपनी फैमिली डे DIY किट खोलें और अपने परिवार के साथ मिलकर क्राफ्ट बोर्ड असेंबल करें।",
    step2Title: "फॉर्म 1 भरें (विवरण और मीडिया)",
    step2Desc: "अपने कर्मचारी विवरण के साथ अपनी तैयार DIY किट के 1 वीडियो और 2 फोटो अपलोड करें।",
    step3Title: "सीईओ के प्रश्न का उत्तर दें",
    step3Desc: "फॉर्म 2 में अपनी एम्प्लॉई आईडी सत्यापित करें और पारिवारिक एकजुटता पर अपने विचार साझा करें।",
    step4Title: "अपना कांडो प्रमाणपत्र प्राप्त करें",
    step4Desc: "अपनी विशिष्ट संदर्भ आईडी और डाउनलोड करने योग्य यामाहा कांडो फैमिली सर्टिफिकेट 2026 प्राप्त करें।",
    startSubmissionBtn: "प्रविष्टि शुरू करें",
    submissionDeadlineText: "अभियान जमा करने की अवधि: 27 जुलाई 2026 - 15 अगस्त 2026",

    // Home Cards
    chooseSubmissionFormTitle: "अपना प्रविष्टि फॉर्म चुनें",
    chooseSubmissionFormDesc: "फॉर्म 1 और फॉर्म 2 स्वतंत्र हैं। आप यामाहा दिवस 2026 के लिए इनमें से कोई भी या दोनों फॉर्म जमा कर सकते हैं।",
    form1Badge: "अपनी कांडो प्रविष्टि जमा करें",
    form1CardTitle: "DIY किट निर्माण और तस्वीरें",
    form1CardDesc: "अपने परिवार का कांडो मोमेंट हमारे साथ साझा करें।",
    form1CardBtn: "प्रविष्टि जमा करें >",
    form1Step1: "अपने घर पर कांडो डिस्प्ले बनाएं",
    form1Step2: "एक पारिवारिक फोटो क्लिक करें",
    form1Step3: "अपलोड करें और अपना कांडो मोमेंट साझा करें",
    form2Badge: "चेयरमैन आपके विचार आमंत्रित करते हैं",
    form2CardTitle: "पारिवारिक कांडो वीडियो प्रविष्टि",
    form2CardDesc: "अपने विचार और सुझाव साझा करें। आपके विचार हमें और बेहतर बनने में मदद करते हैं।",
    form2CardBtn: "अपने विचार साझा करें >",
    form2Step1: "अपने विचार साझा करें",
    form2Step2: "एक बेहतर यामाहा के लिए विचार",
    form2Step3: "साथ मिलकर, हम भविष्य का निर्माण करते हैं",
    orDivider: "या",

    // Form 1
    form1Title: "अपनी कांडो प्रविष्टि जमा करें",
    form1Subtitle: "अपने परिवार का कांडो पल हमारे साथ साझा करें।",
    fullName: "कर्मचारी का पूरा नाम",
    empId: "कर्मचारी EIN",
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
    form2SkipBtn: "छोड़ें >",
    noFileSelected: "कोई फ़ाइल चयनित नहीं",
    companyNamePlaceholder: "कंपनी का नाम दर्ज करें",
    einPlaceholder: "EIN दर्ज करें",
    phoneNoEinPlaceholder: "केवल तभी भरें जब आपके पास कर्मचारी आईडी न हो",
    employeeNamePlaceholder: "कर्मचारी का नाम दर्ज करें",
    departmentPlaceholder: "विभाग दर्ज करें",
    locationPlaceholder: "स्थान दर्ज करें",
    thoughtsPlaceholder: "अपने विचार यहाँ लिखें...",

    // Media
    mediaUploadTitle: "DIY क्रिएशन मीडिया अपलोड",
    mediaUploadSubtitle: "1 वीडियो (अधिकतम 40MB) और 2 फोटो (अधिकतम 10MB प्रति फ़ोटो) अपलोड करें।",
    videoUploadLabel: "DIY वीडियो (1 वीडियो फ़ाइल - अधिकतम 40MB) *",
    photo1UploadLabel: "DIY निर्माण फोटो 1 (अधिकतम 10MB) *",
    photo2UploadLabel: "DIY निर्माण फोटो 2 (अधिकतम 10MB) *",
    uploadDragDropText: "फ़ाइल यहाँ खींचें और छोड़ें, या",
    uploadBrowseText: "फ़ाइल चुनें",
    maxSizeText: "स्वीकृत प्रारूप: MP4, MOV, JPG, PNG (अधिकतम 10MB फोटो, 40MB वीडियो)",
    fileSelectedText: "फ़ाइल सफलतापूर्वक संलग्न की गई",

    // Consents
    dataConsentText: "मैं यामाहा दिवस 2026 के लिए अपने व्यक्तिगत डेटा को संग्रहीत और संसाधित करने की सहमति देता हूं।",
    mediaConsentText: "मैं यामाहा मोटर इंडिया ग्रुप को आंतरिक और प्रचार प्रदर्शनों में अपने परिवार की तस्वीरों और वीडियो को प्रदर्शित करने की अनुमति देता हूं।",
    submitForm1Btn: "फॉर्म 1 जमा करें और सीईओ प्रश्न पर जाएं",

    // Thank You 1
    thankYou1Title: "फॉर्म 1 सफलतापूर्वक जमा हो गया!",
    thankYou1Subtitle: "आपके कर्मचारी विवरण और मीडिया फाइलें सर्वर पर सुरक्षित रूप से अपलोड कर दी गई हैं।",
    refIdLabel: "फॉर्म 1 प्रविष्टि संदर्भ आईडी",
    proceedToForm2Btn: "फॉर्म 2 (सीईओ चिंतनशील प्रश्न) पर आगे बढ़ें",

    // Form 2
    form2Title: "फॉर्म 2: सीईओ चिंतनशील प्रश्न",
    form2Subtitle: "कांडो फ्रॉम होम DIY किट को पूरा करते हुए अपने परिवार की यात्रा पर विचार करें।",
    authGateTitle: "कर्मचारी प्रमाणीकरण गेट",
    authGateDesc: "अपने फॉर्म 1 प्रविष्टि को अनलॉक और सत्यापित करने के लिए कृपया अपनी कर्मचारी आईडी दर्ज करें।",
    verifyEmpBtn: "कर्मचारी आईडी सत्यापित करें",
    verifiedBadgeText: "सत्यापित कर्मचारी रिकॉर्ड",
    ceoQuestionTitle: "यामाहा सीईओ और एमडी की ओर से प्रश्न",
    ceoQuestionText: "\"इस DIY किट को एक साथ पूरा करते समय आपके परिवार ने कौन सा सबसे विशेष क्षण अनुभव किया, और यह आपके दैनिक जीवन में यामाहा की कांडो भावना को कैसे दर्शाता है?\"",
    reflectionPlaceholder: "अपने परिवार की कहानी, भावनाओं और एक साथ काम करने के अनुभव को साझा करें...",
    submitForm2Btn: "अंतिम प्रविष्टि पूरी करें और प्रमाणपत्र प्राप्त करें",

    // Thank You 2
    thankYou2Title: "बधाई हो! आपकी प्रविष्टि पूरी हो गई है",
    thankYou2Subtitle: "यामाहा दिवस 2026 कांडो फ्रॉम होम में भाग लेने के लिए धन्यवाद। आपकी प्रविष्टि को प्रशासनिक समीक्षा के लिए शॉर्टलिस्ट कर लिया गया है।",
    finalRefIdLabel: "अंतिम अभियान संदर्भ आईडी",
    certBadgeTitle: "यामाहा कांडो फैमिली सर्टिफाइड 2026",
    downloadCertBtn: "डिजिटल कांडो प्रमाणपत्र डाउनलोड करें (PDF)",
    backHomeBtn: "मुख्य पृष्ठ पर वापस जाएं",

    // Legal
    privacyPolicyTitle: "डेटा गोपनीयता और PII सुरक्षा नीति",
    privacySubtitle: "अंतिम अद्यतन: 27 जुलाई 2026 | डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) मानकों के अनुरूप",
    privacySec1Title: "1. डेटा संग्रह का दायरा",
    privacySec1Body: "यामाहा दिवस 2026 \"कांडो फ्रॉम होम\" अभियान के लिए, यामाहा मोटर इंडिया ग्रुप केवल पहचान सत्यापन और अभियान प्रशासन के लिए आवश्यक कर्मचारी व्यक्तिगत जानकारी एकत्र करता है। इसमें कर्मचारी का पूरा नाम, कर्मचारी आईडी, आधिकारिक ईमेल पता, संपर्क नंबर, प्लांट/शहर का स्थान, परिवार की भागीदारी संख्या और अपलोड की गई मीडिया फ़ाइलें शामिल हैं।",
    privacySec2Title: "2. उद्देश्य और मीडिया सहमति",
    privacySec2Body: "एकत्रित व्यक्तिगत डेटा का उपयोग केवल भागीदारी को सत्यापित करने, विजेता पारिवारिक DIY प्रविष्टियों को शॉर्टलिस्ट करने, डिजिटल प्रमाणपत्र जारी करने और यामाहा दिवस 2026 कार्यक्रमों का आयोजन करने के लिए किया जाता है। अपलोड की गई तस्वीरें और वीडियो केवल आंतरिक संचार और प्रचार प्रदर्शनों में दिखाए जाएंगे जहां सहमति प्रदान की गई है।",
    privacySec3Title: "3. डेटा संग्रहण, एन्क्रिप्शन और सुरक्षा",
    privacySec3Body: "सभी जमा किया गया डेटा एन्क्रिप्टेड MongoDB डेटाबेस और सर्वर ऑब्जेक्ट स्टोरेज में सुरक्षित रूप से संग्रहीत किया जाता है। पहुँच केवल अधिकृत प्रशासनिक कर्मियों तक ही सीमित है।",
    privacySec4Title: "4. डेटा अवधारण और विलोपन",
    privacySec4Body: "अभियान प्रविष्टियों को यामाहा दिवस 2026 के समापन के बाद 180 दिनों के लिए संग्रहीत किया जाएगा, जिसके बाद कर्मचारी के लिखित अनुरोध पर मीडिया को सुरक्षित रूप से हटा दिया जाएगा।",
    privacySec5Title: "5. डेटा संरक्षण अधिकारी से संपर्क करें",
    privacySec5Body: "गोपनीयता पूछताछ या डेटा अधिकारों के अनुरोधों के लिए, कृपया आंतरिक डेटा संरक्षण समिति से privacy@yamaha-motor.co.in पर संपर्क करें।",

    termsConditionsTitle: "अभियान नियम और मीडिया अधिकार शर्तें",
    termsSubtitle: "यामाहा दिवस 2026 \"कांडो फ्रॉम होम\" आधिकारिक अभियान दिशानिर्देश",
    termsSec1Title: "1. पात्रता",
    termsSec1Body: "कांडो फ्रॉम होम DIY किट पहल यामाहा मोटर इंडिया ग्रुप के सभी सक्रिय कर्मचारियों और उनके निकटतम परिवार के सदस्यों के लिए खुली है।",
    termsSec2Title: "2. प्रविष्टि दिशानिर्देश और फ़ाइल विनिर्देश",
    termsSec2Body: "प्रत्येक कर्मचारी को अपनी वैध कर्मचारी आईडी के विरुद्ध केवल एक प्रविष्टि की अनुमति है। प्रविष्टि में फॉर्म 1 (अधिकतम 2 तस्वीरें, 10MB प्रत्येक) और फॉर्म 2 (1 वीडियो, अधिकतम 40MB और सीईओ विचार) शामिल हैं।",
    termsSec3Title: "3. मौलिकता और सुरक्षा",
    termsSec3Body: "सभी प्रविष्टियों में कर्मचारी और उनके परिवार द्वारा पूरी की गई मूल DIY क्राफ्ट असेंबली होनी चाहिए।",
    termsSec4Title: "4. शॉर्टलिस्टिंग और मान्यता",
    termsSec4Body: "प्रविष्टियों का मूल्यांकन यामाहा दिवस 2026 प्रशासन समिति द्वारा रचनात्मकता और पारिवारिक भागीदारी के आधार पर किया जाएगा।",

    // Section Headings & Upload Labels
    sec1EmployeeDetailsTitle: "1. कर्मचारी और परिवार विवरण",
    sec2UploadPhotosTitle: "तस्वीरें अपलोड करें (अधिकतम 2 तस्वीरें और 1 वीडियो, अधिकतम 40MB)",
    sec2UploadPhotosDesc: "अपने परिवार की कांडो DIY वॉल की 2 उच्च-गुणवत्ता वाली तस्वीरें अपलोड करें (सभी फोटो प्रारूप समर्थित)।",
    photo1Label: "फोटो 1 (अनिवार्य, अधिकतम 5MB)*",
    photo2Label: "फोटो 2 (अनिवार्य, अधिकतम 5MB)*",
    photoFormatsHint: "सभी फोटो फॉर्मेट स्वीकार्य हैं · अधिकतम 5MB",
    sec2UploadVideoTitle: "वीडियो अपलोड करें (अनिवार्य, अधिकतम 40MB)*",
    videoFormatsHint: "सभी वीडियो फॉर्मेट स्वीकार्य हैं · अधिकतम 40MB",
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
    errVideoRequired: "कांडो DIY वीडियो जमा करना अनिवार्य है।",
    errConsentRequired: "जमा करने के लिए आपको डेटा प्रोसेसिंग सहमति स्वीकार करनी होगी।",

    backBtn: "वापस",
    companyNameLabel: "कंपनी का नाम",
    noEmpIdNote: "क्या आपके पास कर्मचारी आईडी नहीं है? इसे खाली छोड़ें और अपना फ़ोन नंबर दर्ज करें।",
    departmentLabel: "विभाग",
    locationLabel: "स्थान",
    form1PhoneNumberLabel: "फ़ोन नंबर",
    consentAgreePrefix: "मैं",
    consentTermsLink: "नियम एवं शर्तों",
    consentAndWord: "और",
    consentPrivacyLink: "गोपनीयता नीति",
    privacyNoteTitle: "आपकी गोपनीयता मायने रखती है।",
    form1PrivacyNoteBody: "आपकी जानकारी, तस्वीरें और वीडियो केवल यामाहा दिवस 2026 गतिविधियों के लिए उपयोग की जाएंगी और संगठन के बाहर साझा नहीं की जाएंगी।",
    form1SubmitBtn: "DIY कांडो किट जमा करें",
    form1MediaConsentText: "मैं यामाहा को आंतरिक प्रकाशनों में अपनी प्रविष्टि की तस्वीरें प्रदर्शित करने की अनुमति देता हूं।",
    form1ThankYouTitle: "धन्यवाद!",
    form1ThankYouBody: "हमें आपके कांडो पल को देखने का इंतज़ार है।",
    form1FooterFamilyText: "हम हर यामाहा कार्रवाई के पीछे के परिवारों का जश्न मनाते हैं।",
    form2ChairmanTitle: "चेयरमैन आमंत्रित करते हैं",
    form2ChairmanScript: "आपके विचार",
    form2ChairmanSub: "आपके विचार हमें बेहतर बनने में मदद करते हैं, साथ मिलकर।",
    form2ChairmanQuoteLine1: "भविष्य का निर्माण",
    form2ChairmanQuoteLine2: "आज हमारे विचारों से होता है।",
    form2ChairmanQuoteText: "अपने विचार साझा करें और आने वाले कल के लिए एक सशक्त, अधिक प्रेरणादायक यामाहा को आकार देने में मदद करें।",
    form2EmpEinLabel: "कर्मचारी EIN",
    form2PhoneNumberLabel: "फ़ोन नंबर",
    form2EmployeeNameLabel: "कर्मचारी का नाम",
    form2ShareThoughtsTitle: "अपने विचार साझा करें:",
    form2ShareThoughtsDesc: "आज से 10 साल बाद, हमारे ब्रांड को क्या करना चाहिए ताकि ग्राहक हमेशा हमें ही चुनें।",
    form2BrowseOptionalLabel: "ब्राउज़ करें (वैकल्पिक) — अधिकतम आकार: 50MB",
    form2BrowseFileCta: "फ़ाइल ब्राउज़ करने के लिए क्लिक करें (कोई भी प्रारूप, अधिकतम 50MB)",
    form2ConsentSuffix: "मेरी प्रतिक्रिया यामाहा के भीतर आंतरिक रूप से साझा की जा सकती है।",
    form2SubmitBtn: "जमा करें — चेयरमैन का निमंत्रण",
    form2PrivacyNoteBody: "आपकी प्रतिक्रिया केवल यामाहा दिवस 2026 गतिविधियों के लिए उपयोग की जाएगी और संगठन के बाहर साझा नहीं की जाएगी।",
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
    mandatoryField: "* கட்டாயப் புலம்",

    // Landing
    createYour: "உருவாக்குங்கள் உங்கள்",
    kandoMoment: "உருவாக்குங்கள். பகிருங்கள். ஊக்குவியுங்கள்.",
    welcomeToYour: "உங்கள்",
    kandoSpace: "காண்டோ ஸ்பேஸ்",
    heroWelcomeSuffix: "க்கு வரவேற்கிறோம்",
    landingSubtitle: "மகிழ்ச்சி, பெருமை மற்றும் ஒற்றுமையின் உணர்வு. இந்த யமஹா தினத்தில், உங்கள் குடும்பத்துடன் ஒரு சிறப்பு தருணத்தை உருவாக்கி யமஹாவுடன் பகிர்ந்து கொள்ளுங்கள்.",
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    enterSite: "தளத்திற்குள் செல்லவும் >",
    footerQuote: "ஒவ்வொரு யமஹா செயலின் பின்னாலும் அதை ஊக்குவிக்கும் ஒரு குடும்பம் உள்ளது.",

    // Thank You (Form 1)
    ty1Title: "நன்றி!",
    ty1Lead: "உங்கள் காண்டோ எண்ட்ரி பெறப்பட்டது.",
    ty1CopyLine1: "அன்பு, பெருமை மற்றும் ஒற்றுமையின் இந்த தருணம்",
    ty1CopyLine2: "எங்களுக்கு மிகவும் முக்கியமானது.",
    ty1NoteText: "உங்கள் எண்ட்ரியை நாங்கள் மதிப்பாய்வு செய்வோம், கூடுதல் தகவல் தேவைப்பட்டால் தொடர்பு கொள்ளலாம்.",
    ty1Keep: "அழகான காண்டோ தருணங்களை உருவாக்கிக் கொண்டே இருங்கள்!",
    ty1Together: "ஒன்றாக, நாம் ஊக்குவிக்கிறோம்.",
    ty1Card1Title: "அடுத்து என்ன?",
    ty1Card1Text: "எதிர்பாருங்கள்! உங்கள் காண்டோ தருணங்களின் சிறப்பம்சங்களை விரைவில் பகிர்வோம்.",
    ty1Card2Title: "காண்டோவைப் பரப்புங்கள்!",
    ty1Card2Text: "உங்கள் சக ஊழியர்களையும் அவர்களின் காண்டோ தருணங்களை உருவாக்கி பகிர ஊக்குவியுங்கள்.",

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
    form1Badge: "உங்கள் காண்டோ பதிவை சமர்ப்பிக்கவும்",
    form1CardTitle: "DIY கிட் உருவாக்கம் & புகைப்படங்கள்",
    form1CardDesc: "உங்கள் குடும்பத்தின் காண்டோ தருணத்தை எங்களுடன் பகிரவும்.",
    form1CardBtn: "பதிவை சமர்ப்பிக்கவும் >",
    form1Step1: "வீட்டில் உங்கள் காண்டோ காட்சியை உருவாக்குங்கள்",
    form1Step2: "ஒரு குடும்ப புகைப்படத்தை எடுக்கவும்",
    form1Step3: "பதிவேற்றி உங்கள் காண்டோ தருணத்தைப் பகிரவும்",
    form2Badge: "தலைவர் உங்கள் எண்ணங்களை அழைக்கிறார்",
    form2CardTitle: "குடும்ப காண்டோ வீடியோ சமர்ப்பிப்பு",
    form2CardDesc: "உங்கள் யோசனைகள் மற்றும் பரிந்துரைகளைப் பகிரவும். உங்கள் எண்ணங்கள் நாங்கள் இணைந்து சிறப்பாக வளர உதவுகின்றன.",
    form2CardBtn: "உங்கள் எண்ணங்களைப் பகிரவும் >",
    form2Step1: "உங்கள் எண்ணங்களைப் பகிரவும்",
    form2Step2: "சிறந்த யமஹாவுக்கான யோசனைகள்",
    form2Step3: "ஒன்றாக, நாம் எதிர்காலத்தை உருவாக்குகிறோம்",
    orDivider: "அல்லது",

    // Form 1
    form1Title: "உங்கள் காண்டோ பதிவை சமர்ப்பிக்கவும்",
    form1Subtitle: "உங்கள் குடும்பத்தின் காண்டோ தருணத்தை எங்களுடன் பகிரவும்.",
    fullName: "பணியாளர் முழுப் பெயர்",
    empId: "பணியாளர் EIN",
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
    form2SkipBtn: "தவிர்க்கவும் >",
    noFileSelected: "கோப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை",
    companyNamePlaceholder: "நிறுவனத்தின் பெயரை உள்ளிடவும்",
    einPlaceholder: "EIN ஐ உள்ளிடவும்",
    phoneNoEinPlaceholder: "பணியாளர் ஐடி இல்லையெனில் மட்டும் இதை நிரப்பவும்",
    employeeNamePlaceholder: "பணியாளர் பெயரை உள்ளிடவும்",
    departmentPlaceholder: "துறையை உள்ளிடவும்",
    locationPlaceholder: "இருப்பிடத்தை உள்ளிடவும்",
    thoughtsPlaceholder: "உங்கள் கருத்துக்களை இங்கே எழுதவும்...",

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
    sec2UploadPhotosTitle: "புகைப்படங்களைப் பதிவேற்றவும் (அதிகபட்சம் 2 புகைப்படங்கள் மற்றும் 1 வீடியோ, அதிகபட்சம் 40MB)",
    sec2UploadPhotosDesc: "உங்கள் குடும்ப காண்டோ DIY சுவரின் 2 உயர்தர புகைப்படங்களைப் பதிவேற்றவும்.",
    photo1Label: "புகைப்படம் 1 (தேவை, அதிகபட்சம் 5MB)*",
    photo2Label: "புகைப்படம் 2 (தேவை, அதிகபட்சம் 5MB)*",
    photoFormatsHint: "அனைத்து புகைப்பட வடிவங்களும் ஏற்கப்படும் · அதிகபட்சம் 5MB",
    sec2UploadVideoTitle: "வீடியோவைப் பதிவேற்றவும் (தேவை, அதிகபட்சம் 40MB)*",
    videoFormatsHint: "அனைத்து வீடியோ வடிவங்களும் ஏற்கப்படும் · அதிகபட்சம் 40MB",
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
    noEmpIdNote: "பணியாளர் ஐடி இல்லையா? இதை காலியாக விட்டு உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்.",
    departmentLabel: "துறை",
    locationLabel: "இடம்",
    form1PhoneNumberLabel: "தொலைபேசி எண்",
    consentAgreePrefix: "நான்",
    consentTermsLink: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    consentAndWord: "மற்றும்",
    consentPrivacyLink: "தனியுரிமைக் கொள்கை",
    privacyNoteTitle: "உங்கள் தனியுரிமை முக்கியம்.",
    form1PrivacyNoteBody: "உங்கள் தகவல், படங்கள் மற்றும் வீடியோ யமஹா டே 2026 நடவடிக்கைகளுக்காக மட்டுமே பயன்படுத்தப்படும், நிறுவனத்திற்கு வெளியே பகிரப்படாது.",
    form1SubmitBtn: "DIY காண்டோ கிட் சமர்ப்பிக்கவும்",
    form1MediaConsentText: "எனது சமர்ப்பிப்பு படங்களை உள் வெளியீடுகளில் காட்ட யமஹாவுக்கு அனுமதி வழங்குகிறேன்.",
    form1ThankYouTitle: "நன்றி!",
    form1ThankYouBody: "உங்கள் காண்டோ தருணத்தைப் பார்க்க காத்திருக்கிறோம்.",
    form1FooterFamilyText: "ஒவ்வொரு யமஹா செயலுக்குப் பின்னாலும் உள்ள குடும்பங்களை நாங்கள் கொண்டாடுகிறோம்.",
    form2ChairmanTitle: "தலைவர் அழைக்கிறார்",
    form2ChairmanScript: "உங்கள் கருத்துக்கள்",
    form2ChairmanSub: "உங்கள் கருத்துக்கள் நாங்கள் இணைந்து சிறப்பாக வளர உதவுகின்றன.",
    form2ChairmanQuoteLine1: "எதிர்காலம் உருவாகிறது",
    form2ChairmanQuoteLine2: "இன்று நமது எண்ணங்களால்.",
    form2ChairmanQuoteText: "உங்கள் கருத்துக்களைப் பகிர்ந்து, நாளைய நாள் இன்னும் வலிமையான, உத்வேகம் தரும் யமஹாவை உருவாக்க உதவுங்கள்.",
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
  }
};
