import { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { NotificationContext, initialState } from './context';

var ActionType;
(function (ActionType) {
  ActionType['AUTH_STATE_CHANGED'] = 'AUTH_STATE_CHANGED';
})(ActionType || (ActionType = {}));

const reducer = (state, action) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

export const NotificationProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
