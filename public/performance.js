// Performance Optimization System
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            pageLoad: null,
            apiCalls: [],
            renderTimes: [],
            memoryUsage: [],
            userInteractions: []
        };
        
        this.optimizations = {
            lazyLoading: true,
            imageOptimization: true,
            apiCaching: true,
            domOptimization: true,
            resourceCompression: true
        };

        this.init();
    }

    init() {
        // Monitor page load performance
        this.monitorPageLoad();
        
        // Setup lazy loading
        this.setupLazyLoading();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup API caching
        this.setupAPICaching();
        
        // Optimize DOM operations
        this.optimizeDOM();
        
        // Monitor user interactions
        this.monitorUserInteractions();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    // Page load monitoring
    monitorPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics.pageLoad = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp: navigation.connectEnd - navigation.connectStart,
                ssl: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
                ttfb: navigation.responseStart - navigation.requestStart,
                download: navigation.responseEnd - navigation.responseStart,
                domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
                domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                total: navigation.loadEventEnd - navigation.fetchStart
            };

            this.logPerformance('Page Load', this.metrics.pageLoad);
            
            // Log slow page loads
            if (this.metrics.pageLoad.total > 3000) {
                window.errorHandler.handleWarning('Slow page load detected', this.metrics.pageLoad);
            }
        });
    }

    // Lazy loading setup
    setupLazyLoading() {
        if (!this.optimizations.lazyLoading) return;

        // Lazy load images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Lazy load sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    section.classList.add('visible');
                    sectionObserver.unobserve(section);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('section[data-lazy]').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Image optimization
    optimizeImages() {
        if (!this.optimizations.imageOptimization) return;

        // Add loading="lazy" to all images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });

        // Convert images to WebP if supported
        if (this.supportsWebP()) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                if (img.dataset.webp) {
                    img.src = img.dataset.webp;
                }
            });
        }

        // Add error handling for images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => {
                img.src = '/placeholder-image.jpg';
                img.classList.add('error');
            });
        });
    }

    // API caching setup
    setupAPICaching() {
        if (!this.optimizations.apiCaching) return;

        // Cache API responses
        const originalFetch = window.fetch;
        const cache = new Map();

        window.fetch = async (...args) => {
            const [url, options = {}] = args;
            const cacheKey = `${url}_${JSON.stringify(options)}`;
            const startTime = performance.now();

            // Check cache for GET requests
            if (options.method === 'GET' || !options.method) {
                const cached = cache.get(cacheKey);
                if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minutes
                    this.logPerformance('API Cache Hit', { url, duration: 0 });
                    return cached.response.clone();
                }
            }

            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const duration = endTime - startTime;

                // Cache successful GET responses
                if ((options.method === 'GET' || !options.method) && response.ok) {
                    cache.set(cacheKey, {
                        response: response.clone(),
                        timestamp: Date.now()
                    });
                }

                this.metrics.apiCalls.push({ url, duration, status: response.status });
                this.logPerformance('API Call', { url, duration, status: response.status });

                return response;
            } catch (error) {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                this.metrics.apiCalls.push({ url, duration, error: error.message });
                throw error;
            }
        };
    }

    // DOM optimization
    optimizeDOM() {
        if (!this.optimizations.domOptimization) return;

        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.logPerformance('Resize Handler', { timestamp: Date.now() });
            }, 250);
        });

        // Optimize scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.logPerformance('Scroll Handler', { timestamp: Date.now() });
            }, 100);
        }, { passive: true });

        // Batch DOM updates
        const originalQuerySelector = document.querySelector;
        const queryCache = new Map();

        document.querySelector = (selector) => {
            if (queryCache.has(selector)) {
                return queryCache.get(selector);
            }
            
            const element = originalQuerySelector.call(document, selector);
            queryCache.set(selector, element);
            
            // Clear cache periodically
            setTimeout(() => {
                queryCache.delete(selector);
            }, 5000);
            
            return element;
        };
    }

    // User interaction monitoring
    monitorUserInteractions() {
        const events = ['click', 'keydown', 'scroll', 'touchstart'];
        
        events.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                const interaction = {
                    type: eventType,
                    timestamp: Date.now(),
                    target: event.target.tagName,
                    pageX: event.pageX,
                    pageY: event.pageY
                };
                
                this.metrics.userInteractions.push(interaction);
                
                // Keep only last 100 interactions
                if (this.metrics.userInteractions.length > 100) {
                    this.metrics.userInteractions.shift();
                }
            }, { passive: true });
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage.push({
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                });
                
                // Keep only last 50 measurements
                if (this.metrics.memoryUsage.length > 50) {
                    this.metrics.memoryUsage.shift();
                }
                
                // Warn about high memory usage
                const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
                if (memoryUsage > 0.8) {
                    window.errorHandler.handleWarning('High memory usage detected', {
                        usage: `${(memoryUsage * 100).toFixed(1)}%`
                    });
                }
            }, 10000); // Every 10 seconds
        }

        // Monitor render times
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'measure') {
                    this.metrics.renderTimes.push({
                        name: entry.name,
                        duration: entry.duration,
                        timestamp: Date.now()
                    });
                    
                    // Keep only last 50 measurements
                    if (this.metrics.renderTimes.length > 50) {
                        this.metrics.renderTimes.shift();
                    }
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }

    // Utility methods
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    logPerformance(type, data) {
        console.log(`[Performance] ${type}:`, data);
        
        // Send to analytics in production
        if (window.location.hostname !== 'localhost') {
            this.sendToAnalytics(type, data);
        }
    }

    async sendToAnalytics(type, data) {
        try {
            await fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    data,
                    timestamp: Date.now(),
                    url: window.location.href,
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            // Fail silently for analytics
        }
    }

    // Performance optimization methods
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
    }

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Get performance metrics
    getMetrics() {
        return {
            pageLoad: this.metrics.pageLoad,
            apiCalls: {
                total: this.metrics.apiCalls.length,
                averageDuration: this.metrics.apiCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / this.metrics.apiCalls.length,
                slowestCall: Math.max(...this.metrics.apiCalls.map(call => call.duration || 0)),
                errorRate: this.metrics.apiCalls.filter(call => call.error).length / this.metrics.apiCalls.length
            },
            memoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1],
            userInteractions: {
                total: this.metrics.userInteractions.length,
                types: this.metrics.userInteractions.reduce((acc, interaction) => {
                    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
                    return acc;
                }, {})
            }
        };
    }

    // Optimize page performance
    optimizePage() {
        // Minimize reflows and repaints
        document.body.style.display = 'none';
        
        setTimeout(() => {
            // Apply optimizations
            this.optimizeImages();
            this.setupLazyLoading();
            
            // Show page
            document.body.style.display = '';
            
            this.logPerformance('Page Optimization', { timestamp: Date.now() });
        }, 0);
    }

    // Clean up resources
    cleanup() {
        // Clear caches
        if (this.optimizations.apiCaching) {
            // Clear API cache
        }
        
        // Remove event listeners
        // Clean up observers
    }
}

// Global performance optimizer instance
window.performanceOptimizer = new PerformanceOptimizer();

// Convenience functions
window.debounce = (func, wait) => performanceOptimizer.debounce(func, wait);
window.throttle = (func, limit) => performanceOptimizer.throttle(func, limit);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
