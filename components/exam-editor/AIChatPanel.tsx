import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { AIChat } from './AIChat';
import { ChatMessage } from './types';

interface AIChatPanelProps {
  isChatOpen: boolean;
  isChatMinimized: boolean;
  chatMessages: ChatMessage[];
  newMessage: string;
  isTyping: boolean;
  onToggleChat: () => void;
  onMinimizeChat: () => void;
  onCloseChat: () => void;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  isChatOpen,
  isChatMinimized,
  chatMessages,
  newMessage,
  isTyping,
  onToggleChat,
  onMinimizeChat,
  onCloseChat,
  onNewMessageChange,
  onSendMessage,
}) => {
  return (
    <motion.div
      className={cn(
        " duration-300",
        isChatOpen && !isChatMinimized 
          ? "lg:col-span-1" 
          : "hidden"
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="sticky top-8">
        <AIChat
          isOpen={isChatOpen}
          isMinimized={isChatMinimized}
          messages={chatMessages}
          newMessage={newMessage}
          isTyping={isTyping}
          onToggle={onToggleChat}
          onMinimize={onMinimizeChat}
          onClose={onCloseChat}
          onNewMessageChange={onNewMessageChange}
          onSendMessage={onSendMessage}
        />
      </div>
    </motion.div>
  );
}; 