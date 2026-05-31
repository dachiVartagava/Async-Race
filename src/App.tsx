import { useSelector } from 'react-redux';
import { type RootState } from './store';
import { Header } from './components/Header';
import { GarageView } from './views/GarageView';
import { WinnersView } from './views/WinnersView';
import './index.css';

function App() {
  // ვკითხულობთ Redux-იდან, რომელი გვერდია აქტიური (სამი r-ით)
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