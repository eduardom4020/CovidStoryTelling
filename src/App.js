import './App.css';
import { StoryScrollableContainer } from './components/structural/StoryScrollableContainer';
import Slides from './components/slides';

const App = () => (
  <div className="App">
    <StoryScrollableContainer>
      { Slides.map(Slide => <Slide/>) }
    </StoryScrollableContainer>
  </div>
);

export default App;
