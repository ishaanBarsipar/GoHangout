// =================================================================
// FILE: src/pages/Pages.jsx
// ACTION: Overwrite existing file
// =================================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, EventCard, CreateEventModal } from '../components/Components.jsx';
import { getEvents, createEvent } from '../services/eventService.js';
import { useGeoLocation } from '../hooks/useGeoLocation.js';
import { MapPin, Loader, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast'; // NEW: Better alerts

// --- HOME PAGE ---
export const Home = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { location: userLocation } = useGeoLocation();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (userLocation.loaded && userLocation.coordinates.lat) {
        const data = await getEvents(userLocation.coordinates.lat, userLocation.coordinates.lng);
        setEvents(data);
      } else {
        const data = await getEvents();
        setEvents(data);
      }
    } catch (err) {
      toast.error("Could not load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [userLocation.loaded]);

  const handleCreateEvent = async (eventData) => {
    const loadingToast = toast.loading("Creating event...");
    try {
      const payload = {
        ...eventData,
        latitude: userLocation.coordinates.lat || 0.0,
        longitude: userLocation.coordinates.lng || 0.0
      };
      await createEvent(payload);
      setIsModalOpen(false);
      fetchEvents(); 
      toast.success("Event published successfully!", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to create event", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans selection:bg-indigo-100">
      <Navbar onOpenCreate={() => setIsModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="relative bg-gray-900 rounded-3xl p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-30 -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                    Find events that <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">move you.</span>
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-gray-300 text-sm font-medium">
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        {userLocation.loaded ? "Locating events near you..." : "Locating..."}
                    </span>
                    <span>•</span>
                    <span>{events.length} events found</span>
                </div>
            </div>
        </div>

        {/* Filters & Grid */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all">
                <Filter className="h-4 w-4" /> Filters
            </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1,2,3,4].map(i => (
                 <div key={i} className="bg-white h-80 rounded-2xl animate-pulse"></div>
             ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No events found. Be the first to host one!</p>
          </div>
        )}
      </main>

      {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} onSubmit={handleCreateEvent} />}
    </div>
  );
};

// --- LOGIN PAGE ---
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");
    try {
      await login(email, password);
      toast.success("Welcome back!", { id: loadingToast });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2">Enter your details to access your account.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
            <input type="email" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
            <input type="password" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">Sign in</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

// --- REGISTER PAGE ---
export const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");
    try {
      await register(formData.fullName, formData.email, formData.password);
      toast.success("Account created!", { id: loadingToast });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Join GatherLocal</h2>
            <p className="text-gray-500 mt-2">Start hosting and attending events today.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
            <input type="text" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email</label>
            <input type="email" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
            <input type="password" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Get Started</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};