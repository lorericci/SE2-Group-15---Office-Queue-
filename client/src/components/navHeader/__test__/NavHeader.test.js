import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import NavHeader from "../NavHeader.tsx";

describe('NavHeader', () => {
    it('render NavHeader Component', () => {
      render(<NavHeader />);
  
      const navbarElement = screen.getByRole('navbar');
      expect(navbarElement).toBeInTheDocument();
  
      const brandElement = screen.getByText('Office Queue');
      expect(brandElement).toBeInTheDocument();
    });
  });