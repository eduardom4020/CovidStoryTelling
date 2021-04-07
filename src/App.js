import './App.css';
import { StoryScrollableContainer } from './components/structural/StoryScrollableContainer';
import Slides from './components/slides';
import { startDataInterceptors } from './configurations/startDataInterceptors';

const App = () => {
  startDataInterceptors();

  return (
    <div className="App">
      <StoryScrollableContainer>
        { Slides.map(Slide => <Slide/>) }
      </StoryScrollableContainer>
    </div>
  );
}

export default App;
