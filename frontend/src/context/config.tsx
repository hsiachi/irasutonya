import { createContext, useState } from "react";

type Config = {
  rephrase: boolean;
  diverseReply: boolean;
  topKReturn: number;
};

const initConfig: Config = {
  rephrase: false,
  diverseReply: false,
  topKReturn: 5,
};

type ConfigContextType = {
  config: Config;
  setConfig: (config: Config) => void;
};

export const ConfigContext = createContext<ConfigContextType>({
  config: initConfig,
  setConfig: () => {},
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config>(initConfig);
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}
