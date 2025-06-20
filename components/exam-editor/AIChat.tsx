import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Minimize2, Maximize2, X, Send, MessageCircle } from 'lucide-react';
import { ChatMessage } from './types';
import { cn } from '../../lib/utils';

interface AIChatProps {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  newMessage: string;
  isTyping: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  onClose: () => void;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  isOpen,
  isMinimized,
  messages,
  newMessage,
  isTyping,
  onToggle,
  onMinimize,
  onClose,
  onNewMessageChange,
  onSendMessage
}) => {
  if (!isOpen) {
    return (
      <AnimatePresence>
        <motion.button
          onClick={onToggle}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-purple-400 hover:scale-110 transition-all duration-300 shadow-lg z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageCircle className="w-6 h-6" />
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="lg:col-span-3 relative"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <div className="sticky top-8">
        <div className={cn(
          "bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300",
          isMinimized ? "h-16" : "h-[600px]"
        )}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-white/10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="w-4 h-4 text-purple-400" />
              </motion.div>
              <div>
                <h3 className="font-syne font-medium text-white">AI Assistant</h3>
                <p className="text-xs text-white/50 font-geist-mono">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={onMinimize}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </motion.button>
              <motion.button
                onClick={onClose}
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4 h-[480px] overflow-y-auto scrollbar-thin">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex",
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div className={cn(
                        "max-w-[80%] p-3 rounded-xl font-geist-mono text-sm",
                        message.type === 'user'
                          ? "bg-white text-black"
                          : "bg-white/10 text-white border border-white/10"
                      )}>
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 border border-white/10 p-3 rounded-xl">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-white/60 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-white/60 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-white/60 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder="Ask me anything about your exam..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono text-sm"
                  />
                  <motion.button
                    onClick={onSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-white text-black rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 