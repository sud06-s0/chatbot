import React, { useState, useEffect } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import BehaviorTracker from '../services/tracker';
import useIntentTracking from '../hooks/useIntentTracking';
import { getSessionId } from '../utils/helpers';
import { initSession, startChat, sendMessage } from '../services/api';
import { detectPageType } from '../utils/helpers';

const ChatWidget = () => {
  const [sessionId] = useState(getSessionId());
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [tracker, setTracker] = useState(null);

  // Hook: Track intent
  const { thresholdCrossed, intentType, confidence, isLoading } = useIntentTracking(
    sessionId,
    !isVisible // Only poll when widget is hidden
  );

  // Initialize session and tracker on mount
  useEffect(() => {
    const init = async () => {
      try {
        const pageType = detectPageType();
        await initSession(sessionId, pageType);
        
        // Start behavioral tracking
        const behaviorTracker = new BehaviorTracker(sessionId);
        behaviorTracker.start();
        setTracker(behaviorTracker);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      if (tracker) {
        tracker.stop();
      }
    };
  }, [sessionId]);

  // Show widget when threshold crossed
  useEffect(() => {
    if (thresholdCrossed && !isVisible) {
      setIsVisible(true);
      // Stop tracking once widget appears
      if (tracker) {
        tracker.stop();
      }
    }
  }, [thresholdCrossed, isVisible, tracker]);

  // Handle chat button click
  const handleOpenChat = async () => {
    if (!conversationId) {
      try {
        // Start conversation with backend
        const response = await startChat(sessionId, intentType);
        setConversationId(response.conversationId);
        setInitialMessage(response.initialMessage);
      } catch (error) {
        console.error('Failed to start chat:', error);
        setInitialMessage('How can I help you today?');
      }
    }
    setIsChatOpen(true);
  };

  // Handle close chat
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Handle send message
  const handleSendMessage = async (message, isButton) => {
    if (!conversationId) return null;

    try {
      const response = await sendMessage(conversationId, message, isButton);
      return {
        message: response.reply,
        buttons: response.buttons || null
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        message: 'Sorry, something went wrong. Please try again.',
        buttons: null
      };
    }
  };

  // Don't render anything if not visible yet
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {!isChatOpen && <ChatButton onClick={handleOpenChat} />}
      {isChatOpen && (
        <ChatWindow
          onClose={handleCloseChat}
          initialMessage={initialMessage}
          intentType={intentType}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
};

export default ChatWidget;