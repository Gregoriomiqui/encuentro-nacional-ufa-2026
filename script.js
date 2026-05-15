/**
 * Retiro Nacional UFA - Main JavaScript
 * Professional and clean code following best practices
 */

// Strict mode for better error handling
'use strict';

// ===================================
// DOM Content Loaded Event
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeSmoothScroll();
    initializeScrollAnimations();
    initializeBackToTop();
    handleExternalLinks();
});

// ===================================
// Navigation Functions
// ===================================

/**
 * Initialize navigation functionality
 * Handles mobile menu toggle and active state
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    // Set active state based on current page
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if link matches current page
        if (href && (
            currentPath.endsWith(href) || 
            (currentPath.endsWith('/') && href === 'index.html')
        )) {
            link.classList.add('active');
        }
        
        // Add click event for smooth scroll on anchor links
        if (href && href.startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    scrollToElement(targetElement);
                }
            });
        }
    });
}

/**
 * Initialize smooth scrolling for all anchor links
 */
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                scrollToElement(targetElement);
            }
        });
    });
}

/**
 * Smooth scroll to a specific element
 * @param {HTMLElement} element - Target element to scroll to
 */
function scrollToElement(element) {
    const headerOffset = 80; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// ===================================
// Scroll Animations
// ===================================

/**
 * Initialize scroll-based animations using Intersection Observer
 */
function initializeScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.card, .legal-section, .hero-content, .inscription-content, .contact-info'
    );
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: make all elements visible immediately
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }
    
    // Set initial state for elements
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );
    
    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// Back to Top Button
// ===================================

/**
 * Initialize back-to-top button functionality
 */
function initializeBackToTop() {
    // Create back-to-top button
    const backToTopButton = createBackToTopButton();
    document.body.appendChild(backToTopButton);
    
    // Show/hide button based on scroll position
    let isVisible = false;
    
    window.addEventListener('scroll', () => {
        const shouldBeVisible = window.pageYOffset > 300;
        
        if (shouldBeVisible && !isVisible) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.pointerEvents = 'auto';
            isVisible = true;
        } else if (!shouldBeVisible && isVisible) {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.pointerEvents = 'none';
            isVisible = false;
        }
    });
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Create back-to-top button element
 * @returns {HTMLElement} Button element
 */
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Volver arriba');
    button.className = 'back-to-top';
    
    // Apply styles
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#d91c7a',
        color: '#ffffff',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '999'
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#a81560';
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#d91c7a';
        button.style.transform = 'scale(1)';
    });
    
    return button;
}

// ===================================
// External Links
// ===================================

/**
 * Handle external links - open in new tab with security
 */
function handleExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if link is external
        if (href && !href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// ===================================
// Form Validation (for future use)
// ===================================

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Chilean format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
function isValidPhone(phone) {
    const phoneRegex = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
    return phoneRegex.test(phone);
}

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Error Handling
// ===================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Error occurred:', event.error);
    // In production, you might want to send this to a logging service
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // In production, you might want to send this to a logging service
});

// ===================================
// Performance Optimization
// ===================================

/**
 * Lazy load images when they enter viewport
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ===================================
// Accessibility
// ===================================

/**
 * Add keyboard navigation support
 */
function enhanceKeyboardNavigation() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Trap focus in modal dialogs (if any)
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
        trapFocus(modal);
    });
}

/**
 * Trap focus within an element
 * @param {HTMLElement} element - Element to trap focus within
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        isValidPhone,
        debounce,
        throttle
    };
}
