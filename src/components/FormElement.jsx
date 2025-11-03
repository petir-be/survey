

function FormElement({title, icon: Icon}){

    return(
    <>
        <div className="w-full h-28 flex flex-col ring ring-white overflow-hidden font-vagrounded gap-2 items-center justify-center rounded-xl shadow-[0px_1px_4px_2px_rgba(0,0,0,0.25)]">
            <Icon className="text-3xl text-(--black)" />
            <p className="w-11/12 text-md text-center">{title}</p>
        </div>    


    </>)
}
export default FormElement;