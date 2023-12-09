import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Note', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Note', id })),
          ];
        } else return [{ type: 'Note', id: 'LIST' }];
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
/*/*

/** JS Sort: Take a and b, see if a and b are equal, if they are return 0
 * otherwise check if a.completed, returns 1 or -1
 * this puts completed at the bottom of the list,
 * open status being at the top.
 *

/*The adapter is a tool that helps manage collections of data in a structured way.
 * In this case, it is specifically designed to work with the "users" data collection.
 * The empty object {} passed as an argument to createEntityAdapter represents the initial
 * configuration or settings for the adapter, which can be customized to define how the data is stored, accessed, and manipulated. */

// We are exporting a slice of an API integration for managing user data (usersApiSlice).
// It uses the apiSlice.injectEndpoints() function to define an API endpoint called getUsers.
// The getUsers endpoint is configured using the builder.query() function, which sets the query URL to '/users' to fetch the user data from the server.
// It also specifies additional configurations such as validating the response status, keeping unused data for 5 seconds,
// transforming the response data, and providing tags for caching purposes.

// The transformResponse function is used to modify the response data before storing it in the Redux store. In this case,
// it maps over the received responseData, assigns a new id based on the _id property of each user, and then uses
// usersAdapter.setAll() to update the state with the loaded users.

// The providesTags function is responsible for providing caching tags based on the query result. If the result object
// has ids (indicating successful response with user IDs), it generates tags for each user's ID and a general tag for the entire user list.
// Otherwise, it only provides a tag for the user list.

// Overall, this code sets up an API endpoint for fetching users, configures the endpoint behavior, transforms the response,
// and manages caching tags for efficient data retrieval and storage.*/
