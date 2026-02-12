import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './pages/main';
import Board from './pages/board';
import Categories from './pages/categories';
import Layout from './components/layout/Layout';
import EmptyPage from './components/empty-page/EmptyPage';
import Question from './pages/question';
import Answer from './pages/answer';
import Login from './pages/login';
import Packs from './pages/packs';
import Registration from './pages/registration';

import GameProvider from './context/GameContext';

import './App.css';


function App(): JSX.Element {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="login">
              <Route index element={<Login />} />
            </Route>
            <Route path="packs">
              <Route index element={<Packs />} />
            </Route>
            <Route path="registration">
              <Route index element={<Registration />} />
            </Route>
            <Route path="categories">
              <Route index element={<Categories />} />
            </Route>
            <Route path="board">
              <Route path=":id">
                <Route index element={<Board />} />
                <Route path="question">
                  <Route path=":questionId" element={<Question />}/>
                </Route>
                <Route path="answer">
                  <Route path=":anwserId" element={<Answer />}/>
                </Route>
              </Route>
              <Route path="secret" element={<div>Пример для роутинга</div>} />
            </Route>
          </Route>
          <Route path='*' element={<EmptyPage/> } />
        </Routes> 
      </BrowserRouter>
    </GameProvider>
  )
}

export default App;
