import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "../pages/Home";
import CalculatorPage from "../pages/CalculatorPage"


export default function Router({ children }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/berekenen-nieuw" element={<CalculatorPage isNieuw={true} />} />
        <Route path="/berekenen-bestaand" element={<CalculatorPage isNieuw={false} />} />
      </Routes>
      {children}
    </BrowserRouter>
  );
}