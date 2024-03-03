import { createContext, useReducer } from 'react';
import { DIGIT, OPERATION } from '../types';
import { calculate, isOperation } from '../utils';
import { CONST } from '../utils/const';

type STATE = {
  total: string;
  memory: string[];
};
type ACTION = ACTION_DIGIT | ACTION_MODIFIER | ACTION_OPERATION;
type ACTION_DIGIT = {
  type: 'digit';
  param: DIGIT;
};
type ACTION_MODIFIER = {
  type: 'modifier';
};
type ACTION_OPERATION = {
  type: 'operation';
  param: OPERATION;
};

export const CalculatorStateContext = createContext<STATE | null>(null);
export const CalculatorDispatchContext =
  createContext<React.Dispatch<ACTION> | null>(null);

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CalculatorStateContext.Provider value={state}>
      <CalculatorDispatchContext.Provider value={dispatch}>
        {children}
      </CalculatorDispatchContext.Provider>
    </CalculatorStateContext.Provider>
  );
}

const reducer = (state: STATE, action: ACTION) => {
  const { total, memory } = state;
  switch (action.type) {
    case 'digit': {
      if (total.length === CONST.DIGIT_MAX_LENGTH) {
        return state;
      }
      if (total === '0' || isOperation(total)) {
        return {
          ...state,
          total: action.param,
        };
      }
      return {
        ...state,
        total: total.concat(action.param),
      };
    }
    case 'modifier':
      return initialState;
    case 'operation': {
      if (action.param === '=') {
        if (memory.length === 1) {
          return {
            total,
            memory,
          };
        }
        const [leftNumber, operation] = memory;
        const rightNumber = total;
        const newTotal = calculate(
          Number(leftNumber),
          operation,
          Number(rightNumber)
        ).toString();
        return {
          total: newTotal,
          memory: [newTotal],
        };
      }

      if (isOperation(total)) {
        return {
          total: action.param,
          memory: [memory[0], action.param],
        };
      }

      return {
        total: action.param,
        memory: [total, action.param],
      };
    }
    default: {
      throw Error('Unknown action');
    }
  }
};

const initialState: STATE = {
  total: '0',
  memory: [],
};
