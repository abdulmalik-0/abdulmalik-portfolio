// All site copy, in English and Arabic. Facts come from the CV (cv/abdulmalik-altamimi-cv.html).
// Track order is fixed everywhere: 0 infrastructure, 1 network, 2 identity, 3 operations, 4 automation.

export const LINKS = {
  email: 'airzt01@gmail.com',
  phone: '+966 59 400 6221',
  phoneHref: 'tel:+966594006221',
  github: 'https://github.com/abdulmalik-0',
  linkedin: 'https://www.linkedin.com/in/abdulmalik-altamimi-b5597a224/',
  cv: '/assets/abdulmalik-altamimi.pdf',
  formAction: 'https://formspree.io/f/xreajwdb'
};

// Names of tools, the same in both languages; they scroll past in the band under the hero.
export const TECH = [
  'Frigate NVR', 'Docker Compose', 'WireGuard', 'Active Directory', 'Group Policy', 'LAPS', 'Snipe-IT',
  'Microsoft Dynamics 365', 'n8n', 'Python', 'FastAPI', 'Flutter', 'TensorFlow Lite', 'Ubuntu Server', 'Hikvision ISAPI'
];

const PROJECT_MEDIA = [
  { id: 'arsl', banner: '/assets/project_asl.png', logo: null, url: 'https://arsl.altamimi.tech/', host: 'arsl.altamimi.tech', track: 4, stack: ['TensorFlow Lite', 'MediaPipe', 'OpenCV', 'FastAPI', 'Docker'] },
  { id: 'nibras', banner: '/assets/project_nibras.png', logo: '/assets/nibras_logo.png', url: 'https://www.nibras.fun/', host: 'nibras.fun', track: 4, stack: ['Flutter', 'Supabase', 'SQL RPCs'] },
  { id: 'reservation', banner: '/assets/project_reservations.png', logo: '/assets/reservations_logo.png', url: 'https://myreservations.altamimi.tech/', host: 'myreservations.altamimi.tech', track: 4, stack: null },
  { id: 'lab', banner: '/assets/project_server.png', logo: null, url: null, host: null, track: 0, stack: ['Proxmox', 'Ubuntu Server', 'Docker', 'RAID', 'NUT'] }
];

const JOB_CHIPS = [
  ['Frigate NVR', 'Docker Compose', 'WireGuard', 'Snipe-IT', 'n8n', 'Dynamics 365'],
  ['Active Directory', 'Group Policy', 'LAPS', 'Windows 11']
];

const SKILL_ITEMS = {
  en: [
    ['Ubuntu Server', 'Docker', 'Docker Compose', 'Frigate NVR', 'Hikvision ISAPI', 'IP surveillance'],
    ['WireGuard site-to-site VPN', 'TCP/IP fundamentals', 'Network troubleshooting'],
    ['Active Directory', 'Users, OUs, groups', 'Account provisioning', 'Group Policy', 'LAPS', 'Windows 10/11 deployment'],
    ['Snipe-IT', 'Assets, licenses, custody', 'Microsoft Dynamics 365', 'Ticket handling', 'End-user support', 'Hardware troubleshooting'],
    ['n8n', 'Python', 'SQL', 'Git', 'YAML', 'FastAPI', 'Flutter', 'Dart', 'Supabase', 'JavaScript', 'TensorFlow Lite', 'TensorFlow.js', 'Keras', 'OpenCV', 'MediaPipe'],
    ['Arabic (native)', 'English (professional)']
  ],
  ar: [
    ['Ubuntu Server', 'Docker', 'Docker Compose', 'Frigate NVR', 'Hikvision ISAPI', 'المراقبة عبر IP'],
    ['WireGuard (Site-to-Site VPN)', 'أساسيات TCP/IP', 'استكشاف أعطال الشبكات'],
    ['Active Directory', 'المستخدمون وOUs والمجموعات', 'إنشاء الحسابات وتعطيلها', 'Group Policy', 'LAPS', 'نشر Windows 10/11'],
    ['Snipe-IT', 'الأصول والتراخيص والعهد', 'Microsoft Dynamics 365', 'معالجة التذاكر', 'دعم المستخدمين', 'استكشاف أعطال الأجهزة'],
    ['n8n', 'Python', 'SQL', 'Git', 'YAML', 'FastAPI', 'Flutter', 'Dart', 'Supabase', 'JavaScript', 'TensorFlow Lite', 'TensorFlow.js', 'Keras', 'OpenCV', 'MediaPipe'],
    ['العربية (اللغة الأم)', 'الإنجليزية (مستوى مهني)']
  ]
};

const en = {
  name: 'Abdulmalik Altamimi',
  otherLanguage: 'العربية',
  nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', education: 'Education', contact: 'Contact', menu: 'Menu', sections: 'Sections' },
  hero: {
    badge: 'IT Specialist in Riyadh',
    lead: 'I run multi-site infrastructure, manage accounts and assets, and automate the work in between.',
    viewCv: 'View CV',
    downloadCv: 'Download CV',
    roomLabel: 'What I work with, one track per spot in the room',
    hint: 'Click a corner of the room to look closer',
    hintTouch: 'Tap a corner of the room, or a track below, to look closer',
    detailLabel: 'Track details',
    back: 'Back to the room',
    prev: 'Previous',
    next: 'Next'
  },
  // One track per corner of the hero's room. `points` and `tools` fill the panel that opens
  // when the corner is clicked.
  tracks: [
    {
      name: 'Infrastructure',
      tool: 'Frigate NVR',
      title: '39 cameras on Frigate NVR',
      note: 'Continuous recording across 3 sites, on Docker Compose.',
      where: 'Gulf Link',
      points: [
        'Deployed Frigate NVR on Docker Compose to watch 39 Hikvision IP cameras across 3 sites in Riyadh and Dammam.',
        'Set up continuous recording with defined retention policies.',
        'Fixed the YAML and dashboard settings that held the live view at 10 cameras, bringing all 39 feeds online.'
      ],
      tools: ['Frigate NVR', 'Docker Compose', 'Hikvision', 'YAML']
    },
    {
      name: 'Network',
      tool: 'WireGuard',
      title: '3 sites over WireGuard',
      note: 'Site-to-site VPN between Riyadh and Dammam.',
      where: 'Gulf Link',
      points: [
        'Linked the 3 sites in Riyadh and Dammam over a WireGuard site-to-site VPN.',
        'Streamed and recorded every camera centrally and securely between the cities.',
        'Registered the company on the Hikvision Technology Partner Portal for official ISAPI and SDK documentation.'
      ],
      tools: ['WireGuard', 'Site-to-site VPN', 'TCP/IP', 'Hikvision ISAPI']
    },
    {
      name: 'Identity',
      tool: 'Active Directory',
      title: 'Active Directory, GPO, LAPS',
      note: 'Account lifecycle and endpoint security at the Ministry of Commerce.',
      where: 'Ministry of Commerce',
      points: [
        'Managed the account lifecycle in Active Directory: new accounts, OUs, access changes, and leavers.',
        'Applied Group Policy to enforce security and configuration settings on domain-joined devices.',
        'Administered LAPS to secure and rotate local administrator passwords.',
        'Carried out the Windows 11 migration of employee workstations.'
      ],
      tools: ['Active Directory', 'Group Policy', 'LAPS', 'Windows 11']
    },
    {
      name: 'Operations',
      tool: 'Snipe-IT',
      title: 'Snipe-IT and Dynamics 365',
      note: 'Assets, licenses, custody, and purchase requests.',
      where: 'Gulf Link · Ministry of Commerce',
      points: [
        'Deployed Snipe-IT to track IT assets, software licenses, device lifecycle, and employee custody.',
        'Submitted and tracked purchase requests and approvals in Microsoft Dynamics 365.',
        'Supported end users on OS, software, and hardware issues, documenting every ticket.'
      ],
      tools: ['Snipe-IT', 'Dynamics 365', 'Ticketing', 'End-user support']
    },
    {
      name: 'Automation',
      tool: 'n8n',
      title: 'n8n, Python, Docker',
      note: 'Workflows for RFQs and supplier evaluation.',
      where: 'Gulf Link · Projects',
      points: [
        'Built pilot n8n workflows linked to databases to speed up RFQ processing and supplier evaluation.',
        'Containerized services with Docker Compose, from the camera recorder to a home lab on Proxmox.',
        'Built a CNN in Python that reads 31 Arabic sign-language letters and runs in the browser with TensorFlow.js.'
      ],
      tools: ['n8n', 'Python', 'Docker', 'SQL']
    }
  ],
  techLabel: 'Tools I work with',
  about: {
    title: 'About',
    text: 'I work across infrastructure, identity, and IT operations, in private and government environments. At Gulf Link I ran multi-site surveillance infrastructure over WireGuard, managed IT assets and licenses in Snipe-IT, and automated workflows with n8n. Before that, at the Ministry of Commerce, I administered Active Directory accounts, Group Policy, and LAPS, and supported end users.',
    stats: [
      { value: 39, label: 'IP cameras on one recorder' },
      { value: 3, label: 'sites linked by VPN' },
      { value: 31, label: 'sign-language letters my model reads' }
    ]
  },
  experience: {
    title: 'Experience',
    legend: 'What the colors mean',
    jobs: [
      {
        role: 'IT Specialist',
        org: 'Gulf Link, Riyadh',
        period: 'Aug 2026 – Nov 2026',
        bullets: [
          [0, 'Deployed Frigate NVR on Docker Compose to centralize monitoring of 39 Hikvision IP cameras across 3 sites in Riyadh and Dammam, with continuous recording and defined retention policies.'],
          [1, 'Linked the sites over WireGuard site-to-site VPN for secure centralized streaming and recording across cities.'],
          [0, 'Resolved YAML and dashboard configuration issues that limited the live view to 10 cameras, bringing all 39 feeds online.'],
          [3, 'Deployed Snipe-IT to track IT assets, software licenses, device lifecycle, and employee equipment custody.'],
          [4, 'Built pilot n8n automation workflows integrated with databases to streamline RFQ processing and supplier evaluation.'],
          [3, 'Submitted and tracked departmental purchase requests and approvals through Microsoft Dynamics 365.'],
          [0, 'Registered the company on the Hikvision Technology Partner Portal to obtain official ISAPI/SDK documentation for future integrations.']
        ]
      },
      {
        role: 'IT Support and Systems Administration Intern',
        org: 'Ministry of Commerce, Riyadh',
        period: 'Jun 2025 – Jan 2026',
        bullets: [
          [2, 'Managed the user account lifecycle in Active Directory: creating accounts, organizing OUs, updating access, and disabling accounts for leavers.'],
          [2, 'Applied Group Policy Objects to enforce security and configuration settings across domain-joined devices.'],
          [2, 'Administered LAPS to secure and rotate local administrator passwords across endpoints.'],
          [2, 'Executed the enterprise Windows 11 migration for employee workstations, ensuring smooth transitions and data integrity.'],
          [3, 'Supported end users on OS, software, and hardware issues, documenting and resolving tickets in a government environment.']
        ]
      }
    ]
  },
  projects: {
    title: 'Projects',
    newTab: 'opens in a new tab',
    items: [
      { name: 'Arabic Sign Language Translator', alt: 'Abstract artwork of signing hands made of light', text: 'Turns Arabic Sign Language letters into text in real time. A custom CNN recognizes 31 letters from MediaPipe hand landmarks, and a TensorFlow.js version runs privately in the browser.' },
      { name: 'Nibras', alt: 'Abstract artwork for the Nibras learning platform', text: 'A real-time multiplayer learning platform with a territory-claim game mode and live scoring. Game state and in-app currency run on secure SQL RPCs.' },
      { name: 'MyReservation', alt: 'Abstract artwork of a booking calendar', text: 'A web reservation system that handles concurrent bookings with real-time availability, user authentication, and role-based access control.', stack: ['Full-stack web', 'Authentication', 'Role-based access'] },
      { name: 'Home server and lab', alt: 'Abstract artwork of servers joined by glowing lines', text: 'A self-hosted lab on Ubuntu Server and Proxmox with Docker services, RAID storage, and UPS monitoring through NUT.' }
    ]
  },
  skills: {
    title: 'Skills',
    groups: ['Infrastructure', 'Network', 'Identity', 'Operations', 'Automation and development', 'Languages']
  },
  education: {
    title: 'Education',
    items: [
      { name: 'B.Sc. Computer Science', org: 'King Saud University', period: '2020 – 2026', note: 'Coursework in computer networks, operating systems, database management, and artificial intelligence.' },
      { name: 'Professional accreditation', org: 'Saudi Council of Engineers', period: '2026', note: '' }
    ]
  },
  contact: {
    title: 'Contact',
    text: 'For work in IT infrastructure, systems administration, network operations, or automation, send me a message.',
    location: 'Riyadh, Saudi Arabia',
    nameLabel: 'Your name',
    emailLabel: 'Your email',
    messageLabel: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    success: 'Message sent. I will reply soon.',
    error: 'The message was not sent. Check your connection and try again, or email me directly.'
  },
  cv: { title: 'CV', download: 'Download CV', close: 'Close', openTab: 'Open in a new tab' },
  footer: { rights: 'All rights reserved.' }
};

const ar = {
  name: 'عبدالملك التميمي',
  otherLanguage: 'English',
  nav: { about: 'نبذة', experience: 'الخبرة', projects: 'المشاريع', skills: 'المهارات', education: 'التعليم', contact: 'التواصل', menu: 'القائمة', sections: 'الأقسام' },
  hero: {
    badge: 'أخصائي تقنية معلومات في الرياض',
    lead: 'أدير بنية تحتية متعددة المواقع، وأضبط الحسابات والأصول، وأؤتمت ما بينها.',
    viewCv: 'عرض السيرة الذاتية',
    downloadCv: 'تحميل السيرة',
    roomLabel: 'ما أعمل عليه، مسار في كل زاوية من الغرفة',
    hint: 'اضغط على أي ركن في الغرفة لتقترب منه',
    hintTouch: 'المس أي ركن في الغرفة، أو أحد المسارات بالأسفل، لتقترب منه',
    detailLabel: 'تفاصيل المسار',
    back: 'العودة إلى الغرفة',
    prev: 'السابق',
    next: 'التالي'
  },
  tracks: [
    {
      name: 'البنية التحتية',
      tool: 'Frigate NVR',
      title: '٣٩ كاميرا على Frigate NVR',
      note: 'تسجيل مستمر في ٣ مواقع عبر Docker Compose.',
      where: 'Gulf Link',
      points: [
        'نشرت Frigate NVR على Docker Compose لمراقبة ٣٩ كاميرا Hikvision في ٣ مواقع بالرياض والدمام.',
        'فعّلت التسجيل المستمر بسياسات احتفاظ محددة.',
        'عالجت إعدادات YAML ولوحة العرض التي كانت تحصر البث المباشر في ١٠ كاميرات، حتى ظهرت الكاميرات الـ٣٩ كلها.'
      ],
      tools: ['Frigate NVR', 'Docker Compose', 'Hikvision', 'YAML']
    },
    {
      name: 'الشبكات',
      tool: 'WireGuard',
      title: '٣ مواقع عبر WireGuard',
      note: 'ربط Site-to-Site VPN بين الرياض والدمام.',
      where: 'Gulf Link',
      points: [
        'ربطت المواقع الثلاثة في الرياض والدمام عبر WireGuard (Site-to-Site VPN).',
        'وفّرت بثاً وتسجيلاً مركزياً آمناً لكل الكاميرات بين المدن.',
        'سجلت الشركة في بوابة شركاء Hikvision التقنيين للحصول على وثائق ISAPI وSDK الرسمية.'
      ],
      tools: ['WireGuard', 'Site-to-Site VPN', 'TCP/IP', 'Hikvision ISAPI']
    },
    {
      name: 'الهوية',
      tool: 'Active Directory',
      title: 'Active Directory وGPO وLAPS',
      note: 'دورة حياة الحسابات وأمان الأجهزة في وزارة التجارة.',
      where: 'وزارة التجارة',
      points: [
        'أدرت دورة حياة الحسابات في Active Directory: إنشاء الحسابات، والوحدات التنظيمية، وتحديث الصلاحيات، وحسابات المغادرين.',
        'طبقت Group Policy لفرض إعدادات الأمان والتهيئة على الأجهزة المرتبطة بالنطاق.',
        'أدرت LAPS لتأمين كلمات مرور المسؤول المحلي وتدويرها.',
        'نفذت ترحيل أجهزة الموظفين إلى Windows 11.'
      ],
      tools: ['Active Directory', 'Group Policy', 'LAPS', 'Windows 11']
    },
    {
      name: 'التشغيل',
      tool: 'Snipe-IT',
      title: 'Snipe-IT وDynamics 365',
      note: 'الأصول والتراخيص والعهد وطلبات الشراء.',
      where: 'Gulf Link · وزارة التجارة',
      points: [
        'نشرت Snipe-IT لتتبع الأصول التقنية وتراخيص البرامج ودورة حياة الأجهزة وعهد الموظفين.',
        'رفعت وتابعت طلبات الشراء والموافقات عبر Microsoft Dynamics 365.',
        'دعمت المستخدمين في مشاكل النظام والبرامج والأجهزة، مع توثيق كل تذكرة.'
      ],
      tools: ['Snipe-IT', 'Dynamics 365', 'التذاكر', 'دعم المستخدمين']
    },
    {
      name: 'الأتمتة',
      tool: 'n8n',
      title: 'n8n وPython وDocker',
      note: 'مسارات عمل لطلبات عروض الأسعار وتقييم الموردين.',
      where: 'Gulf Link · المشاريع',
      points: [
        'بنيت مسارات n8n تجريبية مرتبطة بقواعد البيانات لتسريع طلبات عروض الأسعار وتقييم الموردين.',
        'شغّلت الخدمات في حاويات Docker Compose، من مسجّل الكاميرات إلى مختبر منزلي على Proxmox.',
        'بنيت بـ Python نموذج CNN يقرأ ٣١ حرفاً من لغة الإشارة العربية، ويعمل في المتصفح عبر TensorFlow.js.'
      ],
      tools: ['n8n', 'Python', 'Docker', 'SQL']
    }
  ],
  techLabel: 'الأدوات التي أعمل بها',
  about: {
    title: 'نبذة',
    text: 'أعمل في البنية التحتية والهوية وتشغيل تقنية المعلومات، في بيئات خاصة وحكومية. في Gulf Link أدرت بنية مراقبة متعددة المواقع عبر WireGuard، وأدرت الأصول والتراخيص في Snipe-IT، وأتمتّ مسارات العمل بـ n8n. وقبلها في وزارة التجارة أدرت حسابات Active Directory وGroup Policy وLAPS ودعمت المستخدمين.',
    stats: [
      { value: 39, label: 'كاميرا IP على مسجّل واحد' },
      { value: 3, label: 'مواقع مرتبطة عبر VPN' },
      { value: 31, label: 'حرفاً من لغة الإشارة يقرؤها نموذجي' }
    ]
  },
  experience: {
    title: 'الخبرة',
    legend: 'معنى الألوان',
    jobs: [
      {
        role: 'أخصائي تقنية معلومات',
        org: 'Gulf Link، الرياض',
        period: 'أغسطس ٢٠٢٦ – نوفمبر ٢٠٢٦',
        bullets: [
          [0, 'نشرت Frigate NVR على Docker Compose لمراقبة ٣٩ كاميرا Hikvision في ٣ مواقع بالرياض والدمام من مكان واحد، بتسجيل مستمر وسياسات احتفاظ محددة.'],
          [1, 'ربطت المواقع عبر WireGuard (Site-to-Site VPN) لبث وتسجيل مركزي آمن بين المدن.'],
          [0, 'عالجت مشاكل إعدادات YAML ولوحة العرض التي كانت تحصر العرض المباشر في ١٠ كاميرات، حتى ظهرت كل الكاميرات الـ٣٩.'],
          [3, 'نشرت Snipe-IT لتتبع الأصول التقنية وتراخيص البرامج ودورة حياة الأجهزة وعهد الموظفين.'],
          [4, 'بنيت مسارات أتمتة تجريبية على n8n مرتبطة بقواعد البيانات لتسهيل معالجة طلبات عروض الأسعار وتقييم الموردين.'],
          [3, 'رفعت وتابعت طلبات الشراء والموافقات الخاصة بالقسم عبر Microsoft Dynamics 365.'],
          [0, 'سجلت الشركة في بوابة شركاء Hikvision التقنيين للحصول على وثائق ISAPI/SDK الرسمية لتكاملات مستقبلية.']
        ]
      },
      {
        role: 'متدرب دعم فني وإدارة أنظمة',
        org: 'وزارة التجارة، الرياض',
        period: 'يونيو ٢٠٢٥ – يناير ٢٠٢٦',
        bullets: [
          [2, 'أدرت دورة حياة حسابات المستخدمين في Active Directory: إنشاء الحسابات، وتنظيم الوحدات التنظيمية (OUs)، وتحديث الصلاحيات، وتعطيل حسابات المغادرين.'],
          [2, 'طبقت Group Policy Objects لفرض إعدادات الأمان والتهيئة على الأجهزة المرتبطة بالنطاق.'],
          [2, 'أدرت LAPS لتأمين كلمات مرور المسؤول المحلي وتدويرها على الأجهزة.'],
          [2, 'نفذت ترحيل أجهزة الموظفين إلى Windows 11 على مستوى الجهة، مع انتقال سلس وحفظ سلامة البيانات.'],
          [3, 'دعمت المستخدمين في مشاكل نظام التشغيل والبرامج والأجهزة، مع توثيق التذاكر وحلها في بيئة حكومية.']
        ]
      }
    ]
  },
  projects: {
    title: 'المشاريع',
    newTab: 'يفتح في تبويب جديد',
    items: [
      { name: 'مترجم لغة الإشارة العربية', alt: 'عمل فني تجريدي لأيدٍ تؤشر مرسومة بالضوء', text: 'يحوّل حروف لغة الإشارة العربية إلى نص لحظياً. نموذج CNN مخصص يتعرف على ٣١ حرفاً من نقاط اليد عبر MediaPipe، ونسخة TensorFlow.js تعمل داخل المتصفح بخصوصية كاملة.' },
      { name: 'نبراس', alt: 'عمل فني تجريدي لمنصة نبراس التعليمية', text: 'منصة تعليمية لحظية متعددة اللاعبين بوضع لعب للاستحواذ على المناطق ونقاط مباشرة. حالة اللعبة والعملة داخل التطبيق تُدار عبر SQL RPCs آمنة.' },
      { name: 'حجوزاتي (MyReservation)', alt: 'عمل فني تجريدي لتقويم حجوزات', text: 'نظام حجوزات على الويب يعالج الحجوزات المتزامنة مع توفر لحظي، ومصادقة المستخدمين، وصلاحيات حسب الدور.', stack: ['تطوير ويب متكامل', 'مصادقة', 'صلاحيات حسب الدور'] },
      { name: 'السيرفر المنزلي والمختبر', alt: 'عمل فني تجريدي لخوادم تربطها خطوط مضيئة', text: 'مختبر ذاتي الاستضافة على Ubuntu Server وProxmox مع خدمات Docker وتخزين RAID ومراقبة UPS عبر NUT.' }
    ]
  },
  skills: {
    title: 'المهارات',
    groups: ['البنية التحتية', 'الشبكات', 'الهوية', 'التشغيل', 'الأتمتة والتطوير', 'اللغات']
  },
  education: {
    title: 'التعليم',
    items: [
      { name: 'بكالوريوس علوم الحاسب', org: 'جامعة الملك سعود', period: '٢٠٢٠ – ٢٠٢٦', note: 'مقررات في شبكات الحاسب وأنظمة التشغيل وإدارة قواعد البيانات والذكاء الاصطناعي.' },
      { name: 'اعتماد مهني', org: 'الهيئة السعودية للمهندسين', period: '٢٠٢٦', note: '' }
    ]
  },
  contact: {
    title: 'التواصل',
    text: 'للعمل في البنية التحتية التقنية أو إدارة الأنظمة أو تشغيل الشبكات أو الأتمتة، أرسل لي رسالة.',
    location: 'الرياض، المملكة العربية السعودية',
    nameLabel: 'اسمك',
    emailLabel: 'بريدك الإلكتروني',
    messageLabel: 'الرسالة',
    send: 'إرسال الرسالة',
    sending: 'جارٍ الإرسال…',
    success: 'وصلت رسالتك. سأرد عليك قريباً.',
    error: 'لم تُرسل الرسالة. تحقق من اتصالك وحاول مرة أخرى، أو راسلني على البريد مباشرة.'
  },
  cv: { title: 'السيرة الذاتية', download: 'تحميل السيرة', close: 'إغلاق', openTab: 'فتح في تبويب جديد' },
  footer: { rights: 'جميع الحقوق محفوظة.' }
};

// Attach the language-independent data (media, links, chips, skill lists) to each language.
Object.entries({ en, ar }).forEach(([code, dict]) => {
  dict.projects.items = dict.projects.items.map((item, i) => ({
    ...PROJECT_MEDIA[i],
    ...item,
    stack: item.stack || PROJECT_MEDIA[i].stack
  }));
  dict.experience.jobs = dict.experience.jobs.map((job, i) => ({ ...job, chips: JOB_CHIPS[i] }));
  dict.skills.groups = dict.skills.groups.map((name, i) => ({
    name,
    track: i < 5 ? i : null,
    items: SKILL_ITEMS[code][i]
  }));
});

export const content = { en, ar };
