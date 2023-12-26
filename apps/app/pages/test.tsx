import React from 'react';
import { Button, RecArray, WaldoButton } from 'ui';
const test = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#16182c] ">
      <div className="flex flex-row items-center w-full justify-evenly my-auto h-full">
        <div className="flex flex-col max-w-md">
          <div className="flex flex-col">
            <div>
              <h1 className="text-white text-5xl font-bold">Protecting the</h1>
            </div>
            <div className="flex">
              <h1 className=" bg-gradient-to-r from-[#6F1DD8] to-[#A21CAF] text-transparent bg-clip-text font-bold text-5xl py-1">
                Integrity{' '}
                <span className="text-white text-5xl font-bold">of Gaming</span>
              </h1>
            </div>
          </div>
          <h2 className="text-[#B4B4B5] font-medium mt-4 leading-7 text-sm">
            Discover waldo, where principles of fairness, honesty, and
            sportsmanship are upheld in the world of competitive gaming.
          </h2>
          <div className="flex flex-row">
            <WaldoButton className="text-sm text-white">Learn More</WaldoButton>
          </div>
        </div>
        <div className="mr-12">
          <RecArray />
        </div>
      </div>
    </div>
  );
};

export default test;
