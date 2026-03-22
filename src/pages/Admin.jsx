import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePane, setActivePane] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(null); // { title, desc, action }
  const [toast, setToast] = useState('');

  // Firestore Listeners
  useEffect(() => {
    // Bookings Listener
    const qBookings = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(data);
    });

    // Spaces Listener
    const qSpaces = collection(db, 'spaces');
    const unsubSpaces = onSnapshot(qSpaces, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSpaces(data);
      setLoading(false);
    });

    return () => {
      unsubBookings();
      unsubSpaces();
    };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const approveBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: 'approved' });
      showToast('✅ Booking approved!');
    } catch (err) {
      showToast('❌ Failed to approve');
    }
  };

  const rejectBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: 'rejected' });
      showToast('❌ Booking rejected');
    } catch (err) {
      showToast('❌ Failed to reject');
    }
  };

  const deleteBooking = async (id) => {
    setShowConfirm({
      title: 'Delete Booking?',
      desc: 'Are you sure you want to permanently delete this record?',
      action: async () => {
        try {
          await deleteDoc(doc(db, 'bookings', id));
          showToast('🗑 Booking deleted');
        } catch (err) {
          showToast('❌ Deletion failed');
        }
        setShowConfirm(null);
      }
    });
  };

  const clearAllBookings = () => {
    setShowConfirm({
      title: 'Clear All Data?',
      desc: 'This will permanently wipe EVERY booking in the database. Proceed with caution!',
      action: async () => {
        try {
          const batch = writeBatch(db);
          bookings.forEach(b => batch.delete(doc(db, 'bookings', b.id)));
          await batch.commit();
          showToast('💥 All bookings cleared!');
        } catch (err) {
          showToast('❌ Failed to clear');
        }
        setShowConfirm(null);
      }
    });
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const alerts = bookings.map(b => ({
    id: b.id,
    type: 'info',
    icon: '📅',
    text: `<strong>${b.userName}</strong> made slot booking of <strong>${b.roomName}</strong> (${b.time})`,
    time: b.timestamp?.toDate ? b.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
  }));

  const renderDashboard = () => (
    <div className="admin-pane active">
      <div className="page-header">
        <h1>Good Morning, Admin 👋</h1>
        <p>Here's what's happening at Campus IQ today · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Current Occupancy</div>
          <div className="kpi-value">
            {spaces.length > 0 ? Math.round((spaces.filter(s => s.status === 'occupied').length / spaces.length) * 100) : 0}%
          </div>
          <div className="kpi-change">Active sessions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Rooms Available</div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>
            {spaces.filter(s => s.status === 'available').length}
          </div>
          <div className="kpi-change">Out of {spaces.length} total</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Bookings Today</div>
          <div className="kpi-value" style={{ color: 'var(--primary)' }}>
            {bookings.length}
          </div>
          <div className="kpi-change">Total requests</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending Reviews</div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>
            {pendingBookings.length}
          </div>
          <div className="kpi-change">Require action</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
        <div className="panel">
          <div className="panel-header"><h2>⏳ Pending Approvals</h2></div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead><tr><th>Room</th><th>Requested By</th><th>Time</th><th>Action</th></tr></thead>
              <tbody>
                {pendingBookings.slice(0, 5).map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.roomName}</td>
                    <td>{b.userName}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{b.time}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button className="action-btn approve" onClick={() => approveBooking(b.id)}><span>✓</span> Approve</button>
                      <button className="action-btn reject" onClick={() => rejectBooking(b.id)}><span>✕</span> Reject</button>
                    </td>
                  </tr>
                ))}
                {pendingBookings.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No pending approvals</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>🕐 Recent Activity</h2></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.slice(0, 5).map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#3B82F620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', color: 'var(--dark)', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: a.text }}></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{a.time}</div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingsTable = () => (
    <div className="admin-pane active">
      <div className="page-header">
        <h1>Booking Management</h1>
        <p>Review and manage all space booking requests</p>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', background: 'white', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <button className="btn btn-primary btn-sm">⬇ Export CSV</button>
        <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={clearAllBookings}>🗑 Clear All</button>
      </div>
      <div className="panel">
        <div className="panel-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Room</th><th>Requested By</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.roomName}</td>
                  <td>{b.userName}</td>
                  <td>{b.date}<div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.time}</div></td>
                  <td><span className={`pill ${b.status}`}>{b.status === 'approved' ? 'accepted' : b.status}</span></td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    {b.status === 'pending' && (
                      <>
                        <button className="action-btn approve" onClick={() => approveBooking(b.id)}><span>✓</span> Approve</button>
                        <button className="action-btn reject" onClick={() => rejectBooking(b.id)}><span>✕</span> Reject</button>
                      </>
                    )}
                    <button className="action-btn reject" onClick={() => deleteBooking(b.id)}><span>🗑</span> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlertsPane = () => (
    <div className="admin-pane active">
      <div className="page-header">
        <h1>System Alerts</h1>
        <p>Real-time notifications of student activities</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.map((a, i) => (
          <div key={i} className={`alert-row info`}>
            <span className="alert-icon">{a.icon}</span>
            <span className="alert-text" dangerouslySetInnerHTML={{ __html: a.text }}></span>
            <span className="alert-time">{a.time}</span>
          </div>
        ))}
        {alerts.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No alerts at the moment.</p>}
      </div>
    </div>
  );

  return (
    <div className="admin-wrap">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo" style={{ marginBottom: '24px', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="logo-icon" style={{ background: 'transparent', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={`${import.meta.env.BASE_URL}logo_brand.png`} alt="Campus IQ" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Every Space Matter</span>
          </div>
        </div>

        <div className="sidebar-section">Overview</div>
        <ul className="sidebar-nav">
          <li><a className={activePane === 'dashboard' ? 'active' : ''} onClick={() => setActivePane('dashboard')}><span className="nav-icon">📊</span> Dashboard</a></li>
          <li><a className={activePane === 'bookings' ? 'active' : ''} onClick={() => setActivePane('bookings')}><span className="nav-icon">📅</span> Bookings <span className="badge-count">{pendingBookings.length}</span></a></li>
        </ul>

        <div className="sidebar-section">System</div>
        <ul className="sidebar-nav">
          <li><a className={activePane === 'alerts' ? 'active' : ''} onClick={() => setActivePane('alerts')}><span className="nav-icon">🔔</span> Alerts <span className="badge-count">{alerts.length}</span></a></li>
          <li><a onClick={handleLogout}><span className="nav-icon">🚪</span> Logout</a></li>
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">A</div>
            <div className="user-info">
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-breadcrumb">
            <span>Campus IQ</span> &rsaquo; <strong>{activePane.charAt(0).toUpperCase() + activePane.slice(1)}</strong>
          </div>
          <div className="topbar-right">
            <span className="topbar-date">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="topbar-btn" title="Notifications" onClick={() => setActivePane('alerts')}>
              <span>🔔</span>
              {alerts.length > 0 && <div className="notif-dot"></div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px', padding: '4px 12px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>A</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)' }}>Admin</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {activePane === 'dashboard' && renderDashboard()}
          {activePane === 'bookings' && renderBookingsTable()}
          {activePane === 'alerts' && renderAlertsPane()}
          {(activePane !== 'dashboard' && activePane !== 'bookings' && activePane !== 'alerts') && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <h2>{activePane.charAt(0).toUpperCase() + activePane.slice(1)} module under migration...</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>This feature will be available in the next React build.</p>
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div id="toast" style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--dark)', color: 'white', padding: '14px 20px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 500, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', maxWidth: '320px' }}>
          <span>{toast}</span>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="modal-overlay active" style={{ zIndex: 10000 }}>
          <div className="modal" style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ marginBottom: '8px', color: 'var(--dark)' }}>{showConfirm.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>{showConfirm.desc}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setShowConfirm(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-primary" onClick={showConfirm.action} style={{ flex: 1, background: 'var(--danger)', borderColor: 'var(--danger)' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
