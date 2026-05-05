import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDocFromServer,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null, 
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    // Testing connection with a dummy path
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export interface Promessa extends DocumentData {
  id?: string;
  title: string;
  description: string;
  funnyStatus: string;
  createdAt: any;
}

export const addPromessa = async (promessa: Omit<Promessa, 'id' | 'createdAt'>) => {
  const path = 'promessas';
  try {
    return await addDoc(collection(db, path), {
      ...promessa,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const subscribeToPromessas = (callback: (promessas: Promessa[]) => void) => {
  const path = 'promessas';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const promessas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Promessa[];
    callback(promessas);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};
