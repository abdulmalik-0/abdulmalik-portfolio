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
            proj_nibras_mini_desc: "An interactive quiz platform built with Flutter and Supabase, offering a seamless challenge experience with real-time data synchronization.",
            proj_nibras_desc: "Nibras is a comprehensive Quiz Game platform developed using Flutter for high performance and a smooth user experience. It relies on a Supabase database for real-time data processing, synchronization, and user management. It features diverse questions to challenge users in an interactive environment.",
            proj_nibras_tags: ["Flutter", "Supabase", "Mobile App"],
            proj_asl_title: "Arabic Sign Language Recognition",
            proj_asl_mini_desc: "A smart mobile app leveraging TFLite to translate Arabic Sign Language in real-time via the device camera.",
            proj_asl_desc: "A project aimed at facilitating communication by converting a pre-built Python AI model into a complete mobile and web application. Built with Flutter, and integrated via TensorFlow Lite to analyze hand movements through the device camera and translate them into text instantly.",
            proj_asl_tags: ["Flutter", "TFLite", "AI/ML", "Python"],
            proj_res_title: "MyReservations",
            proj_res_mini_desc: "A comprehensive web platform built with PHP and SQL for efficient restaurant reservation management.",
            proj_res_desc: "MyReservations is a web-based system dedicated to restaurant booking management. The backend was developed using PHP to handle complex business logic, such as availability checks and peak-time management, ensuring data accuracy via a robust relational database structure.",
            proj_res_tags: ["PHP", "SQL", "Full-stack"],
            proj_srv_title: "Home Server & Automation",
            proj_srv_mini_desc: "Self-hosted infrastructure running on Linux, utilizing Docker for service management and tools like n8n for automation.",
            proj_srv_desc: "An infrastructure project focused on creating and managing a self-hosted environment using Linux. It relies primarily on Docker for building and isolating various service containers, simplifying deployment and maintenance. It also integrates n8n for building pipelines that automate daily tasks with high efficiency.",
            proj_srv_tags: ["Linux", "Docker", "n8n", "Self-hosting"],
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
            proj_nibras_mini_desc: "منصة مسابقات تفاعلية مبنية باستخدام Flutter و Supabase، تقدم تجربة تحدي ممتعة مع مزامنة لحظية للبيانات.",
            proj_nibras_desc: "تطبيق 'نبراس' هو منصة مسابقات (Quiz Game) متكاملة تم تطويرها باستخدام إطار عمل Flutter لضمان أداء عالٍ وتجربة مستخدم سلسة. يعتمد التطبيق على قاعدة بيانات Supabase لمعالجة ومزامنة البيانات اللحظية وإدارة المستخدمين. يتميز بأسئلة متنوعة لتحدي المستخدمين في بيئة تفاعلية.",
            proj_nibras_tags: ["Flutter", "Supabase", "تطبيق موبايل"],
            proj_asl_title: "التعرف على لغة الإشارة العربية",
            proj_asl_mini_desc: "تطبيق ذكي يعتمد على نماذج تعلم الآلة (TFLite) لترجمة لغة الإشارة العربية في الوقت الفعلي عبر كاميرا الهاتف.",
            proj_asl_desc: "مشروع يهدف إلى تسهيل التواصل عبر تحويل نموذج ذكاء اصطناعي (مبني مسبقاً بـ Python) إلى تطبيق متكامل يعمل على الهواتف والويب. تم بناء الواجهة باستخدام Flutter، وتم دمج نموذج تعلم الآلة عبر تقنية TensorFlow Lite لتحليل حركات اليد وترجمتها إلى نصوص فوريّة.",
            proj_asl_tags: ["Flutter", "TFLite", "ذكاء اصطناعي"],
            proj_res_title: "حجوزاتي (MyReservations)",
            proj_res_mini_desc: "منصة ويب متكاملة مبنية بـ PHP و SQL لإدارة حجوزات المطاعم بكفاءة عالية.",
            proj_res_desc: "منصة 'MyReservations' هي نظام ويب مخصص لإدارة حجوزات المطاعم. تم تطوير الواجهة الخلفية للنظام باستخدام لغة PHP للتعامل مع العمليات المنطقية المعقدة (Business Logic)، مثل التحقق من توفر الطاولات وإدارة أوقات الذروة.",
            proj_res_tags: ["PHP", "SQL", "تطوير متكامل"],
            proj_srv_title: "السيرفر المنزلي والأتمتة",
            proj_srv_mini_desc: "بنية تحتية ذاتية الاستضافة تعتمد على نظام Linux، تستخدم Docker و n8n لإدارة الخدمات وأتمتة المهام.",
            proj_srv_desc: "مشروع بنية تحتية يركز على إنشاء وإدارة خادم منزلي (Self-hosted Environment) باستخدام بيئة تشغيل Linux. يعتمد المشروع بشكل أساسي على تقنية Docker لبناء وعزل حاويات الخدمات المختلفة، مع دمج أدوات مثل n8n لأتمتة المهام اليومية.",
            proj_srv_tags: ["Linux", "Docker", "n8n", "استضافة ذاتية"],
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
                en: ["Cross-platform Flutter app", "BaaS Integration (Supabase)", "Interactive Scoring System", "Synced user profiles"],
                ar: ["واجهة مستخدم تدعم أنظمة تشغيل متعددة (Cross-platform)", "ربط متقدم مع واجهة خلفية سحابية (Supabase)", "نظام تفاعلي لعرض الأسئلة وحساب النقاط", "مزامنة لحظية للبيانات"]
            }
        },
        asl: {
            features: {
                en: ["Real-time Vision Processing", "Embedded TFLite Models", "Accessibility-first UI design", "Near-instant translation"],
                ar: ["معالجة الصور في الوقت الفعلي (Real-time Vision)", "دمج نماذج تعلم الآلة (TFLite) في الموبايل", "تصميم واجهة يركز على سهولة الوصول (Accessibility)", "ترجمة فورية ومباشرة"]
            }
        },
        reservations: {
            features: {
                en: ["Solid PHP Backend processing", "Advanced Relational DB (SQL)", "Precise Scheduling Engine", "Conflict Prevention logic"],
                ar: ["واجهة خلفية صلبة لمعالجة الطلبات (PHP)", "إدارة متقدمة لقواعد البيانات العلائقية (SQL)", "نظام جدولة دقيق لإدارة السعة", "منع تعارض الحجوزات"]
            }
        },
        server: {
            features: {
                en: ["Secure Self-hosting environment", "Container management via Docker", "Automated Workflow Pipelines (n8n)", "Centralized Service control"],
                ar: ["استضافة ذاتية آمنة ومستقلة (Self-hosting)", "إدارة الحاويات ونشر الخدمات (Docker)", "تصميم مسارات عمل مؤتمتة (n8n)", "تقليل التدخل اليدوي عبر المحاكاة"]
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
