import { useEffect } from 'react';
import mermaid from 'mermaid';
import { nanoid } from 'nanoid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

const Mermaid = ({ chart }) => {
  const id = nanoid();
  useEffect(() => {
    const element = document.getElementById(id);
    if (element.hasAttribute('data-processed')) element.removeAttribute('data-processed');
    mermaid.contentLoaded();
  }, [chart]);

  // useEffect(() => {
  //   document.getElementById(id).removeAttribute('data-processed');
  //   mermaid.contentLoaded();
  // }, [chart]);

  return (
    <pre
      id={id}
      className="mermaid"
    >
      {chart}
    </pre>
  );
};

export default Mermaid;
