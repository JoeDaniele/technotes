import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'User', id })),
          ];
        } else return [{ type: 'User', id: 'LIST' }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);

/**The adapter is a tool that helps manage collections of data in a structured way.
 * In this case, it is specifically designed to work with the "users" data collection.
 * The empty object {} passed as an argument to createEntityAdapter represents the initial
 * configuration or settings for the adapter, which can be customized to define
 * how the data is stored, accessed, and manipulated. */

/**Exports hooks and selectors that can be used to interact with the state related to users,
 * fetch user data, and retrieve user entities from the state.
 */

/*
We are exporting a slice of an API integration for managing user data (usersApiSlice). 
It uses the apiSlice.injectEndpoints() function to define an API endpoint called getUsers.
The getUsers endpoint is configured using the builder.query() function, which sets the 
query URL to '/users' to fetch the user data from the server. 

It also specifies additional configurations such as validating the response status, 
keeping unused data for 5 seconds, transforming the response data, 
and providing tags for caching purposes.

The transformResponse function is used to modify the response data before storing it in
 the Redux store. In this case, 
it maps over the received responseData, assigns a new id based on the _id property of
 each user, and then uses 
usersAdapter.setAll() to update the state with the loaded users.

The providesTags function is responsible for providing caching tags based on the query
result. If the result object 
has ids (indicating successful response with user IDs), it generates tags 
for each user's ID and a general tag for the entire user list. 
Otherwise, it only provides a tag for the user list.

Overall, this code sets up an API endpoint for fetching users, configures the 
endpoint behavior, transforms the response, 
and manages caching tags for efficient data retrieval and storage.*/
