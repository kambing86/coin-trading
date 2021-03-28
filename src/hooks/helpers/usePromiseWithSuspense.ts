import { useEffect, useRef, useState } from "react";

/*
a helper hook to allow Suspense to capture the promise
*/

interface PromiseState<ReturnData, ErrorThrown> {
  readonly data?: ReturnData;
  readonly error?: ErrorThrown;
  readonly init: boolean;
}

function getInitialState<ReturnData, ErrorThrown>(): PromiseState<
  ReturnData,
  ErrorThrown
> {
  return {
    init: false,
  };
}

export default function usePromiseWithSuspense<ReturnData, ErrorThrown = Error>(
  initialPromise?: () => Promise<ReturnData>,
): [
  PromiseState<ReturnData, ErrorThrown>,
  React.Dispatch<React.SetStateAction<Promise<ReturnData>>>,
] {
  const [promise, setPromise] = useState<Promise<ReturnData> | undefined>(
    initialPromise,
  );
  const [state, setState] = useState<PromiseState<ReturnData, ErrorThrown>>(
    getInitialState,
  );
  const loading = useRef(false);
  const [suspensePromise, setSuspensePromise] = useState<Promise<void> | null>(
    null,
  );
  useEffect(() => {
    if (!promise) {
      return;
    }
    setState({ init: true });
    let cleanup = false;
    loading.current = true;
    setSuspensePromise(
      new Promise((resolve) => {
        promise.then(
          (data: ReturnData) => {
            if (!cleanup) {
              loading.current = false;
              setState((val) => ({ ...val, data }));
            }
            resolve();
          },
          (error: ErrorThrown) => {
            if (!cleanup) {
              loading.current = false;
              setState((val) => ({ ...val, error }));
            }
            resolve();
          },
        );
      }),
    );
    return () => {
      cleanup = true;
      loading.current = false;
      setSuspensePromise(null);
      setState(getInitialState);
    };
  }, [promise]);

  if (loading.current && suspensePromise) {
    throw suspensePromise;
  }

  return [
    state,
    setPromise as React.Dispatch<React.SetStateAction<Promise<ReturnData>>>,
  ];
}
