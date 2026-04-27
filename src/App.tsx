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
import CreateSession from './pages/createSession';
import CreatePack from './pages/createPack';
import GameLayout from './components/game-layout/GameLayout';
import ConectionLayout from './components/connection-layout/ConnectionLayout';
import Leaderboard from './pages/leaderboard';

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

            <Route path="packs" element={<ConectionLayout />}>
              <Route index element={<Packs />} />
              <Route path="createPack">
                <Route index element={<CreatePack />} />
              </Route>
            </Route>

            <Route path="registration" element={<ConectionLayout />}>
              <Route index element={<Registration />} />
            </Route>

            <Route path="createSession" element={<ConectionLayout />}>
              <Route path=":packId">
                <Route index element={<CreateSession />} />
              </Route>
            </Route>

            <Route path="categories" element={<GameLayout />}>
              <Route path=":sessionId">
                <Route index element={<Categories />} />
              </Route>
            </Route>

              <Route path="board" element={<GameLayout />}>
                <Route path=":sessionId">
                  <Route path="leaderboard" element={<Leaderboard />}/>
                  <Route path=":roundOrder">
                    <Route index element={<Board />} />
                    <Route path="question">
                      <Route path=":questionId">
                        <Route index element={<Question />} />
                        <Route path="answer">
                          <Route index element={<Answer />} />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
          </Route>

          <Route path='*' element={<EmptyPage/> } />

        </Routes> 
      </BrowserRouter>
    </GameProvider>
  )
}

export default App;
