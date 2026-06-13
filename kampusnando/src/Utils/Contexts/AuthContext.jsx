import { createContext, useContext, useState } from "react";

const AuthStateContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (newUser) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthStateContext.Provider value={{ user, setUser }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthStateContext must be used within an AuthProvider");
  }
  return context;
};
