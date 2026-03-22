import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ALL_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

// === Conversation Flow ===
// Step 0: Greet
// Step 1: Ask capacity
// Step 2: Suggest rooms
// Step 3: Ask which room they want slot info for
// Step 4: Show available slots

const Chatbot = ({ rooms }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [suggestedRooms, setSuggestedRooms] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);

  const userName = user?.name || 'Friend';

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setHasUnread(false);
      greetUser();
    }
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const addBot = (text, delay = 0, opts = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { from: 'bot', text, chips: opts.chips || null, id: Date.now() + Math.random() },
          ]);
          resolve();
        }, 800);
      }, delay);
    });
  };

  const addUser = (text) => {
    setMessages((prev) => [...prev, { from: 'user', text, id: Date.now() }]);
  };

  const greetUser = async () => {
    await addBot(`🙏 Namaste, **${userName}**! I'm **Tanya**, your Campus IQ assistant.`, 0);
    await addBot('I can help you find the perfect room based on your needs! 🏫', 600);
    await addBot('How many people will be attending? Please enter the required seating capacity 👇', 1000);
    setStep(1);
  };

  const handleCapacityInput = async (cap) => {
    const num = parseInt(cap);
    if (isNaN(num) || num < 1) {
      await addBot("Hmm, I didn't catch that. Please enter a valid number like **20** or **80**.");
      return;
    }

    const matched = (rooms || [])
      .filter((r) => r.capacity >= num && r.status === 'available')
      .sort((a, b) => a.capacity - b.capacity)
      .slice(0, 5);

    setSuggestedRooms(matched);

    if (matched.length === 0) {
      await addBot(`😔 Sorry, no available rooms found for **${num}+ seats** right now.`);
      await addBot('Would you like me to search for a different capacity?', 400, {
        chips: ['Try again', 'Show all rooms'],
      });
      setStep(1);
      return;
    }

    await addBot(`✅ Great! I found **${matched.length}** available room${matched.length > 1 ? 's' : ''} for **${num}+ seats**:`);

    const roomList = matched
      .map(
        (r, i) =>
          `**${i + 1}. ${r.name}** — ${r.capacity} seats · Block ${r.block} · Floor ${r.floor}`
      )
      .join('\n');

    await addBot(roomList, 400);
    await addBot(
      'Which room would you like to check available time slots for? Tap or type the name 👇',
      600,
      { chips: matched.map((r) => r.name) }
    );
    setStep(2);
  };

  const handleRoomSelection = async (roomName) => {
    const room = suggestedRooms.find(
      (r) => r.name.toLowerCase() === roomName.toLowerCase()
    ) || suggestedRooms.find((r) => r.name.toLowerCase().includes(roomName.toLowerCase()));

    if (!room) {
      await addBot("I couldn't find that room. Please tap one of the options above 👆");
      return;
    }

    await addBot(`🔍 Checking available slots for **${room.name}**...`);

    try {
      const today = new Date().toISOString().split('T')[0];
      const snap = await getDocs(
        query(
          collection(db, 'bookings'),
          where('roomId', '==', room.id),
          where('date', 'in', ['Today', today]),
          where('status', 'in', ['pending', 'approved'])
        )
      );

      const bookedSlots = new Set();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data.time) {
          const [start] = data.time.split(' – ');
          if (start) bookedSlots.add(start.trim());
        }
      });

      const availableSlots = ALL_SLOTS.filter((s) => !bookedSlots.has(s));
      const busySlots = ALL_SLOTS.filter((s) => bookedSlots.has(s));

      if (availableSlots.length === 0) {
        await addBot(`😔 All slots for **${room.name}** are booked today.`, 400);
      } else {
        await addBot(
          `✅ **${availableSlots.length} slots available** today for **${room.name}**:\n` +
            availableSlots.map((s) => `🟢 ${s}`).join('\n'),
          400
        );

        if (busySlots.length > 0) {
          await addBot(
            `🔴 Already booked: ${busySlots.join(', ')}`,
            600
          );
        }
      }

      await addBot('Would you like to search again or check another room?', 800, {
        chips: ['Search by capacity', 'Check another room', ...suggestedRooms.filter((r) => r.name !== room.name).map((r) => r.name)],
      });
      setStep(3);
    } catch (err) {
      await addBot('⚠️ Failed to fetch slot data. Please try again.');
      console.error(err);
    }
  };

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    addUser(msg);

    const lower = msg.toLowerCase();

    if (step === 1 || lower.includes('try again') || lower === 'search by capacity') {
      await handleCapacityInput(msg.replace(/[^0-9]/g, '') || msg);
    } else if (step === 2) {
      await handleRoomSelection(msg);
    } else if (step === 3) {
      if (lower === 'search by capacity') {
        await addBot('Sure! How many seats do you need?');
        setStep(1);
      } else if (lower === 'check another room') {
        await addBot('Which room would you like to check?', 0, {
          chips: suggestedRooms.map((r) => r.name),
        });
        setStep(2);
      } else if (lower === 'show all rooms') {
        await addBot('Please enter your required seating capacity to start:');
        setStep(1);
      } else {
        await handleRoomSelection(msg);
      }
    } else {
      // fallback
      if (/\d+/.test(msg)) {
        await handleCapacityInput(msg.replace(/[^0-9]/g, ''));
      } else {
        await addBot("I'm here to help you find the perfect room! How many seats do you need?");
        setStep(1);
      }
    }
  };

  const handleChipClick = (chip) => {
    handleSend(chip);
  };

  const renderedText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '24px',
          zIndex: 2000,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          userSelect: 'none',
        }}
      >
        {/* Pulse ring */}
        {!isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(37,99,235,0.15)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Avatar circle — medium, face clearly visible */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'white',
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(37,99,235,0.45)',
            border: '3px solid #2563EB',
            position: 'relative',
            transition: 'transform 0.2s',
            transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}tania.png`}
            alt="Tanya"
            style={{
              width: '130%',
              height: '130%',
              objectFit: 'cover',
              marginLeft: '-15%',
              marginTop: '-5%',
            }}
          />
          {hasUnread && !isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                background: '#EF4444',
                borderRadius: '50%',
                border: '2px solid white',
              }}
            />
          )}
        </div>

        {/* Label */}
        <div
          style={{
            background: '#0F172A',
            color: 'white',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '999px',
            letterSpacing: '0.3px',
          }}
        >
          {isOpen ? 'Close' : 'Tanya AI'}
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '110px',
            right: '28px',
            width: '360px',
            maxHeight: '520px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
            zIndex: 1999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'white',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid rgba(255,255,255,0.7)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}tania.png`}
                alt="Tanya"
                style={{
                  width: '130%',
                  height: '130%',
                  objectFit: 'cover',
                  marginLeft: '-15%',
                  marginTop: '-5%',
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>
                Tanya
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>
                Campus IQ AI Assistant • Online
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#F8FAFC',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
                      : 'white',
                    color: msg.from === 'user' ? 'white' : '#1E293B',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap',
                  }}
                  dangerouslySetInnerHTML={{ __html: renderedText(msg.text) }}
                />

                {/* Chips */}
                {msg.chips && msg.from === 'bot' && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      maxWidth: '95%',
                    }}
                  >
                    {msg.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '999px',
                          border: '1.5px solid #2563EB',
                          background: 'white',
                          color: '#2563EB',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#2563EB';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#2563EB';
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  background: 'white',
                  borderRadius: '16px 16px 16px 4px',
                  maxWidth: '70px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#94A3B8',
                      animation: `bounce 1.2s ease infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '8px',
              background: 'white',
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message…"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '999px',
                border: '1.5px solid #E2E8F0',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                outline: 'none',
                background: '#F8FAFC',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            />
            <button
              onClick={() => handleSend()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
