import { useState, useEffect } from 'react';
import { checkIntentStatus } from '../services/api';

const useIntentTracking = (sessionId, isEnabled = true) => {
  const [intentData, setIntentData] = useState({
    thresholdCrossed: false,
    intentType: null,
    confidence: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId || !isEnabled) return;

    const pollInterval = parseInt(import.meta.env.VITE_INTENT_POLL_INTERVAL) || 10000;
    let intervalId;

    const pollIntentStatus = async () => {
      try {
        const response = await checkIntentStatus(sessionId);
        
        setIntentData({
          thresholdCrossed: response.thresholdCrossed || false,
          intentType: response.intentType || null,
          confidence: response.confidence || 0,
        });
        
        setIsLoading(false);

        // Stop polling once threshold is crossed
        if (response.thresholdCrossed) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Failed to check intent status:', error);
        setIsLoading(false);
      }
    };

    // Initial check
    pollIntentStatus();

    // Poll every 10 seconds
    intervalId = setInterval(pollIntentStatus, pollInterval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, isEnabled]);

  return { ...intentData, isLoading };
};

export default useIntentTracking;