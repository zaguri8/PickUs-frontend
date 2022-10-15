import { useContext, useState, useEffect } from "react"
import { StoreSingleton } from "../database";
import { GoogleAuthProvider, signInWithPopup, Unsubscribe } from "firebase/auth";
import { onValue } from "firebase/database";

import { User } from "firebase/auth";
import React from "react";
import { PNPUser } from "../types";
import 'firebase/compat/app'
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref, child } from "firebase/database";


export interface IUserContext {
  user: User | undefined | null;
  appUser: PNPUser | null | undefined;
  signInPopUp: (onComplete?: () => void) => void,
  error: Error | null;
  setUser: (user: User | null | undefined) => void;
  setAppUser: (user: PNPUser | null) => void;
}
const UserContext = React.createContext<IUserContext | null>(null);
export const UserContextProvider = (props: object) => {
  const [user, setUser] = useState<User | null | undefined>()
  const [appUser, setAppUser] = useState<PNPUser | null | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    let tools = StoreSingleton.get()
    const unsubscribe = tools.auth.onAuthStateChanged((user) => {
      let unsub: Unsubscribe | null = null
      if (user) {
        unsub = onValue(child(ref(tools.db, 'users'), user.uid), (snap) => {
          const au = snap.val()
          setTimeout(() => {
            setAppUser(au)
            setUser(user)
          }, 1000)
        }, () => {
          setTimeout(() => {
            setUser(user)
            setAppUser(null)
          }, 1000)
        })
      } else {
        setTimeout(() => {
          setUser(user)
          setAppUser(null)
        }, 1000)
      }
      return () => { unsub as Unsubscribe && (unsub as Unsubscribe)() }
    }, setError)
    return () => unsubscribe()
  }, [])

  const signInPopUp = (onComplete?: (a: any) => void) => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(StoreSingleton.get().auth, provider)
      .then(a => {
        onComplete && onComplete(a)
      })
      .catch(e => {
        onComplete && onComplete(e)
        setUser(null)
      })
  }


  return <UserContext.Provider value={{ user, appUser, error, setAppUser, setUser, signInPopUp }} {...props} />
}


export const useUser = () => {
  const firebaseContext: IUserContext | null = useContext(UserContext)
  let tools = StoreSingleton.get()

  return {
    ...firebaseContext!!,
    signOut: async () => {
      firebaseContext?.setUser(null)
      firebaseContext?.setAppUser(null)
      return await tools.auth.signOut()
    },
    isLoadingAuth: firebaseContext?.user === undefined,
    isAuthenticated: firebaseContext?.user != null,
    uploadUserImage: async (imageBlob: ArrayBuffer) => {
      if (firebaseContext?.user?.uid) {
        const ref = storageRef(tools.realTime.storage, '/UserImages/' + (firebaseContext!.user!.uid ? firebaseContext!.user!.uid : ''))
        return await uploadBytes(ref, imageBlob)
          .then(async () => {
            return await getDownloadURL(ref)
              .then(url => tools.realTime.updateCurrentUser({ ...firebaseContext.appUser, ...{ image: url } }))
          })
      }
    },
    uploadEventImage: async (eventId: string, imageBlob: ArrayBuffer) => await uploadBytes(storageRef(tools.realTime.storage, 'EventImages/' + eventId), imageBlob)
  }
}