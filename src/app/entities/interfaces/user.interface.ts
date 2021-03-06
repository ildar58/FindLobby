import firebase from 'firebase';

export interface IUser {
    uid?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    phoneNumber?: string;
    login?: string;
    phone?: string;
    created?: firebase.firestore.FieldValue;
}
