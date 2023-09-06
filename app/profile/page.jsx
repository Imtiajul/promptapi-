'use client'

import { useState, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Profile from '@components/Profile'

const MyProfile = () => {
   const [posts, setPosts] = useState('')

   const { data: session } = useSession();
   const router = useRouter();


   useEffect(() => {
      const fetchData = async () => {
         const response = await fetch(`/api/user/${session?.user.id}/posts`);
         const data = await response.json();
         setPosts(data);
      }

      if(session?.user.id) fetchData();
   }, []);
    
   const handleEdit = (post) => {
      router.push(`/update-prompt?id=${post._id}`)
   }

   const handleDelete = async (post) => {
      const hasConfirmed = confirm('Are you sure you want to delete?');

      if(hasConfirmed) {
         try {
            await fetch(`/api/prompt/${post._id.toString()}`, {
               method: 'DELETE',
            });
            const filteredPosts = posts.filter( (p) => {
               p.id !== post._id;
            })

            setPosts(filteredPosts);

         } catch (error) {
            console.error(error);
         }
      }
   }
   return (
      <Profile
         name="My"
         desc="Welcome to your personalized profile page"
         data={posts}
         handleEdit={handleEdit}
         handleDelete={handleDelete}
      />
   )
}

export default MyProfile