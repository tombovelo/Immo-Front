
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserLayout from "./layout/UserLayout/UserLayout";
import AccueilPage from "./pages/AcceuilPage/AcceuilPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ListeMaisonPage from "./pages/ListeMaisonPage/ListeMaisonPage";
import LoginPage from './pages/LoginPage/LoginPage'
import MaisonDetailsPage from "./pages/MaisonDetailsPage/MaisonDetailsPage";
import ProprietaireLayout from "./layout/ProprietaireLayout/ProprietaireLayout";
import TablePageMaisons from "./pages/TablePageMaison/TablePageMaison";
import ProtectedRoute from "./Route/Route";
import EditMaisonPage from "./pages/EditMaisonPage/EditeMaisonPage";
import MaisonPage from "./pages/MaisonPage/MaisonPage";
// import TablePageAlbum from './pages/TablePageAlbum/TablePageAlbum'
import AlbumPage from "./pages/AlbumPage/AlbumPage";
import EditAlbumPage from "./pages/EditAlbumPage/EditAlbumPage";
import AlbumDetailsPage from "./pages/AlbumDetailsPage/AlbumDetailsPage";
// import TablePagePhoto from "./pages/TablePagePhoto/TablePagePhoto";
import PhotoPage from "./pages/PhotoPage/PhotoPage";
import EditPhotoPage from "./pages/EditPhotoPage/EditPhotoPage";
import Profile from "./pages/Profile/Profile";
import EditeProprietairePage from "./pages/EditProprietairePage/EditProfile";
import MaisonInMapPage from "./pages/MaisonInMapPage/MaisonInMapPage";


function App() {
  return (
    <div className='app'>
      <Routes>
        {/* Routes publiques sans layout */}
        <Route path="/" element={<AccueilPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      
        {/* Routes utilisateurs protégées avec le MainLayout (Navbar + Footer) */}
        <Route element={<UserLayout />}>
          <Route path="/maisons/list" element={<ListeMaisonPage  />} />
          <Route path="/maisons/:id" element={<MaisonDetailsPage/>} />
          <Route path="albums/details/:id" element={<AlbumDetailsPage />} />
          <Route path="/maisons/map" element={<MaisonInMapPage />} />
        </Route> 

        <Route path = "/proprietaire" element={<ProtectedRoute><ProprietaireLayout /></ProtectedRoute>}>
          <Route path="maisons/table" element={<TablePageMaisons  />} />
          <Route path="maisons/:id" element={<MaisonDetailsPage/>} />
          <Route path="maisons/edit/:id" element={<EditMaisonPage/>} />
          <Route path="maison" element={<MaisonPage />} />
          {/* <Route path="albums/table" element={<TablePageAlbum/>} /> */}
          <Route path="album" element={<AlbumPage/>} />
          <Route path="albums/edit/:id" element={<EditAlbumPage/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="photo" element={<PhotoPage/>} />
          <Route path="photos/edit/:id" element={<EditPhotoPage/>} />
          <Route path="profile/edit/:id" element={<EditeProprietairePage/>} />
        </Route> 

      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;



