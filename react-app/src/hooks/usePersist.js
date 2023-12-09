import { useState, useEffect } from 'react';

const usePersist = () => {
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist')) || false
  );

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};
export default usePersist;
/**
 * Similar to useLocalStorage component
 *
 * Setting persist and setPersist with useState
 *
 * Looking at our localStorage, if persist does not exist, its false
 *
 * useEffect hook, when 'persist' changes, we set that value to the localStorage, returning persist and setPersist.
 *
 * similar to useState hook but w/ 'persist' data
 *
 *
 */
