import logo from './logo.svg';
import './App.css';
import { StoryScrollableContainer } from './components/StoryScrollableContainer';
import { StorySlide } from './components/StorySlide';

const App = () => (
  <div className="App">
    <StoryScrollableContainer>
      <StorySlide style={{height: 200, backgroundColor: 'steelblue'}}></StorySlide>
      <StorySlide style={{height: 600, backgroundColor: 'darkred'}}></StorySlide>
      <StorySlide style={{height: 100, backgroundColor: 'purple'}}></StorySlide>
      <StorySlide style={{height: 400, backgroundColor: 'grey'}}></StorySlide>
      <StorySlide style={{height: 400, backgroundColor: 'green'}}></StorySlide>
      <StorySlide style={{height: 1000, backgroundColor: 'yellow'}}></StorySlide>
    </StoryScrollableContainer>
  </div>
);

export default App;
