import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  HardwareType,
  OperatingSystem,
  IntegrationMethod,
  ExportOption,
  hardwareTypeLabels,
  osLabels,
  integrationLabels,
} from '../../types/partnerFilterTypes';
import { partnerFilterData } from '../../data/partnerFilterData';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label: string;
  stepNumber: number;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  placeholder?: string;
}

function CustomDropdown({ label, stepNumber, value, onChange, options, disabled, placeholder }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: value
              ? '#00FFD1'
              : disabled
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 255, 209, 0.15)',
            border: value ? 'none' : '1px solid rgba(0, 255, 209, 0.3)',
            color: value ? '#000' : disabled ? '#555' : '#00FFD1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          {value ? '✓' : stepNumber}
        </span>
        <span
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: disabled ? '#666' : '#ffffff',
          }}
        >
          {label}
        </span>
      </div>

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: disabled
            ? 'rgba(255, 255, 255, 0.02)'
            : isOpen
            ? 'rgba(0, 255, 209, 0.08)'
            : value
            ? 'rgba(0, 255, 209, 0.05)'
            : 'rgba(255, 255, 255, 0.05)',
          border: isOpen
            ? '1px solid rgba(0, 255, 209, 0.5)'
            : value
            ? '1px solid rgba(0, 255, 209, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: isOpen ? '14px 14px 0 0' : '14px',
          color: disabled ? '#555' : value ? '#00FFD1' : '#e0e0e0',
          fontSize: '15px',
          fontWeight: value ? '600' : '400',
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{selectedLabel || placeholder || `${label} wählen...`}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={disabled ? '#555' : '#00FFD1'}
          strokeWidth="2.5"
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(20, 22, 28, 0.98)',
            border: '1px solid rgba(0, 255, 209, 0.3)',
            borderTop: 'none',
            borderRadius: '0 0 14px 14px',
            overflow: 'hidden',
            zIndex: 100,
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          {options.map((opt, index) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: opt.value === value
                  ? 'linear-gradient(90deg, rgba(0, 255, 209, 0.2), rgba(0, 255, 209, 0.1))'
                  : 'transparent',
                border: 'none',
                borderBottom: index < options.length - 1 ? '1px solid rgba(0, 255, 209, 0.1)' : 'none',
                color: opt.value === value ? '#00FFD1' : '#e0e0e0',
                fontSize: '14px',
                fontWeight: opt.value === value ? '600' : '400',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(0, 255, 209, 0.1), rgba(0, 255, 209, 0.05))';
                  e.currentTarget.style.color = '#00FFD1';
                }
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e0e0e0';
                }
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: opt.value === value ? 'none' : '2px solid rgba(0, 255, 209, 0.3)',
                  background: opt.value === value ? '#00FFD1' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {opt.value === value && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportCard({ option }: { option: ExportOption }) {
  return (
    <div
      style={{
        background: 'rgba(0, 255, 209, 0.03)',
        border: '1px solid rgba(0, 255, 209, 0.15)',
        borderRadius: '14px',
        padding: '18px 22px',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 209, 0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 255, 209, 0.15)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: option.toolchain || option.description || option.docLink || option.tutorialLink ? '14px' : '0',
        }}
      >
        <span
          style={{
            background: '#00FFD1',
            color: '#000',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Export
        </span>
        <span
          style={{
            color: '#ffffff',
            fontSize: '17px',
            fontWeight: 'bold',
          }}
        >
          {option.format}
        </span>
      </div>

      {option.toolchain && (
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: 'rgba(0, 255, 209, 0.7)', fontSize: '13px', fontWeight: '500' }}>Toolchain: </span>
          <span style={{ color: '#ffffff', fontSize: '14px' }}>{option.toolchain}</span>
        </div>
      )}

      {option.description && (
        <div style={{ marginBottom: '10px' }}>
          <span style={{ color: '#e0e0e0', fontSize: '14px' }}>{option.description}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
        {option.docLink && (
          <a
            href={option.docLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00FFD1',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              padding: '6px 12px',
              background: 'rgba(0, 255, 209, 0.1)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 209, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 209, 0.1)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Docs
          </a>
        )}
        {option.tutorialLink && (
          <a
            href={option.tutorialLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00FFD1',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              padding: '6px 12px',
              background: 'rgba(0, 255, 209, 0.1)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 209, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 209, 0.1)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Tutorial
          </a>
        )}
      </div>
    </div>
  );
}

export default function PartnerFilterWizard() {
  const [selectedType, setSelectedType] = useState<HardwareType | ''>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [selectedOS, setSelectedOS] = useState<OperatingSystem | ''>('');
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationMethod | ''>('');

  const hardwareTypes = useMemo(() => {
    return Object.entries(hardwareTypeLabels).map(([value, label]) => ({
      value,
      label,
    }));
  }, []);

  const vendors = useMemo(() => {
    if (!selectedType) return [];
    const typeConfig = partnerFilterData[selectedType];
    if (!typeConfig) return [];
    return Object.entries(typeConfig.vendors).map(([key, vendor]) => ({
      value: key,
      label: vendor.name,
    }));
  }, [selectedType]);

  const osOptions = useMemo(() => {
    if (!selectedType || !selectedVendor) return [];
    const vendor = partnerFilterData[selectedType]?.vendors[selectedVendor];
    if (!vendor) return [];
    return vendor.supportedOS.map((os) => ({
      value: os,
      label: osLabels[os],
    }));
  }, [selectedType, selectedVendor]);

  const integrationMethods = useMemo(() => {
    if (!selectedType || !selectedVendor || !selectedOS) return [];
    const vendor = partnerFilterData[selectedType]?.vendors[selectedVendor];
    if (!vendor) return [];

    const availableMethods: { value: string; label: string }[] = [];
    Object.entries(integrationLabels).forEach(([method, label]) => {
      if (vendor.integrations[method as IntegrationMethod]) {
        availableMethods.push({ value: method, label });
      }
    });
    return availableMethods;
  }, [selectedType, selectedVendor, selectedOS]);

  const exportOptions = useMemo((): ExportOption[] => {
    if (!selectedType || !selectedVendor || !selectedOS || !selectedIntegration) return [];
    const vendor = partnerFilterData[selectedType]?.vendors[selectedVendor];
    if (!vendor) return [];
    return vendor.integrations[selectedIntegration as IntegrationMethod] || [];
  }, [selectedType, selectedVendor, selectedOS, selectedIntegration]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value as HardwareType | '');
    setSelectedVendor('');
    setSelectedOS('');
    setSelectedIntegration('');
  };

  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
    setSelectedOS('');
    setSelectedIntegration('');
  };

  const handleOSChange = (value: string) => {
    setSelectedOS(value as OperatingSystem | '');
    setSelectedIntegration('');
  };

  const handleReset = () => {
    setSelectedType('');
    setSelectedVendor('');
    setSelectedOS('');
    setSelectedIntegration('');
  };

  const hasSelection = selectedType || selectedVendor || selectedOS || selectedIntegration;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 209, 0.05), rgba(0, 255, 209, 0.01))',
        border: '1px solid rgba(0, 255, 209, 0.15)',
        borderRadius: '20px',
        padding: '32px',
        marginTop: '32px',
        marginBottom: '40px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(0, 255, 209, 0.15)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00FFD1" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Finde deine Hardware
        </h3>
        {hasSelection && (
          <button
            onClick={handleReset}
            style={{
              padding: '10px 18px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: '#a0a0a0',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 100, 100, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 100, 100, 0.4)';
              e.currentTarget.style.color = '#ff6464';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#a0a0a0';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Zurücksetzen
          </button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: exportOptions.length > 0 ? '32px' : '0',
        }}
      >
        <CustomDropdown
          label="Hardware-Typ"
          stepNumber={1}
          value={selectedType}
          onChange={handleTypeChange}
          options={hardwareTypes}
          placeholder="Wähle einen Hardware-Typ..."
        />

        <CustomDropdown
          label="Hersteller"
          stepNumber={2}
          value={selectedVendor}
          onChange={handleVendorChange}
          options={vendors}
          disabled={!selectedType}
          placeholder={selectedType ? 'Wähle einen Hersteller...' : 'Zuerst Hardware-Typ wählen'}
        />

        <CustomDropdown
          label="Betriebssystem"
          stepNumber={3}
          value={selectedOS}
          onChange={handleOSChange}
          options={osOptions}
          disabled={!selectedVendor}
          placeholder={selectedVendor ? 'Wähle ein Betriebssystem...' : 'Zuerst Hersteller wählen'}
        />

        <CustomDropdown
          label="Integrations-Methode"
          stepNumber={4}
          value={selectedIntegration}
          onChange={(v) => setSelectedIntegration(v as IntegrationMethod | '')}
          options={integrationMethods}
          disabled={!selectedOS}
          placeholder={selectedOS ? 'Wähle eine Integrations-Methode...' : 'Zuerst Betriebssystem wählen'}
        />
      </div>

      {exportOptions.length > 0 && (
        <div
          style={{
            background: 'rgba(0, 255, 209, 0.05)',
            border: '1px solid rgba(0, 255, 209, 0.2)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#00FFD1',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Verfügbare Export-Optionen
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {exportOptions.map((option, index) => (
              <ExportCard key={`${option.format}-${index}`} option={option} />
            ))}
          </div>
        </div>
      )}

      {selectedIntegration && exportOptions.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '24px',
            background: 'rgba(255, 200, 0, 0.1)',
            border: '1px solid rgba(255, 200, 0, 0.3)',
            borderRadius: '14px',
            color: '#ffc800',
            fontSize: '15px',
          }}
        >
          Für diese Kombination sind keine Export-Optionen verfügbar.
        </div>
      )}
    </div>
  );
}
