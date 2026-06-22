// create a navbar with devault ai logo at left and browse and submit button at right and use tailwind css to style it
import Link from "next/link";

export default function Navbar() {
    return (

<div className="overflow-hidden rounded-[14px] border border-border-tertiary bg-bg-primary">
        <div className="flex items-center justify-between border-b border-border-tertiary bg-bg-secondary px-5 py-3">
          
          <div className="text-[15px] font-semibold text-text-primary">
            devault-ai
          </div>
  
          <div className="flex items-center gap-4">
            <span className="cursor-pointer text-[13px] text-text-secondary transition-colors duration-150 hover:text-text-primary">
              Browse
            </span>
  
            <span className="cursor-pointer text-[13px] text-text-secondary transition-colors duration-150 hover:text-text-primary">
              Submit
            </span>
  
            <button
              aria-label="toggle dark mode"
              className="flex h-[17px] w-[30px] items-center rounded-full bg-gray-600 p-[2px]"
            >
              <span className="h-[13px] w-[13px] rounded-full bg-white"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
