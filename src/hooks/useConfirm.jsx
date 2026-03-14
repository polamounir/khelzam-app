// src/hooks/useConfirm.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/ui/Modal';

const ConfirmContext = createContext();

export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState(null);

  const confirm = useCallback((config) => {
    return new Promise((resolve) => {
      setModalConfig({
        ...config,
        isOpen: true,
        onConfirm: () => {
          setModalConfig(null);
          resolve(true);
        },
        onClose: () => {
          setModalConfig(null);
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {modalConfig && <Modal {...modalConfig} />}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
