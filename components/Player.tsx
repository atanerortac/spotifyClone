import {
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import { isPlayingState } from "../atoms/songAtom";

import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState<number>(50);

  const songInfo: any = useSongInfo();
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data: any) => {
        console.log("Now Playing: ", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data: any) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 250),
    []
  );
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
      console.log(songInfo?.album?.images?.[1]?.url);
    }
  }, [currentTrackIdState, spotifyApi, session]);
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-1 md:grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="hidden md:flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly ">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon className="button" />
        {isPlaying ? (
          <div
            onClick={handlePlayPause}
            className="w-10 h-10 bg-white justify-center items-center flex rounded-full button"
          >
            <PauseIcon className="h-5 w-5 cursor-pointer text-black ml-0" />
          </div>
        ) : (
          <div
            onClick={handlePlayPause}
            className="w-10 h-10 bg-white justify-center items-center flex rounded-full button"
          >
            <PlayIcon className="h-5 w-5 cursor-pointer text-black ml-0" />
          </div>
        )}

        <ForwardIcon className="button" />
        <ArrowUturnLeftIcon className="button" />
      </div>
      <div className=" items-center space-x-3 md:space-x-4 justify-end pr-5 hidden md:flex ">
        <SpeakerXMarkIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28  accent-white hover:accent-green-600 "
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <SpeakerWaveIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;
