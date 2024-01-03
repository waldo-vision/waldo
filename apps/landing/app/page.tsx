import { Text } from '@chakra-ui/layout';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Button, RecArray, WaldoButton } from 'ui';
const test = () => {
  return (
    <div className="flex flex-col max-h-screen h-screen w-screen bg-[#16182c] ">
      <div className="flex flex-row items-center w-full justify-evenly my-auto h-full">
        <div className="flex flex-col max-w-md">
          <div className="flex flex-col">
            <div>
              <h1 className="text-white text-3xl lg:text-5xl md:text-3xl font-bold">
                Protecting the
              </h1>
            </div>
            <div className="flex">
              <h1 className=" bg-gradient-to-r from-[#6F1DD8] to-[#A21CAF] text-transparent bg-clip-text font-bold text-3xl lg:text-5xl md:text-3xl py-1">
                Integrity{' '}
                <span className="text-white text-3xl lg:text-5xl md:text-3xl font-bold">
                  of Gaming
                </span>
              </h1>
            </div>
          </div>
          <h2 className="text-[#B4B4B5] font-medium mt-4 leading-7 text-sm">
            Discover waldo, where principles of fairness, honesty, and
            sportsmanship are upheld in the world of competitive gaming.
          </h2>
          <div className="flex flex-row gap-4 items-center">
            <WaldoButton className="text-sm text-white">Learn More</WaldoButton>
            <div className="mt-4 flex flex-row gap-2 cursor-pointer transition hover:bg-[#E545FF] hover:bg-opacity-[0.07] duration-300 ease-in-out p-4 hover:rounded-md">
              <h1 className="text-white font-semibold text-sm">
                Go to Dashboard
              </h1>
              <ArrowRightIcon height={20} width={20} color="white" />
            </div>
          </div>
        </div>
        <div className="mr-12 hidden lg:flex md:flex">
          <RecArray />
        </div>
      </div>
    </div>
  );
};

export default test;
