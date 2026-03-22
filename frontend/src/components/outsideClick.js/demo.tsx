import { useState } from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore - Dropdown is an untyped JS module
import Dropdown from './Dropdown';
import './styles.css';

function App(): JSX.Element {
  const [vegetagle, setVegetable] = useState<string | undefined>(undefined);
  const [fruit, setFruit] = useState<string | undefined>(undefined);

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
