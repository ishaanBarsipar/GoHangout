// =================================================================
// FILE: src/components/Components.jsx
// ACTION: Overwrite existing file. PASTE CLOUDINARY KEYS at line ~230!
// =================================================================
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import RazorpayButton from './RazorpayButton.jsx';
import { Calendar, MapPin, X, LogOut, User, Plus, Image as ImageIcon, Loader, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // NEW: Animations
import toast from 'react-hot-toast'; // NEW: Notifications

// --- NAVBAR ---
export const Navbar = ({ onOpenCreate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50";

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
              Gather<span className="text-indigo-600">Local</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <button 
                  onClick={() => navigate('/my-events')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/my-events')} hidden sm:block`}
                >
                  My Events
                </button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenCreate}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-gray-200 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Host Event</span>
                </motion.button>
                
                <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white cursor-pointer" title={user.email}>
                  {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                
                <button 
                  onClick={() => { logout(); toast.success("Logged out successfully"); }} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="text-gray-600 font-semibold hover:text-gray-900 px-3 py-2">
                  Log in
                </button>
                <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- EVENT CARD ---
export const EventCard = ({ event }) => {
  const d = new Date(event.eventDate || event.date);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 group flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="h-52 relative overflow-hidden bg-gray-100">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <ImageIcon className="text-indigo-200 h-16 w-16" />
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4">
           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${event.price > 0 ? 'bg-white text-gray-900' : 'bg-emerald-500 text-white'}`}>
            {event.price > 0 ? `₹${event.price}` : 'Free'}
          </span>
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-4 left-4">
           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-black/60 text-white backdrop-blur-md">
            {event.category || 'General'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
        <p className="text-xs font-semibold text-indigo-500 mb-3 uppercase tracking-wide">Hosted by {event.hostName}</p>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">{event.description}</p>
        
        <div className="space-y-2.5 mb-5 pt-4 border-t border-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2.5 text-gray-400" />
            <span className="font-medium">{dateStr}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{timeStr}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2.5 text-gray-400" />
            <span className="truncate">{event.locationName}</span>
          </div>
        </div>

        <div className="mt-auto">
          {event.price > 0 ? (
            <RazorpayButton amount={event.price} eventTitle={event.title} />
          ) : (
            <button className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 hover:text-indigo-600 transition-all border border-gray-200">
              Join Event
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- CREATE EVENT MODAL ---
export const CreateEventModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', hostName: '', price: 0, 
    locationName: '', category: 'Social', date: '', time: '', imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  // --- CLOUDINARY CONFIG (PASTE YOUR KEYS HERE) ---
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const loadingToast = toast.loading("Uploading image...");
    
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "post",
        body: data
      });
      const imageData = await res.json();
      if(imageData.url) {
          setFormData({ ...formData, imageUrl: imageData.url });
          toast.success("Image uploaded!", { id: loadingToast });
      } else {
          toast.error("Upload failed. Check console.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error during upload", { id: loadingToast });
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    onSubmit({ ...formData, date: dateTime });
  };

  return (
    <AnimatePresence>
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative border border-white/20"
        >
            <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
            <X className="h-5 w-5" />
            </button>
            
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Host an Event</h2>
                <p className="text-gray-500 text-sm mt-1">Share your experience with the community.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${formData.imageUrl ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                <label className="cursor-pointer block w-full h-full">
                    {formData.imageUrl ? (
                        <div className="flex flex-col items-center text-green-700">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="font-semibold text-sm">Image Ready</span>
                            <span className="text-xs opacity-75 mt-1">Click to replace</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            {uploading ? <Loader className="h-8 w-8 mb-2 animate-spin text-indigo-600" /> : <ImageIcon className="h-8 w-8 mb-2 text-gray-300" />}
                            <span className="font-semibold text-sm text-gray-700">Upload Event Poster</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Title</label>
                    <input required type="text" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium"
                    placeholder="e.g. Sunset Yoga in the Park"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Category</label>
                        <select className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Social</option><option>Tech</option><option>Music</option><option>Sports</option><option>Education</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Price (₹)</label>
                        <input type="number" min="0" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Date</label>
                        <input required type="date" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Time</label>
                        <input required type="time" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Location</label>
                        <input required type="text" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Venue Name"
                        value={formData.locationName} onChange={e => setFormData({...formData, locationName: e.target.value})} />
                    </div>
                    <div className="col-span-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Host</label>
                        <input required type="text" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Organizer Name"
                        value={formData.hostName} onChange={e => setFormData({...formData, hostName: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Description</label>
                    <textarea required rows="3" className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Tell people what's happening..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
            </div>

            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={uploading}
                className={`w-full py-4 rounded-xl font-bold shadow-xl transition-all ${uploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200'}`}
            >
                {uploading ? 'Waiting for Image...' : 'Publish Event'}
            </motion.button>
            </form>
        </motion.div>
        </div>
    </AnimatePresence>
  );
};