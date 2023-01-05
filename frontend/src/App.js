import './App.css';

import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { SideBar } from './components/SideBar';
import FileList from './components/FileList';

import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { SignIn } from './components/Sign-in';
import Private from './hoc/Private';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<SignIn />}></Route>
      </Routes>
      {Private(
        <>
          <Header />
          <SideBar />
          <Routes>
            <Route path="/" element={<FileList />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </>,
      )}
    </div>
  );
}

export default App;
