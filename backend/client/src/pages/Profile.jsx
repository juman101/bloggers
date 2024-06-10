import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PostCardprofile from '../components/Profilepost';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/user/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="profile-container">
      <h1>{user.username}'s Profile</h1>
      <img src={user.profilePicture} alt={`${user.username}'s profile`} />
      <p>Email: {user.email}</p>
      <p>Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
      <h2>Posts:</h2>
      {Array.isArray(user.posts) && user.posts.length > 0 ? (
        <div className='flex flex-wrap gap-4'>
          {user.posts.map((post) => (
            <PostCardprofile key={post} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default Profile;
