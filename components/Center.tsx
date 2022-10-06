import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
//@ts-ingore
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
const colors: String[] = [
  "from-slate-500",
  "from-orange-500",
  "from-amber-500",
  "from-yellow-500",
  "from-lime-500",
  "from-green-500",
  "from-emerald-500",
  "from-cyan-500",
  "from-sky-500",
  "from-purple-500",
  "from-rose-500",
  "from-indigo-500",
];
const Center = () => {
  const { data: session }: any = useSession();
  const [color, setColor] = useState<String | undefined | null>(null);
  const playlistId = useRecoilValue<any>(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState);
  const spotifyApi = useSpotify();
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);
  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        // @ts-ignore
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="hidden md:flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 "
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-10 h-10"
            //@typescript-ignore
            src={`${session?.user.image}`}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 `}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
