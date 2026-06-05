import { useSelector } from 'react-redux';
import { type RootState } from './store';
import { Header } from './components/Header';
import { GarageView } from './views/GarageView';
import { WinnersView } from './views/WinnersView';
import './index.css';

function App() {
 
  const currentView = useSelector((state: RootState) => state.view.currentView);

  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {currentView === 'garage' ? <GarageView /> : <WinnersView />}
      </main>
    </div>
  );
}

export default App;