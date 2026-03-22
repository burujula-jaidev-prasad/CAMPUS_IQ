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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Info,
  Sparkles,
  History,
  ArrowRight,
  Zap
} from 'lucide-react';

const ROOM_ICONS = {
  classroom: <Building2 className="text-white" />,
  lab: <Users className="text-white" />,
  hall: <MapPin className="text-white" />,
  conf: <Users className="text-white" />,
  study: <Clock className="text-white" />,
};

const ROOM_PHOTOS = {
  classroom: `${import.meta.env.BASE_URL}campus_classroom.jpg`,
  study: `${import.meta.env.BASE_URL}campus_study_lounge.jpg`,
  hall: `${import.meta.env.BASE_URL}seminar.jpeg`, // Updated with user's image
  lab: `${import.meta.env.BASE_URL}campus_lab.jpg`,
  conf: `${import.meta.env.BASE_URL}campus_conf.jpg`,
};

const TYPE_LABELS = {
  classroom: 'Classroom',
  lab: 'Computer Lab',
  hall: 'Seminar / Hall',
  conf: 'Conference Room',
  study: 'Study Room',
};

const Demo = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState(localStorage.getItem('campus_iq_guest_name') || 'Guest');
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('spaces');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || 'Guest',
    rollNumber: '',
    date: new Date().toISOString().split('T')[0],
    start: '10:00 AM',
    end: '12:00 PM',
    purpose: '',
    purposeOther: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);
  const [clashError, setClashError] = useState('');

  useEffect(() => {
    const unsubSpaces = onSnapshot(collection(db, 'spaces'), (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const qBookings = query(
      collection(db, 'bookings'),
      where('userName', '==', user?.name || guestName)
    );
    const unsubBookings = onSnapshot(qBookings, (snap) => {
      setMyBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubSpaces();
      unsubBookings();
    };
  }, [user, guestName]);

  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.id?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setClashError('');
    const finalPurpose = bookingForm.purpose === 'Other' ? bookingForm.purposeOther : bookingForm.purpose;
    if (!finalPurpose) {
      setClashError('Please select or enter a purpose.');
      return;
    }
    setIsSubmitting(true);
    const bookingTime = `${bookingForm.start} – ${bookingForm.end}`;
    const bookingDate = bookingForm.date === new Date().toISOString().split('T')[0] ? 'Today' : bookingForm.date;

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
        setClashError('⚠️ Slot is already booked. Sorry, please choose a different time.');
        setIsSubmitting(false);
        return;
      }
      const bookingData = {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        userName: bookingForm.name,
        rollNumber: bookingForm.rollNumber,
        date: bookingDate,
        time: bookingTime,
        purpose: finalPurpose,
        status: 'pending',
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, 'bookings'), bookingData);
      if (!user) {
        setGuestName(bookingForm.name);
        localStorage.setItem('campus_iq_guest_name', bookingForm.name);
      }
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

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const occupancyPct = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  return (
    <Layout>
      <div className="relative overflow-hidden" style={{ background: 'var(--grad-dark)', padding: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container relative z-10">
          <div className="flex justify-between items-center wrap gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-white text-3xl font-black mb-0">Christ University</h1>
                <span className="badge badge-green animate-pulse">● LIVE</span>
              </div>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <MapPin size={14} /> Lavasa Campus, Pune · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
            <div className="flex gap-8 md:gap-12">
              {[
                { label: 'Available', value: availableCount, color: '#10B981' },
                { label: 'Occupied', value: occupiedCount, color: '#EF4444' },
                { label: 'Occupancy', value: `${occupancyPct}%`, color: '#F59E0B' },
              ].map((stat, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={stat.label} className="text-center">
                  <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container py-12">
        <div className="flex gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit mb-12 border border-gray-200/50">
          {[
            { key: 'spaces', label: 'Browse Spaces', icon: <Building2 size={16} /> },
            { key: 'history', label: `My Bookings (${myBookings.length})`, icon: <History size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.key ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'spaces' ? (
            <motion.div key="spaces" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="flex wrap gap-4 mb-10 items-center">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search rooms, blocks, or IDs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-100 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium outline-none shadow-sm cursor-pointer">
                    <option value="all">All Types</option>
                    <option value="classroom">Classroom</option>
                    <option value="lab">Computer Lab</option>
                    <option value="hall">Seminar Hall</option>
                    <option value="conf">Conference Room</option>
                    <option value="study">Study Room</option>
                  </select>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium outline-none shadow-sm cursor-pointer">
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
                <div className="text-sm font-semibold text-gray-400 ml-auto bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  {loading ? 'Crunching data...' : `${filteredRooms.length} Spaces Found`}
                </div>
              </div>

              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredRooms.map((r, i) => {
                  const isAvail = r.status === 'available';
                  const utilColor = r.util > 80 ? '#EF4444' : r.util > 50 ? '#F59E0B' : '#10B981';
                  return (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-[32px]">
                      <div className="relative h-56 overflow-hidden">
                        <img src={ROOM_PHOTOS[r.type] || 'https://images.unsplash.com/photo-1497366216548-37526070297c'} alt={r.name} className="w-100 h-100 object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">{r.id}</div>
                              <h3 className="text-white text-xl font-bold mb-0">{r.name}</h3>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white backdrop-blur-md ${isAvail ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                              {isAvail ? '● Available' : '● Occupied'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex gap-6 mb-8 text-xs font-bold text-gray-400">
                          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><Users size={14} className="text-indigo-500" /> {r.capacity} Seats</span>
                          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg"><MapPin size={14} className="text-indigo-500" /> Block {r.building} · F{r.floor}</span>
                        </div>
                        <div className="mb-8">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Real-time Utilization</span>
                            <span className="text-xs font-bold" style={{ color: utilColor }}>{r.util || 0}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.util || 0}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-100 rounded-full" style={{ backgroundColor: utilColor }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                               {ROOM_ICONS[r.type] ? React.cloneElement(ROOM_ICONS[r.type], { size: 16, className: 'text-indigo-600' }) : <Building2 size={16} />}
                             </div>
                             <span className="text-xs font-bold text-gray-700">{TYPE_LABELS[r.type] || r.type}</span>
                          </div>
                          {isAvail ? (
                            <button onClick={() => { setSelectedRoom(r); setClashError(''); }} className="btn btn-primary py-2.5 px-6 text-xs flex items-center gap-2">Book Space <ChevronRight size={14} /></button>
                          ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"><Zap size={14} /> Next: 2:00 PM</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {myBookings.length === 0 ? (
                <div className="text-center py-24 glass rounded-[40px] border border-white/50 shadow-xl bg-white/50">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <History size={48} className="text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">No bookings yet</h3>
                  <p className="text-gray-500 mb-10 text-lg">Your journey to optimized space starts here.</p>
                  <button onClick={() => setActiveTab('spaces')} className="btn btn-primary px-10 py-4 rounded-2xl">Browse Spaces <ArrowRight size={18} className="ml-2 inline" /></button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {myBookings.map((b, i) => {
                    const statusColors = {
                      pending: { bg: '#FEF3C7', color: '#92400E', icon: <Clock size={16} /> },
                      approved: { bg: '#D1FAE5', color: '#065F46', icon: <CheckCircle2 size={16} /> },
                      rejected: { bg: '#FEE2E2', color: '#991B1B', icon: <XCircle size={16} /> },
                    };
                    const sc = statusColors[b.status] || statusColors.pending;
                    return (
                      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={b.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-lg flex items-center justify-between hover:shadow-xl transition-all">
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-600 shadow-inner">
                            <Building2 size={32} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl mb-2 text-gray-900">{b.roomName}</h4>
                            <div className="flex gap-6 text-sm text-gray-400 font-bold">
                              <span className="flex items-center gap-2"><Calendar size={16} className="text-indigo-400" /> {b.date}</span>
                              <span className="flex items-center gap-2"><Clock size={16} className="text-indigo-400" /> {b.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right hidden lg:block">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Purpose</div>
                            <div className="text-sm font-bold text-gray-700">{b.purpose}</div>
                          </div>
                          <div className="flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {sc.icon} {b.status}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedRoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden">
               <div className="relative h-40 overflow-hidden">
                  <img src={ROOM_PHOTOS[selectedRoom.type]} alt="" className="w-100 h-100 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                  <button onClick={() => setSelectedRoom(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all text-black"><XCircle size={24} /></button>
               </div>
               <div className="p-10 -mt-10 relative z-10">
                  <h2 className="text-3xl font-black mb-1">Book {selectedRoom.name}</h2>
                  <p className="text-gray-500 text-sm mb-8 font-bold uppercase tracking-widest flex items-center gap-2"><Info size={14} className="text-indigo-500" /> Christ University · Block {selectedRoom.building}</p>
                  
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Your Full Name</label>
                        <input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})} className="w-100 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Roll/Emp Number</label>
                        <input type="text" required value={bookingForm.rollNumber} onChange={(e) => setBookingForm({...bookingForm, rollNumber: e.target.value})} className="w-100 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400">Purpose of Booking</label>
                      <select required value={bookingForm.purpose} onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})} className="w-100 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold">
                        <option value="">Select Purpose</option>
                        <option value="Lecture">Lecture</option>
                        <option value="Exam">Exam</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {clashError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2"><XCircle size={16} /> {clashError}</div>}
                    
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setSelectedRoom(null)} className="flex-1 py-4 px-6 border border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                      <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 px-6 btn btn-primary rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting ? 'Confirming...' : <>Confirm Booking <Sparkles size={18} /></>}
                      </button>
                    </div>
                  </form>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Demo;
