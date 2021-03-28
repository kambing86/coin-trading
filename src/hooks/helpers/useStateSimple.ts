import { useReducer } from "react";

/*
this is a helper hook that act similar to setState in React
*/

function reducer<T>(currentState: T, newState: Partial<T>) {
  return {
    ...currentState,
    ...newState,
  };
}

export default function useStateSimple<T extends unknown>(
  initialState: () => T,
) {
  return useReducer<React.Reducer<T, Partial<T>>, null>(
    reducer,
    null,
    initialState,
  );
}
