document.addEventListener('DOMContentLoaded', () => {

    // Language Data
    const translations = {
        en: {
            nav_home: "Home",
            nav_about: "About",
            nav_projects: "Projects",
            nav_experience: "Experience",
            nav_contact: "Contact",
            hero_greeting: "Hello, I'm",
            hero_name: "Abdulmalik Altamimi",
            hero_description: "Computer Science graduate specializing in IT infrastructure and network environments. I combine a deep understanding of servers with the ability to develop integrated tech solutions and smart applications.",
            hero_btn_exp: "My Experience",
            hero_btn_work: "View My Work",
            hero_btn_cv: "Download CV",
            about_title: "About Me",
            about_p1: "I am a Computer Science graduate with a strong passion for IT networks and infrastructure. My technical journey is driven by a love for exploring Linux environments, self-hosting setups, and orchestrating efficient deployments using Docker.",
            about_p2: "Beyond servers, I enjoy building practical software solutions. Whether it's developing interactive mobile apps with Flutter or building web systems with robust databases, I thrive on bridging the gap between solid backend systems and seamless user experiences.",
            skills_title: "My Skills",
            exp_title: "Work Experience",
            exp_role: "IT Support Intern",
            exp_company: "Ministry of Commerce",
            exp_date: "July 2025 - January 2026",
            exp_desc: "Provided essential IT support and network troubleshooting. Worked on automating workflow processes to ensure operational continuity, gaining valuable hands-on experience with enterprise-level technical systems.",
            exp_tags: ["IT Support", "Networking", "Automation"],
            projects_title: "My Projects",
            filter_all: "All",
            filter_web: "Web",
            filter_mobile: "Mobile",
            filter_sys: "Systems",
            view_details: "View Details",
            proj_nibras_title: "Nibras (نبراس)",
            proj_nibras_mini_desc: "A high-performance interactive quiz platform built with Flutter and Supabase, featuring real-time data synchronization and a scalable cloud backend.",
            proj_nibras_desc: "Nibras is a sophisticated Quiz Game ecosystem designed for high engagement and performance. Built using Flutter for a native-feel cross-platform experience, it leverages Supabase (PostgreSQL) for handling real-time database operations, user authentication, and activity tracking. The project includes a customized scoring engine and handles complex data relations for competitive gameplay.",
            proj_nibras_tags: ["Flutter", "Supabase", "PostgreSQL", "BaaS"],
            proj_asl_title: "Arabic Sign Language Recognition",
            proj_asl_mini_desc: "An AI-powered mobile and web application using TFLite for real-time translation of Arabic Sign Language (ArSL).",
            proj_asl_desc: "This initiative bridges the gap for the hearing-impaired by deploying pre-trained AI models on edge devices. I transformed a Python-based research model into a production-ready application using Flutter and TensorFlow Lite. It features real-time computer vision processing, analyzing complex hand movements through the camera and translating them into Arabic text with high accuracy and low latency.",
            proj_asl_tags: ["Flutter", "TensorFlow Lite", "Computer Vision", "AI/ML"],
            proj_res_title: "MyReservations",
            proj_res_mini_desc: "A robust full-stack web platform for enterprise-level restaurant reservation and seat management.",
            proj_res_desc: "MyReservations is a comprehensive business solution for hospitality management. Developed with a pure PHP backend and SQL database, it manages complex business logic including seating capacity algorithms, automated reservation confirmations, and conflict-prevention scheduling. The architecture focuses on database integrity and high-performance server-side processing.",
            proj_res_tags: ["PHP", "MySQL", "Full-Stack Dev", "Database Design"],
            proj_srv_title: "Home Server & Automation",
            proj_srv_mini_desc: "A scalable self-hosted infrastructure running on Arch Linux, utilizing Docker for container orchestration and n8n for workflow automation.",
            proj_srv_desc: "A deep dive into DevOps and system administration. I architected a private cloud environment using Linux and Docker, hosting various services from development tools to storage solutions. The infrastructure is highly automated via n8n, managing routine security tasks, service monitoring, and periodic cloud-syncing, ensuring maximum uptime and data privacy.",
            proj_srv_tags: ["Arch Linux", "Docker", "DevOps", "n8n Automation"],
            contact_title: "Get In Touch",
            contact_subtitle: "Let's Connect",
            contact_p: "I'm always open to discussing new projects, tech collaborations, or opportunities in Full-stack Dev or IT systems.",
            contact_name: "Your Name",
            contact_email: "Your Email",
            contact_message: "Your Message",
            contact_send: "Send Message",
            contact_sending: "Sending...",
            contact_success: "Message sent successfully! I will get back to you soon.",
            contact_error: "Oops! There was a problem submitting your form. Please try again.",
            footer_rights: "All rights reserved.",
            modal_features_title: "Key Features",
            typing_words: ["Computer Science Graduate", "IT Infrastructure & Servers", "Tech Solutions Developer"],
            contact_placeholder_name: "Abdulmalik Altamimi",
            contact_placeholder_email: "name@example.com",
            contact_placeholder_message: "How can I help you?"
        },
        ar: {
            nav_home: "الرئيسية",
            nav_about: "عني",
            nav_projects: "المشاريع",
            nav_experience: "الخبرة",
            nav_contact: "تواصل معي",
            hero_greeting: "مرحباً، أنا",
            hero_name: "عبدالملك التميمي",
            hero_description: "خريج علوم حاسب متخصص في البنية التحتية التقنية وبيئات الشبكات. أجمع بين الفهم العميق للخوادم والقدرة على تطوير حلول تقنية وتطبيقات ذكية متكاملة.",
            hero_btn_exp: "خبراتي",
            hero_btn_work: "أعمالي",
            hero_btn_cv: "تحميل السيرة الذاتية",
            about_title: "من أنا",
            about_p1: "أنا خريج علوم حاسب بشغف كبير تجاه شبكات الحاسب والبنية التحتية التقنية. رحلتي التقنية مبنية على حبي لاستكشاف أنظمة اللينكس، بيئات الاستضافة الذاتية (Self-hosting)، وإدارة ونشر الخدمات بكفاءة عالية عبر حاويات Docker.",
            about_p2: "إلى جانب إدارة الخوادم، أستمتع ببناء حلول برمجية عملية. سواء كان ذلك بتطوير تطبيقات تفاعلية باستخدام Flutter، أو بناء أنظمة ويب تدعم قواعد بيانات قوية، أجد متعتي في الربط بين الأنظمة الخلفية الصلبة وتجارب المستخدم السلسة.",
            skills_title: "مهاراتي",
            exp_title: "الخبرة العملية",
            exp_role: "متدرب دعم فني",
            exp_company: "وزارة التجارة",
            exp_date: "١ يوليو ٢٠٢٥ - ١ يناير ٢٠٢٦",
            exp_desc: "قدمت الدعم الفني الأساسي وساهمت في استكشاف أخطاء الشبكات وإصلاحها. عملت على أتمتة بعض إجراءات سير العمل لضمان استمرارية التشغيل، مما أكسبني خبرة عملية قيمة في التعامل مع الأنظمة التقنية وبيئات العمل المؤسسية.",
            exp_tags: ["دعم فني", "شبكات", "أتمتة"],
            projects_title: "مشاريعي",
            filter_all: "الكل",
            filter_web: "ويب",
            filter_mobile: "تطبيقات",
            filter_sys: "أنظمة",
            view_details: "التفاصيل",
            proj_nibras_title: "نبراس (Nibras)",
            proj_nibras_mini_desc: "منصة مسابقات تفاعلية عالية الأداء مبنية باستخدام Flutter و Supabase، تتميز بمزامنة لحظية للبيانات وبنية تحتية سحابية قابلة للتوسع.",
            proj_nibras_desc: "تطبيق 'نبراس' هو منظومة مسابقات (Quiz Game) متطورة تم تطويرها باستخدام إطار عمل Flutter لضمان تجربة مستخدم سلسة وأداء مشابه للتطبيقات الأصلية (Native). يعتمد التطبيق على قاعدة بيانات Supabase (PostgreSQL) لمعالجة البيانات اللحظية، وإدارة هوية المستخدمين، وتتبع النشاط. يتضمن المشروع محركاً مخصصاً لحساب النقاط يراعي مستويات الصعوبة المختلفة.",
            proj_nibras_tags: ["Flutter", "Supabase", "PostgreSQL", "BaaS"],
            proj_asl_title: "التعرف على لغة الإشارة العربية",
            proj_asl_mini_desc: "تطبيق ذكي يعتمد على نماذج تعلم الآلة (TFLite) لترجمة لغة الإشارة العربية في الوقت الفعلي عبر تقنيات الرؤية الحاسوبية.",
            proj_asl_desc: "مشروع يهدف إلى تسهيل التواصل لفئة الصم والبكم عبر تحويل نموذج ذكاء اصطناعي (تم تطويره باستخدام Python) إلى تطبيق عملي يعمل على الهواتف. تم دمج نموذج تعلم الآلة عبر تقنية TensorFlow Lite لمعالجة الصور في الوقت الفعلي، حيث يقوم التطبيق بتحليل حركات اليد المعقدة عبر الكاميرا وترجمتها إلى نصوص عربية ومفردات فورية بدقة وسرعة عالية.",
            proj_asl_tags: ["Flutter", "TensorFlow Lite", "رؤية حاسوبية", "ذكاء اصطناعي"],
            proj_res_title: "حجوزاتي (MyReservations)",
            proj_res_mini_desc: "منصة ويب متكاملة مبنية بـ PHP و SQL مخصصة لإدارة حجوزات المطاعم وتنظيم السعات التشغيلية بكفاءة.",
            proj_res_desc: "نظام 'MyReservations' هو حل تقني متكامل لإدارة الأعمال في قطاع الضيافة. تم بناء الواجهة الخلفية باستخدام PHP وقواعد بيانات SQL لإدارة عمليات منطقية معقدة، مثل خوارزميات توزيع الطاولات، التأكيدات التلقائية، وجدولة المواعيد المتقدمة التي تمنع تعارض الحجوزات، مع التركيز العالي على سلامة البيانات وسرعة المعالجة.",
            proj_res_tags: ["PHP", "MySQL", "تطوير شامل", "قواعد بيانات"],
            proj_srv_title: "السيرفر المنزلي والأتمتة",
            proj_srv_mini_desc: "بنية تحتية سحابية خاصة تعتمد على نظام Arch Linux، تستخدم Docker لإدارة الحاويات وأداة n8n لأتمتة مسارات العمل التقنية.",
            proj_srv_desc: "مشروع متقدم في مجال الـ DevOps وإدارة الأنظمة. قمت بناء بيئة سحابية خاصة باستخدام Linux و Docker، استضيف من خلالها مجموعة من الخدمات التقنية والأدوات البرمجية الخاصة. البنية التحتية مؤتمتة بالكامل عبر n8n، لإدارة المهام الأمنية الدورية، مراقبة الخدمات، والمزامنة السحابية التلقائية، مما يضمن استمرارية التشغيل وخصوصية البيانات.",
            proj_srv_tags: ["Arch Linux", "Docker", "DevOps", "أتمتة التقنيات"],
            contact_title: "تواصل معي",
            contact_subtitle: "لنكن على اتصال",
            contact_p: "أنا منفتح دائماً لمناقشة المشاريع الجديدة، أو التعاون التقني، أو الفرص في تطوير البرمجيات أو أنظمة تقنية المعلومات.",
            contact_name: "اسمك",
            contact_email: "بريدك الإلكتروني",
            contact_message: "رسالتك",
            contact_send: "إرسال الرسالة",
            contact_sending: "جاري الإرسال...",
            contact_success: "تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.",
            contact_error: "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.",
            footer_rights: "جميع الحقوق محفوظة.",
            modal_features_title: "المميزات الرئيسية",
            typing_words: ["خريج علوم حاسب", "بنية تحتية وخوادم", "مطور حلول تقنية"],
            contact_placeholder_name: "عبدالملك التميمي",
            contact_placeholder_email: "name@example.com",
            contact_placeholder_message: "كيف يمكنني مساعدتك؟"
        }
    };

    // Project Detail Info for Modal
    const projectDetails = {
        nibras: {
            features: {
                en: ["Native cross-platform execution (Flutter)", "Cloud-native BaaS (Supabase/PostgreSQL)", "Dynamic difficulty weight system", "Real-time global leaderboard & state sync", "Robust RLS (Row Level Security) policies"],
                ar: ["تنفيذ أصيل عبر المنصات (Flutter)", "اعتماد كامل على الخدمات السحابية (Supabase/PostgreSQL)", "نظام موازنة ديناميكي لمستويات الصعوبة", "لوحة صدارة عالمية ومزامنة لحظية للحالات", "سياسات أمنية متقدمة لحماية البيانات (RLS)"]
            }
        },
        asl: {
            features: {
                en: ["High-accuracy Hand-pose detection", "Edge computing using TFLite (No server needed)", "Real-time vision processing (high FPS)", "Intuitive interface for disability assistance", "Supports multiple gestures and word patterns"],
                ar: ["كشف دقيق لوضعيات اليد وحركاتها", "معالجة طرفية (TFLite) تعمل دون الحاجة للخوادم", "معالجة رؤية حاسوبية فورية بمعدل إطارات عالٍ", "واجهة بديهية مصممة لمساعدة المعاقين سمعياً", "يدعم أنماط متعددة للإيماءات والمفردات"]
            }
        },
        reservations: {
            features: {
                en: ["Relational schema design for high integrity", "Conflict-prevention scheduling algorithms", "Full-scale administrative dashboard", "Email/SMS automated notification support", "Performance-optimized SQL queries"],
                ar: ["تصميم قواعد بيانات علائقية بسلامة عالية", "خوارزميات جدولة متقدمة تمنع التداخل", "لوحة تحكم كاملة للإدارة والتقارير", "دعم الإشعارات التلقائية (SMS/Email)", "استعلامات SQL معالجة لضمان سرعة الاستجابة"]
            }
        },
        server: {
            features: {
                en: ["Microservices orchestration with Docker", "Automated backup & sync pipelines (n8n)", "Advanced Linux networking & firewall config", "System health monitoring & status alerts", "Scalable architecture for adding new services"],
                ar: ["إدارة بنية الميكروسيرفس عبر تقنية Docker", "مسارات نسخ احتياطي ومزامنة تلقائية (n8n)", "إعدادات شبكات لينكس وجدران حماية متقدمة", "مراقبة دورية لصحة النظام وتنبيهات الحالة", "بنية قابلة للتوسع لإضافة خدمات جديدة بسهولة"]
            }
        }
    };

    let currentLang = 'en';

    function updateContent() {
        const langData = translations[currentLang];
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                if (Array.isArray(langData[key])) {
                    element.innerHTML = langData[key].map(tag => `<span>${tag}</span>`).join('');
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.placeholder && element.placeholder !== " ") {
                        element.placeholder = langData[key];
                    }
                } else if (element.tagName === 'LABEL') {
                    element.textContent = langData[key];
                } else {
                    element.textContent = langData[key];
                }
            }
        });

        // Update form placeholders specifically
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        if (nameInput) nameInput.placeholder = langData.contact_placeholder_name || '';
        if (emailInput) emailInput.placeholder = langData.contact_placeholder_email || '';
        if (messageInput) messageInput.placeholder = langData.contact_placeholder_message || '';

        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        resetTypingEffect();
    }

    // Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            langBtn.textContent = currentLang === 'en' ? 'Arabic' : 'English';
            updateContent();
        });
    }

    // Modal Logic
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const modalFeaturesList = document.getElementById('modal-features-list');
    const closeBtn = document.querySelector('.close-modal');

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const langData = translations[currentLang];
            const details = projectDetails[projectId];

            // Mapping project IDs to translation keys
            const keyMap = {
                'nibras': 'nibras',
                'asl': 'asl',
                'reservations': 'res',
                'server': 'srv'
            };
            const translationKey = keyMap[projectId] || projectId;

            modalTitle.textContent = langData[`proj_${translationKey}_title`] || 'Project';
            modalDesc.textContent = langData[`proj_${translationKey}_desc`] || '';

            // Populate Tags
            const tags = langData[`proj_${translationKey}_tags`] || [];
            modalTags.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');

            // Populate Features
            if (details && details.features && details.features[currentLang]) {
                modalFeaturesList.innerHTML = details.features[currentLang].map(f => `<li>${f}</li>`).join('');
            } else {
                modalFeaturesList.innerHTML = '';
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Nav effect
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // Mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksList = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => navLinksList.classList.toggle('active'));
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => { if (navLinksList) navLinksList.classList.remove('active'); });
    });

    // Typing Effect
    const typingTextEl = document.querySelector('.typing-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    let typingTimeout;

    function typeEffect() {
        if (!typingTextEl) return;
        const words = translations[currentLang].typing_words;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }
        typingTimeout = setTimeout(typeEffect, typingSpeed);
    }

    function resetTypingEffect() {
        if (typingTimeout) clearTimeout(typingTimeout);
        wordIndex = 0;
        charIndex = 0;
        isDeleting = false;
        if (typingTextEl) typingTextEl.textContent = '';
        typeEffect();
    }

    typeEffect();

    // Project Filter
    const filterBtnsList = document.querySelectorAll('.filter-btn');
    const projectCardsList = document.querySelectorAll('.project-item');
    filterBtnsList.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtnsList.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            projectCardsList.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.classList.remove('hide');
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
                } else {
                    card.style.opacity = '0'; card.style.transform = 'scale(0.8)';
                    setTimeout(() => card.classList.add('hide'), 300);
                }
            });
        });
    });

    // Scroll Anim
    const observerObj = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observerObj.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .section-title, .hero-content').forEach(el => {
        el.classList.add('hidden-el');
        observerObj.observe(el);
    });

    // AJAX Form Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${translations[currentLang].contact_sending}`;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = translations[currentLang].contact_success;
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        formStatus.textContent = data.errors.map(error => error.message).join(", ");
                    } else {
                        formStatus.textContent = translations[currentLang].contact_error;
                    }
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = translations[currentLang].contact_error;
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    updateContent();
});
