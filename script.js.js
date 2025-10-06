// script.js
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const langSwitcherButtons = document.querySelectorAll('.lang-switcher button');
    const adminToggleButton = document.querySelector('.admin-toggle button');
    let isAdminMode = false;
    let currentLang = 'ar'; // Default language

    // Store original text content for translation purposes
    const originalContent = {};

    function storeOriginalContent() {
        document.querySelectorAll('[data-ar]').forEach(el => {
            originalContent[el.dataset.key || el.id || el.tagName + el.innerText.substring(0,10)] = el.dataset.ar;
        });
    }

    function switchLanguage(lang) {
        if (lang === currentLang) return;

        body.classList.remove(`lang-${currentLang}`);
        body.classList.add(`lang-${lang}`);
        body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        currentLang = lang;

        // Update active state of language buttons
        langSwitcherButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Apply translations
        document.querySelectorAll('[data-ar]').forEach(el => {
            const key = el.dataset.key || el.id || el.tagName + el.innerText.substring(0,10);
            if (lang === 'en' && el.dataset.en) {
                el.innerText = el.dataset.en;
            } else if (lang === 'ar' && originalContent[key]) {
                el.innerText = originalContent[key];
            }
        });

        // Update placeholders
        const searchInput = document.querySelector('.search-container input');
        if (searchInput) {
            searchInput.placeholder = (lang === 'ar') ? 'ابحث في المدونة...' : 'Search the blog...';
        }
        const newsletterInput = document.querySelector('.newsletter input');
        if (newsletterInput) {
            newsletterInput.placeholder = (lang === 'ar') ? 'أدخل بريدك الإلكتروني' : 'Enter your email';
        }

        // Update button texts
        document.querySelectorAll('.newsletter button').forEach(btn => {
            btn.innerText = (lang === 'ar') ? 'اشتراك' : 'Subscribe';
        });
        document.querySelectorAll('.read-more').forEach(btn => {
            btn.innerText = (lang === 'ar') ? 'قراءة المزيد' : 'Read More';
        });
        document.querySelectorAll('.add-article-btn').forEach(btn => {
            btn.innerText = (lang === 'ar') ? 'إضافة مقال جديد' : 'Add New Article';
        });
        document.querySelectorAll('.post-actions button.edit').forEach(btn => {
            btn.innerText = (lang === 'ar') ? 'تعديل' : 'Edit';
        });
        document.querySelectorAll('.post-actions button.delete').forEach(btn => {
            btn.innerText = (lang === 'ar') ? 'حذف' : 'Delete';
        });
        document.querySelectorAll('.social-share span').forEach(span => {
            span.innerText = (lang === 'ar') ? 'شارك المقال:' : 'Share Article:';
        });
    }

    // Initialize original content and set default language active state
    storeOriginalContent();
    langSwitcherButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });

    // Language switcher click handlers
    langSwitcherButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchLanguage(button.dataset.lang);
        });
    });

    // Admin Mode Toggle
    if (adminToggleButton) {
        adminToggleButton.addEventListener('click', () => {
            isAdminMode = !isAdminMode;
            body.classList.toggle('admin-mode', isAdminMode);
            adminToggleButton.innerText = isAdminMode ?
                ((currentLang === 'ar') ? 'وضع المشاهدة' : 'View Mode') :
                ((currentLang === 'ar') ? 'وضع التعديل' : 'Edit Mode');
            // Show/hide "Add New Article" button in admin mode
            const addArticleWrapper = document.querySelector('.add-article-btn-wrapper');
            if (addArticleWrapper) {
                addArticleWrapper.style.display = isAdminMode ? 'block' : 'none';
            }
        });
         // Hide "Add New Article" button by default
         document.querySelector('.add-article-btn-wrapper').style.display = 'none';
    }


    // Simple interactivity for newsletter form
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if(email) {
                alert((currentLang === 'ar') ? 'تم الاشتراك بنجاح! شكراً لانضمامك إلى مجتمع المدونة.' : 'Subscription successful! Thanks for joining the blog community.');
                this.reset();
            } else {
                alert((currentLang === 'ar') ? 'الرجاء إدخال بريد إلكتروني صالح للاشتراك.' : 'Please enter a valid email to subscribe.');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href.startsWith('#') && href.length > 1) { // Only for internal anchors
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - (document.querySelector('header')?.offsetHeight || 0), // Account for sticky header
                        behavior: 'smooth'
                    });
                }
            } else if (href === '#') { // For links to the very top
                 e.preventDefault();
                 window.scrollTo({
                     top: 0,
                     behavior: 'smooth'
                 });
            }
        });
    });

    // Basic search functionality (client-side, for demonstration)
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                alert((currentLang === 'ar') ? `جار البحث عن: "${query}" (هذه وظيفة عرض توضيحي)` : `Searching for: "${query}" (This is a demo function)`);
                // In a real application, you'd redirect to a search results page
                // window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Editing buttons functionality (demo)
    document.querySelectorAll('.post-actions button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent post click if implemented
            const action = button.classList.contains('edit') ? 'edit' : 'delete';
            const postTitle = button.closest('.post').querySelector('h2').innerText;
            alert((currentLang === 'ar') ? `قمت بالنقر على "${action === 'edit' ? 'تعديل' : 'حذف'}" للمقال: "${postTitle}".\n(وظيفة عرض توضيحي)` : `You clicked "${action}" for article: "${postTitle}".\n(Demo function)`);
        });
    });

    document.querySelector('.add-article-btn').addEventListener('click', (e) => {
        e.preventDefault();
        alert((currentLang === 'ar') ? 'قمت بالنقر على "إضافة مقال جديد".\n(وظيفة عرض توضيحي)' : 'You clicked "Add New Article".\n(Demo function)');
    });
});