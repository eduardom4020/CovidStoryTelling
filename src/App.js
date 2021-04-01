import logo from './logo.svg';
import './App.css';
import { StoryScroll } from './components/StoryScroll';

const App = () => (
  <div className="App">
    <StoryScroll />
    <div style={{height: 1000}}></div>
  </div>
);

export default App;
