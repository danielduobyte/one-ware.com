export type HardwareType =
  | 'fpga'
  | 'microcontroller'
  | 'embedded_soc'
  | 'cpu'
  | 'gpu_tpu_npu'
  | 'plc'
  | 'sbc'
  | 'ipc';

export type OperatingSystem = 'none' | 'windows' | 'linux' | 'mac';

export type IntegrationMethod = 'prebuilt_ui' | 'easy_integration' | 'fast_inference';

export interface ExportOption {
  format: string;
  toolchain?: string;
  docLink?: string;
  tutorialLink?: string;
  description?: string;
}

export interface VendorConfig {
  name: string;
  supportedOS: OperatingSystem[];
  integrations: {
    [key in IntegrationMethod]?: ExportOption[];
  };
}

export interface HardwareTypeConfig {
  label: string;
  vendors: Record<string, VendorConfig>;
}

export type PartnerFilterData = Record<HardwareType, HardwareTypeConfig>;

export const hardwareTypeLabels: Record<HardwareType, string> = {
  fpga: 'FPGA',
  microcontroller: 'Microcontroller',
  embedded_soc: 'Embedded SoC (Linux)',
  cpu: 'CPU',
  gpu_tpu_npu: 'GPU / TPU / NPU',
  plc: 'PLC (Industrial Control)',
  sbc: 'Single Board Computer',
  ipc: 'Industrial PC',
};

export const osLabels: Record<OperatingSystem, string> = {
  none: 'Kein Betriebssystem',
  windows: 'Windows',
  linux: 'Linux',
  mac: 'macOS',
};

export const integrationLabels: Record<IntegrationMethod, string> = {
  prebuilt_ui: 'Vorgefertigte UI (ONE WARE Studio)',
  easy_integration: 'Eigene Software (einfache Integration)',
  fast_inference: 'Eigene Software (schnelle Inferenz)',
};
