// script.js

// Configuration object for customizable settings
const CONFIG = {
    navbarScrollThreshold: 50,
    scrollTopThreshold: 500,
    animationDelays: {
        skillCards: 0.05,
        fadeIn: 0.1
    },
    parallaxIntensity: 30,
    intersectionObserver: {
        rootMargin: '50px',
        threshold: 0.15
    },
    typingSpeed: 50
};

// Utility functions
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    random(min, max) {
        return Math.random() * (max - min) + min;
    }
};

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.isMenuOpen = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        window.addEventListener('scroll', utils.debounce(() => {
            this.handleScroll();
        }, 10), { passive: true });

        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
                this.closeMenu();
            }
        });
    }

    handleScroll() {
        if (window.scrollY > CONFIG.navbarScrollThreshold) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.hamburger?.classList.toggle('active');
        this.navLinks?.classList.toggle('active');
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            this.hamburger?.classList.remove('active');
            this.navLinks?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Animation controller
class AnimationController {
    constructor() {
        this.floatingIcons = document.querySelectorAll('.floating-icon');
        this.skillCards = document.querySelectorAll('.skill-card');
        this.projectCards = document.querySelectorAll('.project-card');
        this.observer = this.createIntersectionObserver();

        this.initializeAnimations();
    }

    createIntersectionObserver() {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, CONFIG.intersectionObserver);
    }

    initializeAnimations() {
        requestAnimationFrame(() => {
            this.initializeFloatingIcons();
            this.initializeSkillCards();
            this.initializeProjectCards();
            this.initializeFadeAnimations();
            this.initializeTypingAnimation();
            this.initializeParallax();
            this.initializeNavigation();
        });
    }

    initializeFloatingIcons() {
        this.floatingIcons.forEach(icon => {
            const speed = parseFloat(icon.getAttribute('data-speed')) || 1;
            const randomDelay = utils.random(0, 2);
            icon.style.animation = `float ${6 * speed}s ease-in-out ${randomDelay}s infinite`;
        });
    }

    initializeSkillCards() {
        this.skillCards.forEach((card, index) => {
            card.style.animationDelay = `${index * CONFIG.animationDelays.skillCards}s`;
            this.addHoverEffect(card);
        });
    }

    initializeProjectCards() {
        this.projectCards.forEach(card => {
            this.addHoverEffect(card);
            this.addProjectInteraction(card);
        });
    }

    initializeFadeAnimations() {
        const animateElements = document.querySelectorAll(
            '.skill-card, .timeline-content, .project-card, .contact-item'
        );
        
        animateElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * CONFIG.animationDelays.fadeIn}s`;
            this.observer.observe(element);
        });
    }

    initializeTypingAnimation() {
        const heroTitle = document.querySelector('.hero h2');
        // const heroSubtitle = document.querySelector('.hero h1');
        
        if (heroTitle ) {
            const originalTitle = heroTitle.textContent;
            // const originalSubtitle = heroSubtitle.textContent;
            
            heroTitle.textContent = '';
            // heroSubtitle.textContent = '';
            
            this.typeWriter(heroTitle, originalTitle, 0);
            setTimeout(() => {
                // this.typeWriter( originalSubtitle, 0);
            }, originalTitle.length * CONFIG.typingSpeed);
        }
    }

    typeWriter(element, text, index) {
        if (index < text.length) {
            element.textContent = text.substring(0, index + 1);
            setTimeout(() => {
                this.typeWriter(element, text, index + 1);
            }, CONFIG.typingSpeed);
        }
    }

    initializeParallax() {
        const parallaxHandler = utils.debounce((e) => {
            requestAnimationFrame(() => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;

                this.floatingIcons.forEach(icon => {
                    const speed = parseFloat(icon.getAttribute('data-speed')) || 1;
                    const x = (mouseX - 0.5) * speed * CONFIG.parallaxIntensity;
                    const y = (mouseY - 0.5) * speed * CONFIG.parallaxIntensity;
                    
                    icon.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                });
            });
        }, 10);

        document.addEventListener('mousemove', parallaxHandler, { passive: true });
    }

    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translate3d(0, -10px, 0) scale(1.02)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
    }

    addProjectInteraction(card) {
        const content = card.querySelector('.project-content');
        if (content) {
            const description = content.querySelector('p');
            const tags = card.querySelector('.project-tags');

            card.addEventListener('click', () => {
                if (description && tags) {
                    description.style.maxHeight = description.style.maxHeight ? null : '1000px';
                    tags.style.opacity = tags.style.opacity === '0' ? '1' : '0';
                }
            });
        }
    }

    initializeNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-links a');

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking nav links
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// Scroll functionality
class ScrollHandler {
    constructor() {
        this.scrollTopButton = this.createScrollTopButton();
        this.initializeScrollEvents();
    }

    createScrollTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.classList.add('scroll-top');
        document.body.appendChild(button);
        return button;
    }

    initializeScrollEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
        });

        window.addEventListener('scroll', utils.debounce(() => {
            this.toggleScrollTopButton();
        }, 100), { passive: true });

        this.scrollTopButton.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    handleAnchorClick(e) {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    toggleScrollTopButton() {
        const shouldShow = window.scrollY > CONFIG.scrollTopThreshold;
        this.scrollTopButton.style.display = shouldShow ? 'flex' : 'none';
        this.scrollTopButton.style.opacity = shouldShow ? '1' : '0';
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        new Navigation();
        new AnimationController();
        new ScrollHandler();
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Update footer year
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});




document.addEventListener('DOMContentLoaded', () => {
    // Handle copy functionality
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const tooltip = btn.querySelector('.tooltip');
                tooltip.textContent = 'Copied!';
                setTimeout(() => {
                    tooltip.textContent = 'Copy';
                }, 2000);
            });
        });
    });
});




// Gallery & Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('fullImage');
    const closeBtn = document.querySelector('.close');
    const downloadBtn = document.getElementById('downloadBtn');
    const caption = document.getElementById('imageCaption');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];
    
    // Initialize gallery with animations
    initGallery();
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter items
            galleryItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    // Add to filtered items array
                    if (!filteredItems.includes(item)) {
                        filteredItems.push(item);
                    }
                } else {
                    item.style.display = 'none';
                    // Remove from filtered items array
                    const index = filteredItems.indexOf(item);
                    if (index > -1) {
                        filteredItems.splice(index, 1);
                    }
                }
            });
            
            // Apply animation to visible items
            const visibleItems = document.querySelectorAll('.gallery-item[style="display: block"]');
            animateItems(visibleItems);
        });
    });
    
    // Open modal when clicking on gallery items
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        
        viewBtn.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h3').textContent;
            const desc = item.querySelector('p').textContent;
            
            modalImg.src = img.src;
            downloadBtn.href = img.src;
            caption.textContent = `${title} - ${desc}`;
            currentIndex = filteredItems.indexOf(item);
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Apply modal entrance animation
            modal.style.display = 'flex';
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        updateModal(currentIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % filteredItems.length;
        updateModal(currentIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
            updateModal(currentIndex);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % filteredItems.length;
            updateModal(currentIndex);
        }
    });
    
    // Functions
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }, 300);
    }
    
    function updateModal(index) {
        const item = filteredItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const desc = item.querySelector('p').textContent;
        
        // Apply transition effect
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = img.src;
            downloadBtn.href = img.src;
            caption.textContent = `${title} - ${desc}`;
            modalImg.style.opacity = '1';
        }, 200);
    }
    
    function initGallery() {
        // Apply entrance animations to gallery items
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    function animateItems(items) {
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50 * index);
        });
    }
    
    // Load More Button (Simulated functionality)
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would typically load more images from a server
            // For demonstration, we'll show a loading state
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                loadMoreBtn.textContent = 'No More Items';
                loadMoreBtn.style.background = '#666';
                loadMoreBtn.style.cursor = 'not-allowed';
            }, 1500);
        });
    }
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});