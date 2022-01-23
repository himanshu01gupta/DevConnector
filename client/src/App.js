import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Login from './component/layout/auth/Login';
import './App.css';
import Register from './component/layout/auth/Register';
import { Provider } from 'react-redux';
import store from './store';
import Alert from './component/layout/Alert'
import { loaduser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './component/dashboard/Dashboard';
import CreateProfile from './component/profile-forms/CreateProfile';
import EditProfile from './component/profile-forms/EditProfile';
import PrivateRoute from './component/routing/PrivateRoute';
import React from 'react';
import AddExperience from './component/profile-forms/AddExperience';
import Profiles from './component/profiles/Profiles';
import Profile from './component/profile/Profile';
import AddEducation from './component/profile-forms/AddEducation';
import Posts from './component/posts/Posts';
import Post from './component/post/Post'


if(localStorage.token)
{
  setAuthToken(localStorage.token);
}

const App=()=> {
    useEffect(()=>{
store.dispatch(loaduser());
    }, []);
  return(  
  <Provider store={store}> 
  <Router>
        <Navbar/>      
        <Alert />
        <Routes>    
        <Route path="/" element={<Landing/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Profiles" element={<Profiles/>} />
        <Route path="/Profile/:id" element={<Profile/>} />
        <Route path='/dashboard'
      element={<PrivateRoute component={Dashboard} />}/>
       <Route path='/create-profile'
      element={<PrivateRoute component={CreateProfile} />}/>
      <Route path='/edit-profile'
      element={<PrivateRoute component={EditProfile} />}/>
      <Route path='/add-experience'
      element={<PrivateRoute component={AddExperience} />}/>
      <Route path='/add-education'
      element={<PrivateRoute component={AddEducation} />}/>
      <Route path='/Posts'
      element={<PrivateRoute component={Posts} />}/>
      <Route path='/Posts/:id'
      element={<PrivateRoute component={Post} />}/> 
      </Routes>
      
    </Router>
    </Provider>
)};    
export default App;
