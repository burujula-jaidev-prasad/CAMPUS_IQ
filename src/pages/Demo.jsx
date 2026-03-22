import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const ROOM_ICONS = {
  classroom: '🏫',
  lab: '💻',
  hall: '🏛️',
  conf: '🤝',
  study: '📚',
};

const TYPE_LABELS = {
  classroom: 'Classroom',
  lab: 'Computer Lab',
  hall: 'Seminar / Hall',
  conf: 'Conference Room',
  study: 'Study Room',
};

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

const Demo = () => {
  const { user } = useAuth();

  // Data
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI
  const [activeTab, setActiveTab] = useState('spaces'); // 'spaces' | 'history'
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Booking modal
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || '',
    date: new Date().toISOString().split('T')[0],
    start: '10:00 AM',
    end: '12:00 PM',
    purpose: '',
    purposeOther: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [clashError, setClashError] = useState('');

  /* ── Firestore listeners ── */
  useEffect(() => {
    const unsubSpaces = onSnapshot(collection(db, 'spaces'), (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const qBookings = query(
      collection(db, 'bookings'),
      where('userName', '==', user?.name || ''),
      orderBy('timestamp', 'desc')
    );
    const unsubBookings = onSnapshot(qBookings, (snap) => {
      setMyBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubSpaces();
      unsubBookings();
    };
  }, [user]);

  /* ── Filtered rooms ── */
  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.id?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  /* ── Booking submit ── */
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setClashError('');

    const finalPurpose =
      bookingForm.purpose === 'Other' ? bookingForm.purposeOther : bookingForm.purpose;
    if (!finalPurpose) {
      setClashError('Please select or enter a purpose.');
      return;
    }

    setIsSubmitting(true);
    const bookingTime = `${bookingForm.start} – ${bookingForm.end}`;
    const bookingDate =
      bookingForm.date === new Date().toISOString().split('T')[0]
        ? 'Today'
        : bookingForm.date;

    try {
      const clashQ = query(
        collection(db, 'bookings'),
        where('roomId', '==', selectedRoom.id),
        where('date', '==', bookingDate),
        where('time', '==', bookingTime),
        where('status', 'in', ['pending', 'approved'])
      );
      const snap = await getDocs(clashQ);

      if (!snap.empty) {
        setClashError(
          '⚠️ Slot is already booked. Sorry, please choose a different time.'
        );
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        userName: bookingForm.name,
        date: bookingDate,
        time: bookingTime,
        purpose: finalPurpose,
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      setShowSuccess({ room: selectedRoom.name, time: bookingTime });
      setSelectedRoom(null);
      setActiveTab('history');
    } catch (err) {
      setClashError('Failed to submit booking. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Stats ── */
  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const occupancyPct =
    rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  /* ─────────────────────────────────────────────────── */
  return (
    <Layout>
      {/* ── HERO STATS BAR ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '24px 0',
          borderBottom: '1px solid #334155',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                🎓 Christ University
              </span>
              <span
                style={{
                  background: '#10B981',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: '999px',
                }}
              >
                ● LIVE
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              Bangalore Main Campus ·{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { label: 'Available', value: availableCount, color: '#10B981' },
              { label: 'Occupied', value: occupiedCount, color: '#EF4444' },
              { label: 'Occupancy', value: `${occupancyPct}%`, color: '#F59E0B' },
              { label: 'My Bookings', value: myBookings.length, color: '#60A5FA' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        {/* TABS */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '28px',
            background: '#F1F5F9',
            borderRadius: '12px',
            padding: '4px',
            width: 'fit-content',
          }}
        >
          {[
            { key: 'spaces', label: '🏫 Browse Spaces' },
            { key: 'history', label: `📋 My Bookings (${myBookings.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 20px',
                borderRadius: '9px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? 'var(--dark)' : '#64748B',
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── SPACES TAB ── */}
        {activeTab === 'spaces' && (
          <>
            {/* Search & Filters */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '24px',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 240px' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                    fontSize: '1rem',
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search rooms by name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: 'white',
                  }}
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Types</option>
                <option value="classroom">Classroom</option>
                <option value="lab">Computer Lab</option>
                <option value="hall">Seminar Hall</option>
                <option value="conf">Conference Room</option>
                <option value="study">Study Room</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>

              <span style={{ fontSize: '0.85rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                {loading ? 'Loading…' : `${filteredRooms.length} space${filteredRooms.length !== 1 ? 's' : ''} found`}
              </span>
            </div>

            {/* Room Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredRooms.map((r) => {
                const isAvail = r.status === 'available';
                const utilColor =
                  r.util > 80 ? '#EF4444' : r.util > 50 ? '#F59E0B' : '#10B981';

                return (
                  <div
                    key={r.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      border: isAvail
                        ? '1.5px solid #D1FAE5'
                        : '1.5px solid #FEE2E2',
                      overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                    }}
                  >
                    {/* Card Header */}
                    <div
                      style={{
                        padding: '20px 20px 16px',
                        background: isAvail
                          ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
                          : 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
                        borderBottom: '1px solid',
                        borderColor: isAvail ? '#BBF7D0' : '#FECDD3',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '12px',
                              background: isAvail ? '#10B981' : '#EF4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.3rem',
                              flexShrink: 0,
                            }}
                          >
                            {ROOM_ICONS[r.type] || '🏫'}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#64748B',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {r.id}
                            </div>
                            <div
                              style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: '#0F172A',
                                marginTop: '2px',
                              }}
                            >
                              {r.name}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: isAvail ? '#10B981' : '#EF4444',
                            color: 'white',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isAvail ? '● Available' : '● Occupied'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '16px 20px', flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '14px',
                          fontSize: '0.82rem',
                          color: '#64748B',
                        }}
                      >
                        <span>🏷️ {TYPE_LABELS[r.type] || r.type}</span>
                        <span>👥 {r.capacity} seats</span>
                        <span>🗓️ Block {r.block} · F{r.floor}</span>
                      </div>

                      {/* Utilization bar */}
                      <div style={{ marginBottom: '16px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                            Utilization
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: utilColor,
                            }}
                          >
                            {r.util || 0}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: '6px',
                            background: '#F1F5F9',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${r.util || 0}%`,
                              background: utilColor,
                              borderRadius: '999px',
                              transition: 'width 0.5s',
                            }}
                          />
                        </div>
                      </div>

                      {/* Time slots */}
                      {(r.slots?.length > 0 || r.slotBusy?.length > 0) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                          {r.slots?.map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '5px',
                                background: '#D1FAE5',
                                color: '#065F46',
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          {r.slotBusy?.map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '5px',
                                background: '#FEE2E2',
                                color: '#991B1B',
                                textDecoration: 'line-through',
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div
                      style={{
                        padding: '12px 20px',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        {r.building?.charAt(0).toUpperCase() + r.building?.slice(1)} Block
                      </span>
                      {isAvail ? (
                        <button
                          onClick={() => {
                            setSelectedRoom(r);
                            setClashError('');
                            setBookingForm((f) => ({ ...f, name: user?.name || '' }));
                          }}
                          style={{
                            background: '#2563EB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 18px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.target.style.background = '#1D4ED8')}
                          onMouseLeave={(e) => (e.target.style.background = '#2563EB')}
                        >
                          Book Now →
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: '#EF4444',
                            fontWeight: 600,
                          }}
                        >
                          Currently Occupied
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {!loading && filteredRooms.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px',
                    color: '#94A3B8',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>😕</div>
                  <h3 style={{ marginBottom: '8px' }}>No spaces found</h3>
                  <p>Try changing your search or filters</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setTypeFilter('all');
                      setStatusFilter('all');
                    }}
                    style={{
                      marginTop: '16px',
                      padding: '8px 20px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── BOOKINGS HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div>
            {myBookings.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📋</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--dark)' }}>
                  No bookings yet
                </h3>
                <p style={{ color: '#64748B', marginBottom: '24px' }}>
                  Your booking history will appear here after you book a space.
                </p>
                <button
                  onClick={() => setActiveTab('spaces')}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Browse Spaces →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {myBookings.map((b) => {
                  const statusColors = {
                    pending: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
                    approved: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
                    rejected: { bg: '#FEE2E2', color: '#991B1B', border: '#FECDD3' },
                  };
                  const sc = statusColors[b.status] || statusColors.pending;

                  return (
                    <div
                      key={b.id}
                      style={{
                        background: 'white',
                        borderRadius: '14px',
                        border: '1.5px solid var(--border)',
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#EFF6FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.4rem',
                            flexShrink: 0,
                          }}
                        >
                          🏫
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '1rem',
                              color: '#0F172A',
                              marginBottom: '4px',
                            }}
                          >
                            {b.roomName}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <span>📅 {b.date}</span>
                            <span>🕐 {b.time}</span>
                            <span>📌 {b.purpose}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          padding: '6px 14px',
                          borderRadius: '999px',
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {b.status === 'pending' && '⏳ Pending'}
                        {b.status === 'approved' && '✅ Approved'}
                        {b.status === 'rejected' && '❌ Rejected'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOOKING MODAL ── */}
      {selectedRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRoom(null);
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 24px 20px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {ROOM_ICONS[selectedRoom.type] || '🏫'}
                </div>
                <div>
                  <h3
                    style={{ color: '#0F172A', fontWeight: 700, marginBottom: '2px', fontSize: '1.1rem' }}
                  >
                    {selectedRoom.name}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Block {selectedRoom.block} · Floor {selectedRoom.floor} · {selectedRoom.capacity} seats
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#F1F5F9',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleBookingSubmit} style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                {[
                  { label: 'STATUS', value: 'Available', color: '#10B981' },
                  { label: 'CAPACITY', value: `${selectedRoom.capacity} seats`, color: '#0F172A' },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#94A3B8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Date */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Time */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {['start', 'end'].map((field) => (
                  <div key={field}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '6px',
                      }}
                    >
                      {field === 'start' ? 'Start Time' : 'End Time'}
                    </label>
                    <select
                      value={bookingForm[field]}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, [field]: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        background: 'white',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Purpose */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Purpose
                </label>
                <select
                  value={bookingForm.purpose}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, purpose: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    background: 'white',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">— Select a purpose —</option>
                  <option>Guest Lecture</option>
                  <option>Team Meeting</option>
                  <option>Lab Session</option>
                  <option>Seminar / Workshop</option>
                  <option>Exam / Test</option>
                  <option>Group Study</option>
                  <option>Project Presentation</option>
                  <option>Club Activity</option>
                  <option>Other</option>
                </select>
                {bookingForm.purpose === 'Other' && (
                  <input
                    type="text"
                    placeholder="Describe your purpose…"
                    value={bookingForm.purposeOther}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, purposeOther: e.target.value })
                    }
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '10px 14px',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>

              {/* Clash Error */}
              {clashError && (
                <div
                  style={{
                    background: '#FEF2F2',
                    color: '#B91C1C',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #FECDD3',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    fontWeight: 500,
                  }}
                >
                  {clashError}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? '⏳ Submitting…' : '✅ Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  style={{
                    padding: '12px 20px',
                    background: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SUCCESS TOAST ── */}
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.5)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px 32px',
              textAlign: 'center',
              maxWidth: '360px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Booking Submitted!
            </h3>
            <p style={{ color: '#64748B', marginBottom: '8px' }}>
              <strong>{showSuccess.room}</strong>
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '24px' }}>
              Time: {showSuccess.time} · Awaiting admin approval
            </p>
            <button
              onClick={() => setShowSuccess(null)}
              style={{
                width: '100%',
                background: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
      {/* ── TANIA CHATBOT IS NOW IN LAYOUT ── */}
    </Layout>
  );
};

export default Demo;
