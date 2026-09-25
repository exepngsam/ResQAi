import { useEffect, useState } from "react";

const PageTransition = ({ children, pageKey, className = "" }) => {
  const [animatingKey, setAnimatingKey] = useState(pageKey);

  useEffect(() => {
    setAnimatingKey(pageKey);
  }, [pageKey]);

  return (
    <div key={animatingKey} className={`page-enter ${className}`}>
      {children}
    </div>
  );
};

export { PageTransition };
