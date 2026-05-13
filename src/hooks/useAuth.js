import { useState, useEffect } from 'react';
import { client } from '../sanityClient';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expense-profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync Profile with Sanity on load for real-time accuracy across all fields
  useEffect(() => {
    if (user?.username || user?.id) {
      const query = user?.id 
        ? `*[_type == "user" && _id == $id][0]` 
        : `*[_type == "user" && username == $username][0]`;
      
      const params = user?.id 
        ? { id: user.id } 
        : { username: user?.username };

      client.fetch(query, params)
      .then((updatedUser) => {
        if (updatedUser) {
          const refined = {
            id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email
          };
          
          const hasChanged = 
            refined.name !== user.name || 
            refined.email !== user.email || 
            refined.username !== user.username ||
            !user.id;

          if (hasChanged) {
            setUser(refined);
            localStorage.setItem('expense-profile', JSON.stringify(refined));
          }
        }
      })
      .catch(e => console.error("Profile sync error:", e));
    }
  }, []); 

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    window.localStorage.setItem('expense-profile', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('expense-profile');
    localStorage.removeItem('expense-transactions'); 
  };

  return { user, setUser, handleAuthSuccess, handleLogout };
}
