import { useState, useEffect, useMemo } from 'react';

interface AsyncOpt {
  condition: boolean;
  deps: any[];
}
export interface AsyncRes {
  res?: any;
  error?: string;
  loading: boolean;
}
const defaultOpt: AsyncOpt = { condition: true, deps: [] };

/**
 * allows us to easily call async functions inside hooks
 * @param  {Function} fn         function we want to call
 * @param  {Array} args       fn arguments
 * @param  {opt}  { condition: only execute if condition is true, deps: additional execution deps }
 * @return {error: String, result: Any, loading: boolean} return object
 */
export function useAsync(
  fn,
  args: any[],
  opt: AsyncOpt = defaultOpt
): AsyncRes {
  opt = { ...defaultOpt, ...opt };
  const [res, setResult] = useState<any | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const callAsyncFn = async () => {
      try {
        setLoading(true);
        const result = await fn(...args);
        setResult(result);
        setLoading(false);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      }
    };
    if (opt.condition && fn) callAsyncFn();
  }, [opt.condition, ...args, ...opt.deps, fn]);
  const memoRes = useMemo(
    () => ({
      error,
      res,
      loading
    }),
    [error, res, loading]
  );
  return memoRes;
}
