import { useEffect, useRef } from 'react';

export function useKey(keyConfig, cb) {
  const callback = useRef(cb);

  //full list of event codes: https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
  // example keyconfig: {event: 'ctrlKey', key: 's'}

  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    function handle(event) {
      if (event && event[keyConfig.event] && keyConfig.key && keyConfig.key === event.key) {
        event.preventDefault();
        callback.current(event);
      }
      // else if (key === 'ctrls' && event.key === 's' && event.ctrlKey) {
      //   event.preventDefault();
      //   callback.current(event);
      // }
    }

    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [keyConfig]);
}
