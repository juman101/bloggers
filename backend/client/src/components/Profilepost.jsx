import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PostCardprofile({ post }) {
  const [authorName, setAuthorName] = useState('Unknown');
  const [posts , setposts ]=useState({});
  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(post);
        const res = await fetch(`/api/post/user-by-post/${post}`); // Replace with your actual backend route for fetching user data
        const data = await res.json();
        
        if (res.ok) {
          setposts (data);
        } else {
          setposts ({});
        }
      } catch (error) {
        console.error('Error fetching author name:', error);
        setposts ({});
      }
    };

    fetchPost();
  }, [posts]);

  console.log("hi");
console.log(post);
  useEffect(() => {
    const fetchAuthorName = async () => {
      try {
        console.log(post);
        const res = await fetch(`/api/user/user-by-post/${post}`); // Replace with your actual backend route for fetching user data
        const data = await res.json();
        console.log("hi");
        console.log(data);
        if (res.ok) {
          setAuthorName(data.username);
        } else {
          setAuthorName('Unknown');
        }
      } catch (error) {
        console.error('Error fetching author name:', error);
        setAuthorName('Unknown');
      }
    };

    fetchAuthorName();
  }, [post.userId]);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      
        <img
          src={posts.image}
          alt='post cover'
          className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
   
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{posts.title}</p>
        <span className='italic text-sm'>{posts.category}</span>
        <p className='text-sm'>
          By <Link to={`/profile/${posts.userId}`}><span className='font-semibold'>{authorName}</span></Link> on {formattedDate}
        </p>
        <Link
          to={`/post/${posts.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
