import React, { useState, useEffect } from 'react';
import { Navbar, EventCard } from '../components/Components.jsx';
import { getMyEvents, deleteEvent } from '../services/eventService.js';
import { Trash2, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      const data = await getMyEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch my events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyEvents(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e.id !== id)); 
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onOpenCreate={() => {}} /> 
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')} className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600"><ArrowLeft className="h-5 w-5" /></button>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Your Events</h2>
                <p className="text-sm text-gray-500">Edit or remove events you have created.</p>
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader className="animate-spin text-indigo-600" /></div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map(event => (
              <div key={event.id} className="relative group">
                {/* Gray out card to show it's in edit mode context */}
                <div className="opacity-90 transition-opacity hover:opacity-100">
                    <EventCard event={event} />
                </div>
                
                {/* Delete Button (Floating Action) */}
                <button 
                    onClick={() => handleDelete(event.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2.5 rounded-full shadow-lg shadow-red-200 hover:bg-red-600 transition-transform hover:scale-110 z-20 group-hover:opacity-100 opacity-100 md:opacity-0"
                    title="Delete Event"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="mx-auto bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-indigo-500">
                <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No events yet</h3>
            <p className="text-gray-500 mb-6">You haven't hosted any events.</p>
            <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">Go back home</button>
          </div>
        )}
      </main>
    </div>
  );
};