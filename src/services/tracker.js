import { getScrollDepth, getTimeOnPage, detectPageType, formatTimestamp } from '../utils/helpers';
import { sendSignal } from './api';

class BehaviorTracker {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.startTime = Date.now();
    this.lastScrollDepth = 0;
    this.trackingInterval = null;
    this.pageType = detectPageType();
    this.isTracking = false;
  }

  // Start tracking
  start() {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.setupListeners();
    this.startPeriodicTracking();
  }

  // Stop tracking
  stop() {
    this.isTracking = false;
    this.removeListeners();
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }
  }

  // Setup event listeners
  setupListeners() {
    this.handleScroll = this.onScroll.bind(this);
    this.handleClick = this.onClick.bind(this);
    
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('click', this.handleClick, true);
  }

  // Remove event listeners
  removeListeners() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleClick, true);
  }

  // Periodic tracking (every 5 seconds)
  startPeriodicTracking() {
    const interval = parseInt(import.meta.env.VITE_TRACKING_INTERVAL) || 5000;
    
    this.trackingInterval = setInterval(() => {
      this.trackTimeOnPage();
      this.trackScrollDepth();
    }, interval);
  }

  // Track scroll depth
  async trackScrollDepth() {
    const currentDepth = getScrollDepth();
    
    // Only send if scroll depth increased by 10% or more
    if (currentDepth >= this.lastScrollDepth + 10) {
      this.lastScrollDepth = currentDepth;
      
      try {
        await sendSignal(this.sessionId, 'scroll', {
          depth: currentDepth,
        }, this.pageType);
      } catch (error) {
        console.error('Failed to track scroll:', error);
      }
    }
  }

  // Track time on page
  async trackTimeOnPage() {
    const timeSpent = getTimeOnPage(this.startTime);
    
    try {
      await sendSignal(this.sessionId, 'time_on_page', {
        seconds: timeSpent,
      }, this.pageType);
    } catch (error) {
      console.error('Failed to track time:', error);
    }
  }

  // Handle scroll events
  onScroll() {
    // Debounced in periodic tracking
  }

  // Handle click events
  async onClick(event) {
    const target = event.target;
    
    // Track clicks on buttons, links, CTAs
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.classList.contains('cta') ||
      target.closest('button') ||
      target.closest('a')
    ) {
      const elementInfo = {
        tag: target.tagName,
        text: target.innerText?.slice(0, 50) || '',
        href: target.href || '',
        class: target.className || '',
      };

      try {
        await sendSignal(this.sessionId, 'click', elementInfo, this.pageType);
      } catch (error) {
        console.error('Failed to track click:', error);
      }
    }
  }
}

export default BehaviorTracker;