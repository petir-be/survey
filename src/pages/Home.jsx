import React from 'react';
import '../global.css';

//testing

//testing ulit

function Home() {
    return (
        <>
            <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
                <div className='relative h-screen w-2/5 bg-neutral-100'>
                    <span className='home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleLtR'></span> {/*top left*/}
                    <span className='home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleRtL'></span> {/*top right*/}
                    <span className='home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleLtR'></span> {/*bottom left*/}
                    <span className='home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleRtL'></span> {/*bottom right*/}
                </div>

            </div>
        </>
    )

}
export default Home;