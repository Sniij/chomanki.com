"use client";

import { createContext, useState, useContext } from 'react';

interface UserProfile {
  id: string;
  nickname: string;
  imgUrl: string;
}

interface IAuthContext {
  userProfile: UserProfile;
  isLoggedIn: boolean;
  setUserProfile: (userProfile: UserProfile) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Cannot find AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({ id: '', nickname: '', imgUrl: '' });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const value = {
    userProfile,
    isLoggedIn,
    setUserProfile,
    setIsLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
