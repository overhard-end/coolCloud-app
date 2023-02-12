import './App.css';

import { Route, Routes } from 'react-router-dom';

import { FileList } from './pages/FileList';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

import Private from './hoc/Private';
import './App.css';
import Public from './hoc/Public';

import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

export const App = () => {
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
            <Route path="/sign-in" element={<SignIn />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
          </Route>
        </Routes>
      </>
    </div>
  );
};
