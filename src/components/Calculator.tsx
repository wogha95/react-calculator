import { Digits, Modifier, Operations } from '.';
import { useCalculatorState } from '../hooks/useCalculatorContext';

export default function Calculator() {
  const { total } = useCalculatorState();

  return (
    <div className="calculator">
      <h1 id="total">{total}</h1>
      <Digits />
      <Modifier />
      <Operations />
    </div>
  );
}
