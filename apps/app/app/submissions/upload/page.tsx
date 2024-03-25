'use client';
import { useSession } from '@contexts/SessionContext';
import React, { useState, useEffect } from 'react';
import { TbReload } from 'react-icons/tb';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  useToast,
  Button,
} from 'ui';

interface GameItem {
  name: string;
  id: string;
}

interface CheatItem {
  name: string;
  id: string;
}

const Upload = () => {
  const { toast } = useToast();
  const s = useSession();
  const session = s?.session;

  const [loading, setLoading] = useState<boolean>(false);
  const [permissionCheck, setPermissionCheck] = useState<boolean>(false);
  const [containCheck, setContainCheck] = useState<boolean>(false);
  const [violationAgreement, setViolationAgreement] = useState<boolean>(false);
  const [gameplayUrl, setGameplayUrl] = useState<string>('');

  const [gameplayType, setGameplayType] = useState<GameItem>();
  const [cheatType, setCheatType] = useState<CheatItem>();

  const togglePermissionCheck = () => setPermissionCheck(!permissionCheck);
  const toggleContainCheck = () => setContainCheck(!containCheck);
  const toggleViolationAgreement = () =>
    setViolationAgreement(!violationAgreement);

  const handleUrlInput = (url: string) => {
    if (url.length > 0) {
      setGameplayUrl('https:' + url);
    } else {
      setGameplayUrl('');
    }
  };

  const submit = async () => {
    setLoading(true);
    // check a few things
    console.log(permissionCheck);
    if (!violationAgreement || !containCheck || !permissionCheck) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please agree to all of the terms.',
      });
    }
    if (gameplayUrl.length < 1) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Please input your url.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full text-black gap-6 px-12 h-full">
      <div className="flex flex-row gap-2">
        <h1 className=" bg-gradient-to-r from-sigp to-[#A21CAF] text-transparent bg-clip-text font-bold text-2xl">
          Upload
        </h1>
        <span className="text-white text-2xl font-bold">your gameplay</span>
      </div>
      <div className="w-full h-full flex border-0 border-dashed mb-12 rounded-xl ">
        {/* Upload Container Pri */}

        <div className="flex px-6 py-5 w-full">
          <div className="flex flex-col w-full gap-6">
            <div>
              <h1 className="text-white font-semibold text-lg">Video URL:</h1>
              <Input
                onChange={event => handleUrlInput(event.target.value)}
                placeholder={'https://outplayed.tv/clip/dfsdgfdg'}
                className="mt-2 w-full text-white placeholder:text-gray-500 font-medium border-[1.5px] border-gray-500 bg-transparent"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <h1 className="text-white font-semibold text-lg">
                Clip Attributes:
              </h1>
              <div className="flex flex-row gap-6">
                <Select>
                  <SelectTrigger className="w-[180px] bg-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none text-white rounded-lg">
                    <SelectValue placeholder="Select a Game:" />
                  </SelectTrigger>
                  <SelectContent className=" text-white bg-black border-none ">
                    {games.map((game, index) => (
                      <SelectItem
                        key={index}
                        value={game.id}
                        className="cursor-pointer hover:bg-sigp ho"
                      >
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {session &&
                  session.scope.includes('write:Gameplay:verified') && (
                    <Select>
                      <SelectTrigger className="w-[180px] bg-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none text-white rounded-lg">
                        <SelectValue placeholder="Select a Cheat:" />
                      </SelectTrigger>
                      <SelectContent className=" text-white bg-black border-none ">
                        {cheats.map((cheat, index) => (
                          <SelectItem
                            key={index}
                            value={cheat.id}
                            className="cursor-pointer hover:bg-sigp ho"
                          >
                            {cheat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
              </div>
              <div className="flex mt-6 flex-col gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    className="border-bg-black"
                    onCheckedChange={() => togglePermissionCheck()}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    Do you have permission from the owner to submit?
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    className="border-bg-black"
                    onCheckedChange={() => toggleContainCheck()}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    Does this clip contain the selected game footage?
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    className="border-bg-black"
                    onCheckedChange={() => toggleViolationAgreement()}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                  >
                    I understand any violations I make will result in a
                    suspension.
                  </label>
                </div>
              </div>
              <div>
                <Button
                  className="bg-white hover:bg-white text-black px-4 mt-3 font-semibold"
                  onClick={() => submit()}
                  disabled={loading}
                >
                  {loading && (
                    <TbReload className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const games: GameItem[] = [
  {
    name: 'Counter Strike: Global Offensive',
    id: 'CSGO',
  },
  {
    name: 'VALORANT',
    id: 'VALO',
  },
  {
    name: 'Team Fortress 2',
    id: 'TF2',
  },
  {
    name: 'Apex Legends',
    id: 'APEX',
  },
  {
    name: 'Call of Duty: Warzone',
    id: 'CODW',
  },
  {
    name: 'Rainbow Six Siege',
    id: 'R6S',
  },
  {
    name: 'Overwatch 2',
    id: 'OW2',
  },
  {
    name: 'Counter Strike 2',
    id: 'CS2',
  },
];

const cheats: CheatItem[] = [
  {
    name: 'No Cheat',
    id: 'NOCHEAT',
  },
  {
    name: 'Aimbot',
    id: 'AIMBOT',
  },
  {
    name: 'Trigger Bot',
    id: 'TRIGGERBOT',
  },
  {
    name: 'ESP',
    id: 'ESP',
  },
  {
    name: 'Spinbot',
    id: 'Spinbot',
  },
];

export default Upload;
