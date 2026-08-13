import React from 'react'
interface OptionProps{
    label:string,
    value:any
}
   

interface InputPageBuilderProps{
    onDelete:()=>{},
    onChange:(e:any)=>void
    label:any
    optionsCategory:OptionProps[]
    templateCategory:OptionProps[]
    value:string[]
}
const InputPageBuilder = () => {
  return (
    <div>InputPageBuilder</div>
  )
}

export default InputPageBuilder