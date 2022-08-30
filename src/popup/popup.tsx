import { createRoot } from 'react-dom/client';
import App from '../components/App';
import './popup.css'

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);