import { store } from '../../app/store';
import { notesApiSlice } from '../notes/notesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true })
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
/**preFetch initiating state for redux
 *
 * prefetch is wrapped around most of the application to
 * maintain state. -- review Ch6 & 7 redux
 *
 * in the application,
 * http://localhost:3000/dash/users,
 * during an edit of user roles, refreshing the page
 * will reload all of data and appear as the same page
 *
 * empty dependency array need this to run only after the component mounts--
 * react 18 strict mode causing mount unmount remount
 *
 * subscribing, unsubscribing, re-subscribing.
 * mounting == implementing server-side logic before rendering into DOM
 *
 *
 */
