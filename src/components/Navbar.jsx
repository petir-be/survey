import React from 'react';

function NavBar() {
    return (
        <>
            <nav className='absolute w-full'>
                <div className='flex border-2 border-[var(--dirty-white)] justify-between py-8 px-20'>
                    <h1>C-MEN</h1>
                    <div>
                        Get Started
                    </div>
                </div>
            </nav>
        </>
    )

}
export default NavBar;