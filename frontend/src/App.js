import './App.css';

import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { SideBar } from './components/SideBar';
import FileList from './components/FileList';

import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <SideBar />

      <Routes>
        <Route exact path="/" element={<FileList />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </div>
  );
}

export default App;
