import './App.css';

import { Route, Routes } from 'react-router-dom';

import FileList from './pages/FileList';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/Sign-in';
import { SignUp } from './pages/Sign-up';
import Private from './hoc/Private';
import './App.css';

import Public from './hoc/Public';

function App() {
  return (
    <div className="App">
      <>
        <Routes>
          <Route element={<Private />}>
            <Route path="/" element={<FileList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<Public />}>
            <Route path="/login" element={<SignIn />}></Route>
            <Route path="/registration" element={<SignUp />}></Route>
          </Route>
        </Routes>
      </>
    </div>
  );
}

export default App;
