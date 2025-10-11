import { useEffect } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children, id = "modal-root" }) => {
  // Create or get the portal container
  const getOrCreatePortalRoot = () => {
    let portalRoot = document.getElementById(id);
    
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = id;
      document.body.appendChild(portalRoot);
    }
    
    return portalRoot;
  };

  const portalRoot = getOrCreatePortalRoot();

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(children, portalRoot);
};

export default Portal;