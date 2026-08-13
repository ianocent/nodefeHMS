import React, { ReactNode } from 'react'
interface PaperProps{
    title:string
    children:ReactNode
    goToAdd:()=>void
}
const Paper = (props:PaperProps) => {
    const {title,children,goToAdd}=props
  return (
    <div className='bg-white rounded-t-lg'>
        <div className='mt-4 p-4 flex gap-4 justify-between items-center '>
            <h2 className='text-xl font-bold'>{title}</h2>
            <button className='bg-[#766FB6] text-white rounded text-[14px] rounded-md leading-[19px]   p-2' onClick={()=>goToAdd()}>+ Add Gallery</button>
        </div>
        <div className='w-full border-dashed border'></div>
        <div className='mt-2 px-4 py-2'>
            {children}
        </div>
    </div>
  )
}

export default Paper