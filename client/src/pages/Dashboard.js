import '../App.css';
import Movies from '../components/Movies';
import Header from '../components/Header';

function Dashboard() {
    return (
        <div className="App">
        <Header />
        <Movies />
        </div>
    );
}

export default Dashboard;