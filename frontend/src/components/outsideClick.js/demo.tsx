import { useState } from 'react';
import ReactDOM from 'react-dom';

import Dropdown from '.';
import './styles.css';

function App(): JSX.Element {
  const [vegetagle, setVegetable] = useState<string>('');
  const [fruit, setFruit] = useState<string>('');

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Dropdown
        placeholder="Select Vegetable"
        value={vegetagle}
        onChange={(v: string) => setVegetable(v)}
        options={['Tomato', 'Cucumber', 'Potato']}
      />
      <Dropdown
        placeholder="Select Fruit"
        value={fruit}
        onChange={(v: string) => setFruit(v)}
        options={['Apple', 'Banana', 'Orange', 'Mango']}
      />
    </div>
  );
}

const rootElement: HTMLElement | null = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
