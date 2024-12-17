import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/main.tsx';
import Login from './pages/login.tsx';
import Inspiration from './pages/inspiration.tsx';
import RecipePage from './pages/recipePage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Main />} />
          <Route path="inspiration" element={<Inspiration/>} />
          <Route path="login" element={<Login />} />
          <Route path="recipe/:id" element={<RecipePage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;