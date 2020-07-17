import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as DataVuzix from './RangeFilter/data'
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
import MainConponent from './MainComponent/MainConponent';

const store = ConfigureStore();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <MainConponent />
      </Provider>
    </div>
  );
}

export default App;