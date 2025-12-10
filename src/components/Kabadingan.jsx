


import React, { useState } from 'react';



function Kabadingan(){


  // State to track the currently active item


  const navItems = [
    'Getting started with CMEN',
    'Our Survey is Built Different',
    'Best Practices'
    
  ];  const [activeItem, setActiveItem] = useState(navItems[0]);
  
    return(<>
    <div className="my-[150px] mx-[100px]">
<div className="flex justify-between items-center">

<div className="flex flex-col  justify-center">
<span className="text-[40px] font-semibold">CMEN FAQ</span>
<p className="text-[16px] max-w-[500px]"> If you're new to C-MEN or looking for creating
    a surveys for just a minutes, this guide will 
    help you learn more about the platform and its features.
</p>
<div className="flex flex-col mt-[40px] justify-center">
<span className="text-[12px]">Already have a CMEN account?</span>
<span className="text-[12px] font-semibold">Create forms Now</span></div>

</div>
<span className="text-[150px] items-center">🔍💡👀</span>
<div className="flex flex-col">
</div>
</div>

 <div className="flex mt-[150px]">
        <nav className="relative pl-2">
         <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300"></div>
        <ul>
          {navItems.map((item) => (
            <li key={item} className="mb-4">
              <button
                onClick={() => setActiveItem(item)}
                // Apply conditional styling for the active state
                className={`
                  text-left w-full py-1 px-4 duration-200  ease-in-out
                  ${activeItem === item
                    ? 'text-black font-semibold border-l-4 border-black' // Active state: Black text, bold, 4px left border
                    : 'text-gray-500 hover:text-gray-700 hover:border-l-4 hover:border-gray-400 ' // Inactive state: Gray text, hover effect
                  }
                `}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
</div>






</>
    )
}
export default Kabadingan