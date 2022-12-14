import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useModal } from './logic/context/ModalContext';
import { Modal, Toolbar } from './visual/components/features';
import Footer from './visual/components/features/Footer';
import LiveChat from './visual/components/features/LiveChat';
import InvitationCardWorkers from './visual/invitation/InvitationCardWorkers';
import routing from './visual/routing';
function App() {
  const modal = useModal()
  return (
    <div className="App">
      {modal.content && <Modal />}
      <HashRouter>
        <Toolbar />
        <Routes>
          {React.Children.toArray(routing.map(route => route.toRoute()))}

          <Route path={'/calendar/:id'} element={<InvitationCardWorkers/>}/>
          <Route path={'/chat'} element={<LiveChat/>}/>
        </Routes>
        <Footer />  
      </HashRouter>

    </div>
  );
}

export default App;
