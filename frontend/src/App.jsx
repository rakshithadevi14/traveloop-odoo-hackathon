import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Trips from './pages/trips/Trips.jsx';
import CreateTrip from './pages/trips/CreateTrip.jsx';
import TripDetails from './pages/trips/TripDetails.jsx';
import EditTrip from './pages/trips/EditTrip.jsx';
import ItineraryBuilder from './pages/trips/ItineraryBuilder.jsx';
import ItineraryView from './pages/trips/ItineraryView.jsx';
import BudgetDashboard from './pages/trips/BudgetDashboard.jsx';
import PackingChecklist from './pages/trips/PackingChecklist.jsx';
import TripNotes from './pages/trips/TripNotes.jsx';
import CommunityFeed from './pages/community/CommunityFeed.jsx';
import PublicItinerary from './pages/community/PublicItinerary.jsx';
import CitySearch from './pages/search/CitySearch.jsx';
import ActivitySearch from './pages/search/ActivitySearch.jsx';
import UserProfile from './pages/profile/UserProfile.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import GlobalPackingChecklist from './pages/checklist/PackingChecklist.jsx';
import GlobalTripNotes from './pages/notes/TripNotes.jsx';
import GlobalBudgetDashboard from './pages/budget/BudgetDashboard.jsx';

function Page({ title }) {
  return (
    <section className='page-in rounded-2xl bg-white p-6 shadow-md'>
      <h3 className='font-sora text-xl font-semibold text-[#0F172A]'>{title}</h3>
      <p className='mt-2 text-[#64748B]'>Protected page content goes here.</p>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Toaster position='top-right' toastOptions={{ style: { borderRadius: '12px', border: '1px solid #e2e8f0' } }} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/dashboard' element={<Navigate to='/' replace />} />
            <Route path='/trips' element={<Trips />} />
            <Route path='/trips/create' element={<CreateTrip />} />
            <Route path='/trips/:id' element={<TripDetails />} />
            <Route path='/trips/:id/edit' element={<EditTrip />} />
            <Route path='/trips/:id/itinerary' element={<ItineraryBuilder />} />
            <Route path='/trips/:id/itinerary/view' element={<ItineraryView />} />
            <Route path='/trips/:id/budget' element={<BudgetDashboard />} />
            <Route path='/trips/:id/checklist' element={<PackingChecklist />} />
            <Route path='/trips/:id/notes' element={<TripNotes />} />
            <Route path='/trips/:id/share' element={<Page title='Share Trip' />} />
            <Route path='/budget' element={<GlobalBudgetDashboard />} />
            <Route path='/community' element={<CommunityFeed />} />
            <Route path='/community/:id' element={<PublicItinerary />} />
            <Route path='/search/cities' element={<CitySearch />} />
            <Route path='/search/activities' element={<ActivitySearch />} />
            <Route path='/checklist' element={<GlobalPackingChecklist />} />
            <Route path='/notes' element={<GlobalTripNotes />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/admin' element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  );
}
