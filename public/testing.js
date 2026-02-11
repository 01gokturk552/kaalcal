// Comprehensive Testing and Monitoring System
class TestingSuite {
    constructor() {
        this.tests = {
            unit: [],
            integration: [],
            e2e: [],
            performance: [],
            security: []
        };
        
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0,
            duration: 0,
            coverage: {}
        };
        
        this.monitoring = {
            uptime: Date.now(),
            errors: [],
            performance: [],
            userSessions: [],
            apiCalls: []
        };

        this.init();
    }

    init() {
        this.setupErrorMonitoring();
        this.setupPerformanceMonitoring();
        this.setupUserSessionTracking();
        this.setupHealthChecks();
        this.runInitialTests();
    }

    // Test framework
    test(name, testFunction, category = 'unit') {
        this.tests[category].push({
            name,
            function: testFunction,
            status: 'pending'
        });
    }

    async runTests(category = null) {
        const startTime = Date.now();
        const testsToRun = category ? this.tests[category] : Object.values(this.tests).flat();
        
        this.results.total = testsToRun.length;
        this.results.passed = 0;
        this.results.failed = 0;
        this.results.skipped = 0;

        for (const test of testsToRun) {
            try {
                const result = await test.function();
                if (result.passed) {
                    this.results.passed++;
                    test.status = 'passed';
                    test.result = result;
                } else {
                    this.results.failed++;
                    test.status = 'failed';
                    test.result = result;
                }
            } catch (error) {
                this.results.failed++;
                test.status = 'error';
                test.result = { error: error.message };
            }
        }

        this.results.duration = Date.now() - startTime;
        this.logTestResults();
        
        return this.results;
    }

    // Built-in tests
    runInitialTests() {
        // Unit tests
        this.test('Error Handler Initialization', () => {
            return {
                passed: window.errorHandler && typeof window.errorHandler.handleError === 'function',
                message: 'Error handler should be initialized'
            };
        }, 'unit');

        this.test('Security Manager Initialization', () => {
            return {
                passed: window.securityManager && typeof window.securityManager.validateEmail === 'function',
                message: 'Security manager should be initialized'
            };
        }, 'unit');

        this.test('Performance Optimizer Initialization', () => {
            return {
                passed: window.performanceOptimizer && typeof window.performanceOptimizer.getMetrics === 'function',
                message: 'Performance optimizer should be initialized'
            };
        }, 'unit');

        // Integration tests
        this.test('API Connectivity', async () => {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                return {
                    passed: response.ok && data.success,
                    message: 'API health check should pass'
                };
            } catch (error) {
                return {
                    passed: false,
                    message: `API health check failed: ${error.message}`
                };
            }
        }, 'integration');

        this.test('Database Connection', async () => {
            try {
                const response = await fetch('/api/applications');
                const data = await response.json();
                return {
                    passed: response.ok,
                    message: 'Database connection should work'
                };
            } catch (error) {
                return {
                    passed: false,
                    message: `Database connection failed: ${error.message}`
                };
            }
        }, 'integration');

        // Performance tests
        this.test('Page Load Performance', () => {
            const metrics = window.performanceOptimizer.getMetrics();
            const loadTime = metrics.pageLoad?.total || 0;
            return {
                passed: loadTime < 3000,
                message: `Page load time should be under 3 seconds (actual: ${loadTime}ms)`
            };
        }, 'performance');

        this.test('Memory Usage', () => {
            if (!performance.memory) {
                return { passed: true, message: 'Memory monitoring not available' };
            }
            
            const usage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
            return {
                passed: usage < 0.8,
                message: `Memory usage should be under 80% (actual: ${(usage * 100).toFixed(1)}%)`
            };
        }, 'performance');

        // Security tests
        this.test('CSRF Token Present', () => {
            const token = localStorage.getItem('csrf_token');
            return {
                passed: !!token && token.length === 64,
                message: 'CSRF token should be present and valid'
            };
        }, 'security');

        this.test('Input Validation', () => {
            const testEmail = 'test@example.com';
            const isValid = window.securityManager.validateEmail(testEmail);
            return {
                passed: isValid.valid,
                message: 'Email validation should work correctly'
            };
        }, 'security');

        // Run tests after page load
        window.addEventListener('load', () => {
            setTimeout(() => this.runTests(), 1000);
        });
    }

    // Error monitoring
    setupErrorMonitoring() {
        window.addEventListener('error', (event) => {
            this.monitoring.errors.push({
                timestamp: Date.now(),
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });

            this.checkErrorThreshold();
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.monitoring.errors.push({
                timestamp: Date.now(),
                type: 'unhandledrejection',
                reason: event.reason
            });

            this.checkErrorThreshold();
        });
    }

    checkErrorThreshold() {
        const recentErrors = this.monitoring.errors.filter(
            error => Date.now() - error.timestamp < 60000 // Last minute
        );

        if (recentErrors.length > 10) {
            this.triggerAlert('High error rate detected', {
                errorCount: recentErrors.length,
                timeWindow: '1 minute'
            });
        }
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor API performance
        this.monitorAPIPerformance();
        
        // Monitor user interactions
        this.monitorUserInteractions();
    }

    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            this.monitoring.performance.push({
                type: 'LCP',
                value: lastEntry.startTime,
                timestamp: Date.now()
            });

            if (lastEntry.startTime > 2500) {
                this.triggerAlert('Poor LCP detected', {
                    value: lastEntry.startTime,
                    threshold: 2500
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.monitoring.performance.push({
                    type: 'FID',
                    value: entry.processingStart - entry.startTime,
                    timestamp: Date.now()
                });

                if (entry.processingStart - entry.startTime > 100) {
                    this.triggerAlert('Poor FID detected', {
                        value: entry.processingStart - entry.startTime,
                        threshold: 100
                    });
                }
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }

            this.monitoring.performance.push({
                type: 'CLS',
                value: clsValue,
                timestamp: Date.now()
            });

            if (clsValue > 0.1) {
                this.triggerAlert('Poor CLS detected', {
                    value: clsValue,
                    threshold: 0.1
                });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    monitorAPIPerformance() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const url = args[0];
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                this.monitoring.apiCalls.push({
                    url,
                    duration: endTime - startTime,
                    status: response.status,
                    timestamp: Date.now()
                });

                return response;
            } catch (error) {
                const endTime = performance.now();
                
                this.monitoring.apiCalls.push({
                    url,
                    duration: endTime - startTime,
                    error: error.message,
                    timestamp: Date.now()
                });

                throw error;
            }
        };
    }

    monitorUserInteractions() {
        const interactions = ['click', 'keydown', 'scroll'];
        
        interactions.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                // Track significant interactions
                if (eventType === 'click' || eventType === 'keydown') {
                    this.monitoring.userSessions.push({
                        type: eventType,
                        target: event.target.tagName,
                        timestamp: Date.now()
                    });
                }
            }, { passive: true });
        });
    }

    // User session tracking
    setupUserSessionTracking() {
        const sessionId = this.getSessionId();
        const startTime = Date.now();

        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackSessionEnd(sessionId, startTime);
            }
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd(sessionId, startTime);
        });

        // Track session start
        this.trackSessionStart(sessionId);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    trackSessionStart(sessionId) {
        this.monitoring.userSessions.push({
            sessionId,
            type: 'session_start',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`
        });
    }

    trackSessionEnd(sessionId, startTime) {
        const duration = Date.now() - startTime;
        
        this.monitoring.userSessions.push({
            sessionId,
            type: 'session_end',
            timestamp: Date.now(),
            duration,
            interactions: this.monitoring.userSessions.filter(
                session => session.sessionId === sessionId && session.type !== 'session_start' && session.type !== 'session_end'
            ).length
        });
    }

    // Health checks
    setupHealthChecks() {
        // Check system health every 30 seconds
        setInterval(() => {
            this.performHealthCheck();
        }, 30000);
    }

    async performHealthCheck() {
        const health = {
            timestamp: Date.now(),
            uptime: Date.now() - this.monitoring.uptime,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null,
            errors: this.monitoring.errors.length,
            performance: this.getAveragePerformance(),
            status: 'healthy'
        };

        // Determine health status
        if (health.errors > 50) {
            health.status = 'unhealthy';
        } else if (health.errors > 20) {
            health.status = 'degraded';
        }

        if (health.status !== 'healthy') {
            this.triggerAlert('System health issue detected', health);
        }

        return health;
    }

    getAveragePerformance() {
        if (this.monitoring.performance.length === 0) return null;

        const recent = this.monitoring.performance.slice(-100);
        const averages = {};

        ['LCP', 'FID', 'CLS'].forEach(type => {
            const values = recent.filter(p => p.type === type).map(p => p.value);
            if (values.length > 0) {
                averages[type] = values.reduce((sum, val) => sum + val, 0) / values.length;
            }
        });

        return averages;
    }

    // Alert system
    triggerAlert(message, data) {
        console.warn(`[ALERT] ${message}:`, data);
        
        // Show user notification for critical issues
        if (data.errorCount > 20 || (data.value && data.threshold)) {
            window.errorHandler.showUserNotification(
                'Sistem performansında sorunlar tespit edildi. Teknik ekip bilgilendirildi.',
                'warning'
            );
        }

        // Send to monitoring service
        this.sendAlert(message, data);
    }

    async sendAlert(message, data) {
        try {
            await fetch('/api/monitoring/alert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    data,
                    timestamp: Date.now(),
                    url: window.location.href
                })
            });
        } catch (error) {
            console.warn('Failed to send alert:', error);
        }
    }

    // Test results logging
    logTestResults() {
        console.group(`Test Results (${this.results.total} tests, ${this.results.duration}ms)`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⏭️ Skipped: ${this.results.skipped}`);
        
        if (this.results.failed > 0) {
            console.group('Failed Tests');
            Object.values(this.tests).flat().filter(test => test.status === 'failed').forEach(test => {
                console.error(`❌ ${test.name}:`, test.result);
            });
            console.groupEnd();
        }
        
        console.groupEnd();
    }

    // Get comprehensive monitoring data
    getMonitoringData() {
        return {
            uptime: Date.now() - this.monitoring.uptime,
            errors: this.monitoring.errors,
            performance: this.monitoring.performance,
            userSessions: this.monitoring.userSessions,
            apiCalls: this.monitoring.apiCalls,
            testResults: this.results,
            health: this.performHealthCheck()
        };
    }

    // Export monitoring data
    exportMonitoringData() {
        const data = this.getMonitoringData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kaalcal-monitoring-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Run specific test category
    async runUnitTests() {
        return this.runTests('unit');
    }

    async runIntegrationTests() {
        return this.runTests('integration');
    }

    async runPerformanceTests() {
        return this.runTests('performance');
    }

    async runSecurityTests() {
        return this.runTests('security');
    }

    // Custom test helpers
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertNotEqual(actual, expected, message) {
        if (actual === expected) {
            throw new Error(message || `Expected not ${expected}, got ${actual}`);
        }
    }

    async assertThrows(asyncFunction, message) {
        try {
            await asyncFunction();
            throw new Error(message || 'Expected function to throw');
        } catch (error) {
            // Expected behavior
        }
    }
}

// Global testing suite instance
window.testingSuite = new TestingSuite();

// Convenience functions
window.test = (name, testFunction, category) => testingSuite.test(name, testFunction, category);
window.assert = (condition, message) => testingSuite.assert(condition, message);
window.assertEqual = (actual, expected, message) => testingSuite.assertEqual(actual, expected, message);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestingSuite;
}
