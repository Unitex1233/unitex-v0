import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Communities from './pages/Communities';
import CommunityPage from '@/pages/CommunityPage';
import Events from './pages/Events';
import Networking from './pages/Networking';
import Resources from './pages/Resources';
import Messages from './pages/Messages';
import Vault from './pages/Vault';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import OtherProfile from '@/pages/OtherProfile';
import EventDetail from '@/pages/EventDetail';
import DiscoverDetail from '@/pages/DiscoverDetail';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'sonner';

function App() {
    return (
        <NotificationProvider>
            <Toaster position="top-center" expand={true} richColors />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="discover" element={<Discover />} />
                    <Route path="discover/:slug" element={<DiscoverDetail />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="communities" element={<Communities />} />
                    <Route path="communities/:communityId" element={<CommunityPage />} />
                    <Route path="events" element={<Events />} />
                    <Route path="events/:eventId" element={<EventDetail />} />
                    <Route path="networking" element={<Networking />} />
                    <Route path="roadmaps" element={<Resources />} />
                    <Route path="courses" element={<Resources />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="vault" element={<Vault />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/:userId" element={<OtherProfile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </NotificationProvider>
    );
}

export default App;
