import { HashRouter, Route, Routes} from 'react-router-dom';
import { Box } from '@mui/system';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Trips from './Pages/Trips/Trips';
import Trip from './Pages/Trip/Trip';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import UpdateProfile from './Pages/UpdateProfile/UpdateProfile';
import AddTrip from './Pages/AddTrip/AddTrip';
import ScrollToTop from './hooks/scrollToTop/scrollToTop';
import './App.css';

export const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/prijava" />;
};

export const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/profil" /> : children;
};

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Header></Header>
        <div className="app">
          <Box 
            sx={{ 
              minHeight: '100vh', 
              width: '100%',  
              backgroundColor: '#ffffff',
            }}>
            <ScrollToTop />
            <Routes>
              <Route path='/' element={<Home/>} exact/>
              <Route 
                path='/profil' 
                element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>}
              />
              <Route 
                path='/uredi-profil' 
                element={
                      <PrivateRoute>
                        <UpdateProfile />
                      </PrivateRoute>}
              />
              <Route 
                path='/dodaj-put' 
                element={
                    <PrivateRoute>
                      <AddTrip />
                    </PrivateRoute>}
              />
              <Route path='/putovanja' element={<Trips/>}/>
              <Route exact path="/putovanja/:id" element={<Trip/>} />
              <Route 
                path="/prijava" 
                element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>}
              />
              <Route 
                path="/registracija" 
                element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>}
              />
            </Routes>
          </Box>
        </div>
        <Footer></Footer>
      </AuthProvider>
  </HashRouter>
  );
}

export default App;
