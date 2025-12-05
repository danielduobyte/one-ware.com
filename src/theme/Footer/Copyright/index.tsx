import React, { type ReactNode } from 'react';
import type { Props } from '@theme/Footer/Copyright';
import Translate from '@docusaurus/Translate';
import { useTracking } from '../../../context/TrackingContext';

export default function FooterCopyright({ copyright }: Props): ReactNode {
  const { resetConsent } = useTracking();

  return (
    <div className="footer__copyright text-sm text-gray-400 leading-relaxed">
      <div
        dangerouslySetInnerHTML={{ __html: copyright }}
      />

      <p className="mt-2 opacity-70 text-xs">
        This site is protected by reCAPTCHA and the Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#00FFD1] transition-colors"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#00FFD1] transition-colors"
        >
          Terms of Service
        </a>{' '}
        apply.
        {' · '}
        <button
          onClick={resetConsent}
          className="underline hover:text-[#00FFD1] transition-colors"
        >
          <Translate id="cookies.settings">Cookie Settings</Translate>
        </button>
      </p>
    </div>
  );
}
