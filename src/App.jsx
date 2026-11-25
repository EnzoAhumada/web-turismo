import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import './components/auth/RouteLoading.css';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorerPage from './pages/ExplorerPage';
import MapPage from './pages/MapPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import RecommendationsPage from './pages/RecommendationsPage';
import TripPlannerPage from './pages/TripPlannerPage';
import FavoritesPage from './pages/FavoritesPage';
import AstronomyPage from './pages/AstronomyPage';
import AstroGalleryPage from './pages/AstroGalleryPage';
import GuidesPage from './pages/GuidesPage';
import PhotographerProfilePage from './pages/PhotographerProfilePage';
import EventsPage from './pages/EventsPage';
import GamificationPage from './pages/GamificationPage';
import ExperiencesPage from './pages/ExperiencesPage';
import RestaurantsPage from './pages/RestaurantsPage';
import AccommodationsPage from './pages/AccommodationsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import AccommodationDetailPage from './pages/AccommodationDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import ExperienceDetailPage from './pages/ExperienceDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/admin/DashboardPage';
import PlacesAdminPage from './pages/admin/PlacesAdminPage';
import RestaurantsAdminPage from './pages/admin/RestaurantsAdminPage';
import AccommodationsAdminPage from './pages/admin/AccommodationsAdminPage';
import EventsAdminPage from './pages/admin/EventsAdminPage';
import NewsAdminPage from './pages/admin/NewsAdminPage';
import AstronomyAdminPage from './pages/admin/AstronomyAdminPage';
import ExperiencesAdminPage from './pages/admin/ExperiencesAdminPage';
import BookingsAdminPage from './pages/admin/BookingsAdminPage';
import GuidesAdminPage from './pages/admin/GuidesAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pública */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/explorar" element={<ExplorerPage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/lugar/:id" element={<PlaceDetailPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/eventos/:id" element={<EventDetailPage />} />
          <Route path="/experiencias" element={<ExperiencesPage />} />
          <Route path="/experiencias/:id" element={<ExperienceDetailPage />} />
          <Route path="/restaurantes" element={<RestaurantsPage />} />
          <Route path="/restaurantes/:id" element={<RestaurantDetailPage />} />
          <Route path="/alojamientos" element={<AccommodationsPage />} />
          <Route path="/alojamientos/:id" element={<AccommodationDetailPage />} />
          <Route path="/astronomia" element={<AstronomyPage />} />
          <Route path="/fotografia" element={<AstroGalleryPage />} />
          <Route path="/guias" element={<GuidesPage />} />
          <Route path="/fotografo/:handleOrId" element={<PhotographerProfilePage />} />
          <Route path="/usuario/:handleOrId" element={<PhotographerProfilePage />} />

          {/* Requiere auth */}
          <Route path="/inicio" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/recomendaciones" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
          <Route path="/planificador" element={<ProtectedRoute><TripPlannerPage /></ProtectedRoute>} />
          <Route path="/favoritos" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/gamificacion" element={<ProtectedRoute><GamificationPage /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Solo admin */}
          <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
          <Route path="/admin/noticias" element={<AdminRoute><NewsAdminPage /></AdminRoute>} />
          <Route path="/admin/lugares" element={<AdminRoute><PlacesAdminPage /></AdminRoute>} />
          <Route path="/admin/astronomia" element={<AdminRoute><AstronomyAdminPage /></AdminRoute>} />
          <Route path="/admin/experiencias" element={<AdminRoute><ExperiencesAdminPage /></AdminRoute>} />
          <Route path="/admin/restaurantes" element={<AdminRoute><RestaurantsAdminPage /></AdminRoute>} />
          <Route path="/admin/alojamientos" element={<AdminRoute><AccommodationsAdminPage /></AdminRoute>} />
          <Route path="/admin/eventos" element={<AdminRoute><EventsAdminPage /></AdminRoute>} />
          <Route path="/admin/reservas" element={<AdminRoute><BookingsAdminPage /></AdminRoute>} />
          <Route path="/admin/guias" element={<AdminRoute><GuidesAdminPage /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
