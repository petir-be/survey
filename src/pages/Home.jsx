import React from 'react';
import '../global.css';
import DotShader from '../components/DotShader';
import home1 from '/src/assets/2.svg';

//testing

//testing ulit
//added testing package


function Home() {
    return (
        <>
            <div className='flex flex-col items-center justify-center min-h-full bg-[var(--white)] z-10'>
                
                <div className='absolute z-2'><img src={home1} alt="aa" width={750} height={750}/></div>
                <div className='relative h-screen w-2/5 border-2 border-[var(--dirty-white)] bg-[var(--white)] overflow-hidden'>
                    <DotShader className="z-0"/>
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