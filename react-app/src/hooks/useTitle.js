import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title; //from the DOM
    document.title = title; //set that to new title

    return () => (document.title = prevTitle);
    //handles changing title on unmount
  }, [title]);
};

export default useTitle;
