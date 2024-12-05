import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import FirebaseRegister from './FirebaseRegister/FirebaseRegister';
import Home from './SideItems/Home';
import Brands from './SideItems/Brands';
import MakeUp from './SideItems/MakeUp';
import Skincare from './SideItems/Skincare';
import HairCare from './SideItems/HairCare';
import Fragrances from './SideItems/Fragrances';
import Tool_Brush from './SideItems/Tool_Brush';
import ContactUs from './SideItems/ContactUs';
import Dashboard from './SideItems/Dashboard';
import { UserProvider } from './SideItems/UserContext';
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
    <div>
      <UserProvider>
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<FirebaseRegister />} />
        {/* <Route path='/Sidebar' element={<Sidebar />} /> */}
        <Route
          path='/*'
          element={
            <>
              <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
              {/* <Sidebar/> */}
              <Routes>
              <Route path='/Home' element={<Home isSidebarOpen={isSidebarOpen}  />} />
              <Route path='/Brands' element={<Brands isSidebarOpen={isSidebarOpen} />} />
              <Route path='/Makeup' element={<MakeUp isSidebarOpen={isSidebarOpen} />} />
              <Route path='/Skincare' element={<Skincare isSidebarOpen={isSidebarOpen}/>} />
              <Route path='/Haircare' element={<HairCare isSidebarOpen={isSidebarOpen}/>} />
              <Route path='/Fragrances' element={<Fragrances isSidebarOpen={isSidebarOpen}/>} />
              <Route path='/Tools&Brushes' element={<Tool_Brush isSidebarOpen={isSidebarOpen}/>} />
              <Route path='/ContactUs' element={<ContactUs isSidebarOpen={isSidebarOpen}/>} />
              <Route path='/Dashboard' element={<Dashboard isSidebarOpen={isSidebarOpen}/>} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
    </UserProvider>
    </div>
  );
}

export default App;