import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './pages/main';
import Board from './pages/board';
import Categories from './pages/categories';
import Layout from './components/layout/Layout';

import './App.css';
import EmptyPage from './components/empty-page/EmptyPage';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="categories">
            <Route index element={<Categories />} />
          </Route>
          <Route path="board">
            <Route index element={<Board />} />
            <Route path=":id" element={<Board />} />
            <Route path="secret" element={<div>Пример для роутинга</div>} />
          </Route>
        </Route>
        <Route path='*' element={<EmptyPage/> } />
      </Routes> 
    </BrowserRouter>
  )
}

export default App;
