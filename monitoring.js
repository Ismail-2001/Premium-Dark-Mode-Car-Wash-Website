// Error Monitoring & Performance Tracking
class SiteMonitoring {
    constructor() {
        this.init();
    }

    init() {
        this.setupErrorTracking();
        this.setupPerformanceMonitoring();
        this.setupUserAnalytics();
    }

    setupErrorTracking() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });
    }

    setupPerformanceMonitoring() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackPerformance('LCP', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach((entry) => {
                    this.trackPerformance('FID', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsScore = 0;
                entryList.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });
                this.trackPerformance('CLS', clsScore);
            }).observe({ entryTypes: ['layout-shift'] });
        }

        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.trackPerformance('page_load', {
                        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                        tcp: perfData.connectEnd - perfData.connectStart,
                        ssl: perfData.secureConnectionStart > 0 ? perfData.connectEnd - perfData.secureConnectionStart : 0,
                        ttfb: perfData.responseStart - perfData.requestStart,
                        download: perfData.responseEnd - perfData.responseStart,
                        dom_parse: perfData.domContentLoadedEventStart - perfData.responseEnd,
                        total: perfData.loadEventEnd - perfData.navigationStart
                    });
                }
            }, 0);
        });
    }

    setupUserAnalytics() {
        // Track page views
        this.trackEvent('page_view', {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });

        // Track button clicks
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (button) {
                this.trackEvent('button_click', {
                    text: button.textContent.trim(),
                    id: button.id,
                    class: button.className,
                    page: window.location.pathname
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.id === 'contactForm') {
                this.trackEvent('form_submit', {
                    form_id: form.id,
                    page: window.location.pathname
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', {
                        depth: maxScroll,
                        page: window.location.pathname
                    });
                }
            }
        });
    }

    logError(errorData) {
        console.error('Site Error:', errorData);
        
        // Send to error tracking service
        this.sendToEndpoint('/api/errors', errorData);
        
        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: errorData.message,
                fatal: false
            });
        }
    }

    trackPerformance(metric, value) {
        const perfData = {
            metric,
            value,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };

        console.log('Performance Metric:', perfData);
        
        // Send to performance monitoring
        this.sendToEndpoint('/api/performance', perfData);
        
        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: metric,
                value: typeof value === 'object' ? value.total : value
            });
        }
    }

    trackEvent(eventName, eventData) {
        const event = {
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        };

        console.log('Analytics Event:', event);
        
        // Send to analytics endpoint
        this.sendToEndpoint('/api/analytics', event);
        
        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }

    async sendToEndpoint(endpoint, data) {
        try {
            // In production, replace with your actual API endpoint
            // For now, we'll store in localStorage as fallback
            const existing = JSON.parse(localStorage.getItem('site_analytics') || '[]');
            existing.push(data);
            
            // Keep only last 100 entries to prevent storage bloat
            if (existing.length > 100) {
                existing.splice(0, existing.length - 100);
            }
            
            localStorage.setItem('site_analytics', JSON.stringify(existing));
            
            // Uncomment when you have a real backend:
            // await fetch(endpoint, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        } catch (error) {
            console.error('Failed to send monitoring data:', error);
        }
    }

    // Method to retrieve analytics data (for debugging)
    getAnalyticsData() {
        return JSON.parse(localStorage.getItem('site_analytics') || '[]');
    }
}

// Initialize monitoring
new SiteMonitoring();

// Add performance debugging info in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            const monitoring = new SiteMonitoring();
            console.table(monitoring.getAnalyticsData());
        }
    });
}
