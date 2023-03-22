import "./App.css";
import { ReportProvider } from "./Context";
import Start from "./Start";

function App() {
  return (
    <div className="App">
      <ReportProvider>
        <Start />
      </ReportProvider>
    </div>
  );
}

export default App;
