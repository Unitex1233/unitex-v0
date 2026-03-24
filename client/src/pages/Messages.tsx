import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { MessageSquare, Search, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Messages() {
    const [activeChatId, setActiveChatId] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([
        { id: 1, user: "Sarah Chen", userId: "sarah-jenkins", initials: "SC", lastMessage: "Hey! Did you see the new design system update?", time: "2m ago", unread: true, online: true },
        { id: 2, user: "Builders Club", userId: "builders-club", initials: "BC", lastMessage: "Alex: We're meeting at 6pm.", time: "1h ago", unread: false, isGroup: true, online: false },
        { id: 3, user: "Marcus R.", userId: "marcus-reed", initials: "MR", lastMessage: "The API docs are ready for review.", time: "3h ago", unread: false, online: true },
        { id: 4, user: "Design Team", userId: "design-team", initials: "DT", lastMessage: "New assets uploaded.", time: "1d ago", unread: false, isGroup: true, online: false },
    ]);

    const [messagesByChat, setMessagesByChat] = useState<Record<number, any[]>>({
        1: [
            { id: 1, sender: "them", text: "Hey! Did you see the new design system update?", time: "10:30 AM" },
            { id: 2, sender: "me", text: "Yeah, just checked it out. The new grid system is sick!", time: "10:32 AM" },
            { id: 3, sender: "them", text: "Right? I love how modular it feels now. Are we switching the dashboard to use it?", time: "10:33 AM" },
            { id: 4, sender: "me", text: "That's the plan. I'm going to start refactoring the main layout tomorrow.", time: "10:35 AM" },
            { id: 5, sender: "them", text: "Awesome. Let me know if you need help with the component migration.", time: "10:36 AM" },
        ],
        2: [{ id: 1, sender: "them", text: "Alex: We're meeting at 6pm. Don't be late!", time: "9:00 AM" }],
        3: [{ id: 1, sender: "them", text: "The API docs are ready for review.", time: "Yesterday" }],
        4: [{ id: 1, sender: "them", text: "New assets uploaded to the shared drive.", time: "2 days ago" }],
    });

    const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];
    const currentMessages = messagesByChat[activeChatId] || [];

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            sender: "me",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessagesByChat(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), msg]
        }));

        setConversations(prev => prev.map(c =>
            c.id === activeChatId ? { ...c, lastMessage: newMessage, time: "Just now", unread: false } : c
        ));

        setNewMessage('');
    };

    return (
        <div className="pt-8 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex gap-6 px-6">

            {/* Thread List */}
            <div className="w-[340px] flex flex-col h-full border border-[var(--color-surface)] bg-white shadow-sm overflow-hidden rounded-none">
                <div className="p-5 border-b border-[var(--color-surface)] bg-gray-50/50 rounded-none">
                    <h1 className="text-xl font-bold tracking-tight mb-4 text-[var(--color-text)]">Messages</h1>
                    <div className="relative group">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-white border border-[var(--color-surface)] py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[var(--color-accent)] transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar divide-y divide-[var(--color-surface)]/50">
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={cn(
                                "group relative p-5 cursor-pointer transition-all duration-200",
                                activeChatId === chat.id
                                    ? "bg-[var(--color-surface)]/30 border-r-2 border-[var(--color-accent)]"
                                    : "hover:bg-gray-50"
                            )}
                        >
                            <div className="flex gap-4 items-start">
                                <NavLink 
                                    to={chat.isGroup ? "/communities" : `/profile/${chat.userId}`}
                                    className="shrink-0 group/avatar"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="w-12 h-12 bg-[var(--color-surface)] flex items-center justify-center font-bold text-xs text-[var(--color-text)] rounded-none border border-[var(--color-surface)] group-hover/avatar:border-[var(--color-accent)] transition-all">
                                        {chat.initials}
                                    </div>
                                </NavLink>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <NavLink 
                                            to={chat.isGroup ? "/communities" : `/profile/${chat.userId}`}
                                            className={cn(
                                                "text-sm tracking-tight flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors",
                                                chat.unread ? "font-bold text-[var(--color-text)]" : "font-semibold text-gray-600"
                                            )}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {chat.user}
                                            {chat.online && <span className="w-1.5 h-1.5 bg-green-500 rounded-none shrink-0" />}
                                        </NavLink>
                                        <span className="text-[10px] text-gray-400 font-mono">{chat.time}</span>
                                    </div>
                                    <p className={cn(
                                        "text-xs truncate leading-relaxed",
                                        chat.unread ? "text-[var(--color-text)] font-medium" : "text-gray-400"
                                    )}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white border border-[var(--color-surface)] flex flex-col h-full relative shadow-sm overflow-hidden text-[var(--color-text)]">
                {/* Chat Header */}
                <div className="h-16 border-b border-[var(--color-surface)] flex items-center justify-between px-6 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <NavLink to={activeChat.isGroup ? "/communities" : `/profile/${activeChat.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-[var(--color-surface)] flex items-center justify-center font-bold text-xs text-[var(--color-text)] rounded-none">
                                {activeChat.initials}
                            </div>
                            <div>
                                <h2 className="font-bold text-base tracking-tight text-[var(--color-text)]">{activeChat.user}</h2>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-none",
                                        activeChat.online ? "bg-green-500" : "bg-gray-300"
                                    )}></span>
                                    <span className="text-[10px] font-medium text-gray-400">
                                        {activeChat.online ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <Phone size={18} className="hover:text-[var(--color-text)] cursor-pointer transition-colors" />
                        <Video size={18} className="hover:text-[var(--color-text)] cursor-pointer transition-colors" />
                        <div className="w-px h-4 bg-[var(--color-surface)]" />
                        <MoreVertical size={18} className="hover:text-[var(--color-text)] cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gray-50/30">
                    {currentMessages.map(msg => (
                        <div key={msg.id} className={cn(
                            "flex flex-col max-w-[70%]",
                            msg.sender === 'me' ? "ml-auto items-end" : "mr-auto items-start"
                        )}>
                            <div className={cn(
                                "p-4 text-sm leading-relaxed transition-all rounded-none",
                                msg.sender === 'me'
                                    ? "bg-[var(--color-text)] text-white shadow-sm"
                                    : "bg-white border border-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
                            )}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-wider">{msg.time}</span>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[var(--color-surface)] shrink-0 rounded-none">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-50 border border-[var(--color-surface)] p-3 text-sm focus:outline-none focus:border-[var(--color-accent)] focus:bg-white transition-all text-[var(--color-text)] rounded-none"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-6 bg-[var(--color-text)] text-white hover:bg-[var(--color-accent)] transition-all flex items-center justify-center font-bold text-xs uppercase tracking-widest h-12 rounded-none"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Messages;
