import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';
import { A11yAnnouncer } from '../components/A11yAnnouncer';
import { Header } from '../components/Header';

describe('Accessibility & WCAG 2.1 AA Compliance Suite', () => {
  it('renders LegalDisclaimerBanner with accessible ARIA landmarks and expandable toggle', () => {
    render(<LegalDisclaimerBanner />);
    
    // Landmark
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Legal Disclaimer and Regulatory Notice');

    // Toggle button
    const toggleBtn = screen.getByRole('button', { name: /Regulatory Guidelines/i });
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    // Expanding
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Less Details/i)).toBeInTheDocument();
  });

  it('renders A11yAnnouncer with live region attributes for screen readers', () => {
    const { container } = render(<A11yAnnouncer message="Document analysis complete" />);
    const liveRegion = container.querySelector('[aria-live="polite"]');

    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('role', 'status');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    expect(liveRegion).toHaveTextContent('Document analysis complete');
  });

  it('renders Header with proper tablist semantics and contrast toggles', () => {
    render(
      <Header
        activeTab="simplifier"
        onTabChange={() => {}}
        isDarkMode={false}
        onToggleDarkMode={() => {}}
        isHighContrast={false}
        onToggleHighContrast={() => {}}
        fontSizeLevel="normal"
        onCycleFontSize={() => {}}
        hasApiKey={false}
        onOpenApiModal={() => {}}
      />
    );

    // Tablist exists
    const tablists = screen.getAllByRole('tablist');
    expect(tablists.length).toBeGreaterThan(0);

    // Simplifier tab is selected (checking first desktop tab)
    const simplifierTabs = screen.getAllByRole('tab', { name: /Simplifier/i });
    expect(simplifierTabs[0]).toHaveAttribute('aria-selected', 'true');

    // Contrast toggle has aria-pressed
    const contrastBtn = screen.getByRole('button', { name: /Toggle High Contrast Mode/i });
    expect(contrastBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
