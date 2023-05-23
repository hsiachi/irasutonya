import { ConfigContext } from "@/context/config";
import { useContext } from "react";

export default function useConfig() {
  const { config, setConfig } = useContext(ConfigContext);
  const setRephrase = (flag: boolean) => {
    setConfig({ ...config, rephrase: flag });
  };
  const setDiverseReply = (flag: boolean) => {
    setConfig({ ...config, diverseReply: flag });
  };
  const setTopKReturn = (value: number) => {
    setConfig({ ...config, topKReturn: value });
  };

  return { config, setRephrase, setDiverseReply, setTopKReturn };
}
