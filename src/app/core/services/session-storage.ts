import { Service } from '@angular/core';
import { Session } from '../models/Session';

@Service()
export class SessionStorage {
    read(): Session | null {
        return this.readFrom(localStorage);
    }

    write(session: Session) {
        const targetStorage = localStorage;
        targetStorage.setItem('eblumbit-session', JSON.stringify(session));
    }

    clear() {
        localStorage.removeItem('eblumbit-session');
    }

    private readFrom(storage: Storage): Session | null {
        if(!storage) {
            return null;
        }
        const dataStorage = storage.getItem('eblumbit-session')
        if(!dataStorage) {
            return null
        }
        let parsedStorage = JSON.parse(dataStorage);
        return parsedStorage 
    }
}
