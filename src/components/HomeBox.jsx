

export default function HomeBox({icon, title}){
    return(
        <>
            <div className="mx-10 my-3 p-5 h-35 relative flex flex-col border-2 border-[var(--dirty-white)]">
                <div className="absolute flex items-center justify-center top-0 right-0 w-9 h-9 bg-[var(--dirty-white)]">
                    <button className="w-full h-full font-bold">
                        X
                    </button>
                </div>
                <img src={icon} alt="" width={25} height={25}/>
                <p className="text-md font-vagrounded mt-1 font-bold">{title}</p>
            </div>
        </>
    )
}