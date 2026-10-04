import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  ChevronDown,
  ShoppingBag,
  Sliders
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useUserProfile } from '../contexts/UserProfileContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
}

export const FashionChatbot: React.FC = () => {
  const { profile, hasProfile, openFitWizard } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm Inspira AI, your personal sizing & styling consultant. Tell me about your body shape, event, or ask any question about our garment fits and fabric drapes!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateStylistResponse = async (userPrompt: string): Promise<{ text: string; products?: string[] }> => {
    const lower = userPrompt.toLowerCase();

    // Sizing query
    if (lower.includes('size') || lower.includes('fit') || lower.includes('height') || lower.includes('weight')) {
      if (hasProfile) {
        return {
          text: `Based on your calibrated Supabase profile (${profile.height}cm, ${profile.weight}kg, ${profile.bodyShape} silhouette, ${profile.preferredFit} fit), you will get the cleanest drape with Size L for oversized streetwear pieces and Size M for tailored jackets. Our algorithm accounts for your ease allowance!`,
          products: ['inspira-tee-01', 'inspira-hoodie-02'],
        };
      } else {
        return {
          text: "I can give you centimeter-perfect size recommendations! Have you calibrated your measurements yet? Click the 'Smart Fit Wizard' to register your profile in Supabase so I can tailor every advice to your exact proportions.",
          products: ['inspira-tee-01'],
        };
      }
    }

    // Fabric query
    if (lower.includes('fabric') || lower.includes('cotton') || lower.includes('wool') || lower.includes('silk')) {
      return {
        text: "Our pieces are made from premium sustainable textiles: 280 GSM combed organic cotton for structured boxy tees, 450 GSM French Terry for heavyweight warmth, and 19 Momme pure Mulberry silk for effortless bias-cut drape.",
        products: ['inspira-tee-01', 'inspira-dress-06', 'inspira-knit-08'],
      };
    }

    // Streetwear / casual query
    if (lower.includes('streetwear') || lower.includes('oversized') || lower.includes('casual')) {
      return {
        text: "For a modern streetwear aesthetic, I recommend pairing the Architect Heavyweight Boxy Tee with the Parachute Kinetic Cargo Pant. Both feature engineered dropped shoulders and articulated knee darts.",
        products: ['inspira-tee-01', 'inspira-cargo-07'],
      };
    }

    // Default intelligent styling answer
    return {
      text: "Every garment in our collection is graded according to anatomical biometric curves. Feel free to ask about specific ease clearances, styling combinations, or how our sizing algorithm saves your fit analyses to Supabase!",
      products: ['inspira-hoodie-02', 'inspira-blazer-03'],
    };
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      // Simulate natural typing rhythm
      setTimeout(async () => {
        const response = await generateStylistResponse(userText);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: response.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedProductIds: response.products,
          },
        ]);
        setIsTyping(false);
      }, 750);
    } catch {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Open AI Fashion Stylist"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-40 w-[90vw] sm:w-[390px] h-[520px] max-h-[80vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Inspira Stylist</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">AI Size & Fashion Advisor</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-left bg-neutral-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="space-y-1.5 max-w-[82%]">
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none'
                        : 'bg-neutral-800 border border-neutral-700/80 text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* If suggested products attached */}
                  {msg.suggestedProductIds && (
                    <div className="space-y-1 pt-1">
                      {msg.suggestedProductIds.map((pid) => {
                        const prod = PRODUCTS.find((p) => p.id === pid);
                        if (!prod) return null;
                        return (
                          <div
                            key={pid}
                            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2 hover:border-indigo-500/50 transition-colors"
                          >
                            <img
                              src={prod.image_url}
                              alt={prod.name}
                              className="w-8 h-10 object-cover rounded bg-neutral-800 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white text-[11px] truncate">
                                {prod.name}
                              </div>
                              <div className="text-neutral-400 text-[10px]">
                                ${prod.price} • {prod.fit_type} fit
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-500 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Inspira is analyzing fit...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts bar */}
          <div className="px-3 py-1.5 bg-neutral-900 border-t border-neutral-800/80 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => {
                setInput('What size should I choose?');
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-750 text-neutral-300 shrink-0 whitespace-nowrap"
            >
              📏 Sizing help
            </button>
            <button
              onClick={() => {
                setInput('Tell me about your fabrics');
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-750 text-neutral-300 shrink-0 whitespace-nowrap"
            >
              🧵 Fabric care
            </button>
            <button
              onClick={() => {
                setInput('Recommend an oversized streetwear look');
              }}
              className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-750 text-neutral-300 shrink-0 whitespace-nowrap"
            >
              ✨ Streetwear look
            </button>
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about size, drape, fabric..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
