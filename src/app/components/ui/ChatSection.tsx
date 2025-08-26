'use client';

import { useState } from 'react';

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Олександр_Крутий', message: 'Привіт всім! Готовий до гри! 🎮', time: '15:30', avatar: '👑' },
    { id: 2, user: 'Марія_Переможниця', message: 'Давайте зіграємо турнір!', time: '15:32', avatar: '🔥' },
    { id: 3, user: 'Іван_Стратег', message: 'Хто готовий до 4x4? 🧠', time: '15:35', avatar: '🧠' },
    { id: 4, user: 'Тетяна_Блискавка', message: 'Я в грі! ⚡', time: '15:37', avatar: '⚡' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: 'Олександр_Крутий', // Поточний користувач
        message: newMessage.trim(),
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        avatar: '👑'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок чату */}
      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <h3 className="font-semibold text-center">💬 Загальний чат</h3>
        <div className="text-xs text-center text-white/60 mt-1">
          Онлайн: 12 гравців
        </div>
      </div>

      {/* Повідомлення */}
      <div className="flex-1 bg-white/10 rounded-xl p-3 mb-4 overflow-y-auto max-h-64">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{msg.user}</span>
                  <span className="text-xs text-white/50">{msg.time}</span>
                </div>
                <div className="text-sm text-white/80 break-words">{msg.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Поле вводу */}
      <div className="bg-white/10 rounded-xl p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишіть повідомлення..."
            className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={200}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:cursor-not-allowed"
          >
            📤
          </button>
        </div>
        <div className="text-xs text-white/50 mt-1">
          {newMessage.length}/200
        </div>
      </div>
    </div>
  );
}
