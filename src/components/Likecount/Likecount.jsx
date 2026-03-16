import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { success } from 'zod'

export default function Likecount({ value }) {


   function handleLikecount(){
      return  axios.put(`https://route-posts.routemisr.com/posts/${value.id}/like`, undefined, { headers: { token: localStorage.getItem('tkn') } }})
}

const { mutate, data ,isSuccess} = useMutation({
    mutationFn: handleLikecount,
    onSuccess: () => {
        

    },

})

  return (
  
  )


}
