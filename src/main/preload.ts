// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { generatePDF } from '../renderer/components/generatePDF';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  saveOrder: (orderData) => ipcRenderer.send('save-order', orderData),
  onOrderSaved: (callback) => ipcRenderer.on('order-saved', (event, data) => callback(data)),
  deleteOrder: (orderId) => ipcRenderer.send('delete-order', orderId),
  onOrderDeleted: (callback) => ipcRenderer.on('order-deleted', (event, data) => callback(data)),
  savePDF: (order) => ipcRenderer.invoke('save-pdf', order),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
