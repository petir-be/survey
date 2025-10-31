import React from "react";
import "../global.css";
import DotShader from "../components/DotShader";
import home1 from "/src/assets/2.svg";
import HomeBox from "../components/HomeBox";
import aboutus from "../assets/hugeicons_ai-dna.svg";


//testing

//testing ulit
//added testing package

function Home() {
  return (
    <>
      <div className="flex items-center flex-1 min-h-full bg-[var(--white)] z-10">
        <div className="w-2/7 h-dvh pt-25">
          <div className="m-15 bg-red-300">
            <h1 className="font-vagrounded text-4xl mb-2">The Future</h1>
            <p className="font-vagrounded text-md">
              This where data isn't just gathered—it’s synthesized,
              contextualized, and transformed. Step into the future-state
              datascape to pioneer transformative insights using self-optimizing
              architectures. The next era of predictive analytics starts here.
            </p>
          </div>
        </div>
        <div className="w-3/7 relative h-dvh overflow-hidden pt-15 border-2 border-[var(--dirty-white)] bg-[var(--white)] z-10">
          <div className="absolute z-1 w-full">
            <img src={home1} alt="aa" width={800} height={800} />
          </div>
          <div className="absolute top-0 left-0 h-full w-full">
            <DotShader className="z-0" />
            <span className="home-circle mixed-blend-multiply -top-40 left-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleLtR"></span>{/*top left*/}
            <span className="home-circle mixed-blend-multiply -top-38 right-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleRtL"></span>{/*top right*/}
            <span className="home-circle mixed-blend-multiply -bottom-32 left-1 w-30 h-30 bg-[var(--pink)] animate-moveCircleLtR"></span>{/*bottom left*/}
            <span className="home-circle mixed-blend-multiply -bottom-38 right-1 w-45 h-45 bg-[var(--purple)] animate-moveCircleRtL"></span>{/*bottom right*/}
          </div>
        </div>
        <div className="w-2/7 h-dvh pt-29">
            <HomeBox title = "About us" icon={aboutus}/>
            <HomeBox title = "About us" icon={aboutus}/>
            <HomeBox title = "About us" icon={aboutus}/>
        
        </div>
      </div>
    </>
  );
}
export default Home;

