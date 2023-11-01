import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Explore from './Pages/Explore'
import Offers from './Pages/Offers'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import UserProfile from './UserProfile'
import CreateListing from './Pages/CreateListing'
import ForgotPassword from './Pages/ForgotPassword'
import PrivateRoute from './Components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import Category from './Pages/Category'
import Listing from './Pages/Listing'
import Contact from './Pages/Contact'
import EditListing from './Pages/EditListing'
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offer' element={<Offers />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/contact/:landLordId' element={<Contact />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/category/:categoryName/:listingId' element={<Listing />} />
          <Route path='/userprofile' element={<PrivateRoute />}>
            <Route path='/userprofile' element={<UserProfile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/edit-listing/:listingId' element={<EditListing />} />


        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
